import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
import { IRequest } from "../utils/types"

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

export { getAllChats }
