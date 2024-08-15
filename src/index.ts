import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import { createServer } from "http"
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorMiddleware } from "./middlewares/error"

import userRoutes from "./routes/user.route"
import chatRoutes from "./routes/chat.route"
import { Server } from "socket.io"
import { corsOptions } from "./constants/config"
import { NEW_CHAT, NEW_MESSAGE } from "./constants/events"
import { ExtendedSocket, socketAuthenticator } from "./middlewares/auth"
import prisma from "./lib/prismadb"
import { getSockets } from "./lib/helpers"

dotenv.config({
  path: "./.env.local",
})

const userSocketIDs = new Map()

const app: Express = express()
const port = process.env.PORT || 3000
const server = createServer(app)
const io = new Server(server, {
  cors: corsOptions,
})

app.set("io", io)

// Using Middlewares here
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors(corsOptions))

// Routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/chat", chatRoutes)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server | Abeer")
})

io.use((socket, next) => {
  const request = socket.request as express.Request & { res: express.Response }
  cookieParser()(
    request,
    request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  )
})

io.on("connection", (socket: ExtendedSocket) => {
  const user = socket.user
  userSocketIDs.set(user?.id.toString(), socket.id)

  socket.on(NEW_CHAT, async ({ participantId }) => {
    const chatterSocket = getSockets([participantId, socket.user?.id])

    try {
      if (participantId === socket.user?.id)
        throw Error("You cannot chat with yourself")

      const record = await prisma.chat.findFirst({
        where: {
          OR: [
            {
              creatorId: socket.user?.id,
              members: {
                some: { id: participantId },
              },
            },
            {
              creatorId: participantId,
              members: {
                some: { id: socket.user?.id },
              },
            },
          ],
        },
      })

      if (record) throw Error("Chat already exists!")

      const newChat = await prisma.chat.create({
        data: {
          creatorId: socket.user?.id!,
          members: {
            connect: [{ id: participantId }, { id: socket.user?.id }],
          },
        },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      })

      io.to(chatterSocket).emit(NEW_CHAT, newChat)
    } catch (error: any) {
      throw new Error(error)
    }
  })

  socket.on(NEW_MESSAGE, async ({ chatId, message: msg }) => {
    try {
      const newMessage = await prisma.message.create({
        data: {
          chatId: chatId as string,
          authorId: socket.user?.id as string,
          text: msg as string,
        },
      })

      const theChat = await prisma.chat.findUnique({
        where: { id: chatId as string },
        include: {
          members: true,
        },
      })

      const chatterSocket = getSockets(
        theChat?.members?.map((member) => member.id)
      )

      io.to(chatterSocket).emit(NEW_MESSAGE, { newMessage })
    } catch (error: any) {
      throw new Error(error)
    }
  })
})

// error Middleware
app.use(errorMiddleware)

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})

export { userSocketIDs }
