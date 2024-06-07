import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
import { IRequest, User } from "../utils/types"
import { userSocketIDs } from ".."

const getAllChats = async (
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  req: IRequest
) => {
  const myChats = await prisma.chat.findMany({
    where: {
      OR: [
        {
          creatorId: req.id!,
        },
        {
          members: {
            some: { id: req.id! },
          },
        },
      ],
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

  return myChats
}

const getSockets = (userIds: string[] = []) => {
  const sockets = userIds.map((id: string) => userSocketIDs.get(id.toString()))

  return sockets
}

export { getAllChats, getSockets }
