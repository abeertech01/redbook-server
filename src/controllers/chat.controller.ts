import { NextFunction, Response } from "express"
import { TryCatch } from "../middlewares/error"
import { IRequest } from "../utils/types"
import prisma from "../lib/prismadb"
import { getAllChats } from "../lib/helpers"

const getChats = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const chats = await getAllChats(prisma, req)

    const mappedChats = chats.map((chat) => ({
      ...chat,
      theOtherUserIndex: chat.members.findIndex(
        (member) => member.id !== req.id
      ),
    }))

    res.status(200).json({
      success: true,
      chats: mappedChats,
    })
  }
)

export { getChats }
