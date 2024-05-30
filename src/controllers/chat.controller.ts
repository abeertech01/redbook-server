import { NextFunction, Response } from "express"
import { TryCatch } from "../middlewares/error"
import { IRequest } from "../utils/types"
import prisma from "../lib/prismadb"
import { ErrorHandler } from "../utils/utility"
import { getAllChats } from "../lib/helpers"

const createChat = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { participantIds } = req.body

    if (participantIds[0] === req.id)
      return next(new ErrorHandler("You can't chat with yourself!", 400))

    const record = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            creatorId: req.id!,
            members: {
              some: { id: participantIds[0] },
            },
          },
          {
            creatorId: participantIds[0],
            members: {
              some: { id: req.id as string },
            },
          },
        ],
      },
    })

    if (record) return next(new ErrorHandler("Chat already exists!", 400))

    const createdChat = await prisma.chat.create({
      data: {
        creatorId: req.id!,
        members: {
          connect: [{ id: participantIds[0] }],
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

    res.status(200).json({
      success: true,
      chat: createdChat,
    })
  }
)

const getChats = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const chats = await getAllChats(prisma, req)

    res.status(200).json({
      success: true,
      chats,
    })
  }
)

export { createChat, getChats }
