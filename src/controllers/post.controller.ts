import { NextFunction, Response } from "express"
import { TryCatch } from "../middlewares/error"
import { IRequest } from "../utils/types"
import prisma from "../lib/prismadb"

const createPost = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { title, content } = req.body

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.id as string,
      },
    })

    res.status(200).json({
      success: true,
      post: newPost,
    })
  }
)

const getPosts = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
      },
    })

    res.status(200).json({
      success: true,
      posts,
    })
  }
)

const getUserPosts = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const posts = await prisma.post.findMany({
      where: { authorId: req.id as string },
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
      },
    })

    res.status(200).json({
      success: true,
      posts,
    })
  }
)

const deletePost = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id } = req.params

    const post = await prisma.post.delete({
      where: { id },
    })

    res.status(200).json({
      success: true,
      post,
    })
  }
)

export { createPost, getPosts, getUserPosts, deletePost }
