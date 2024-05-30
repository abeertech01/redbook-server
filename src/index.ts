import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { errorMiddleware } from "./middlewares/error"

import userRoutes from "./routes/user.route"
import chatRoutes from "./routes/chat.route"

dotenv.config({
  path: "./.env.local",
})

const app: Express = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server")
})

// Routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/chat", chatRoutes)

// error Middleware
app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
