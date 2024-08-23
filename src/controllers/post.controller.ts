import { NextFunction, Response } from "express"
import { TryCatch } from "../middlewares/error"
import { IRequest } from "../utils/types"
import prisma from "../lib/prismadb"
import { ErrorHandler } from "../utils/utility"

const createPost = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { title, content, authorId } = req.body

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
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

    if (req.query.authorId) {
      const filteredPosts = posts.filter(
        (post) => post.authorId === req.query.authorId
      )

      res.status(200).json({
        success: true,
        posts: filteredPosts,
      })
    }

    res.status(200).json({
      success: true,
      posts,
    })
  }
)

const getUserPosts = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const posts = await prisma.post.findMany({
      where: { authorId: req.params.id as string },
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

const getPost = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id } = req.params

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    })

    res.status(200).json({
      success: true,
      post,
    })
  }
)

const deletePost = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id } = req.params

    /**
     * FIXME: Later
     * if I get post id and authorId by req.body, I will be able to create an error where it will give a message which is 'You are not allowed to remove this post'
     */

    const post = await prisma.post.delete({
      where: { authorId: req.id as string, id },
    })

    res.status(200).json({
      success: true,
      post,
    })
  }
)

const upvotePost = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id: postId } = req.params

    // get the post by matching the postId
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    const upvoteIds = [...(post?.upvoteIds as string[])]
    const downvoteIds = [...(post?.downvoteIds as string[])]
    let updatedPost: typeof post | undefined

    if (downvoteIds.includes(req.id as string)) {
      downvoteIds.splice(downvoteIds.indexOf(req.id as string), 1)
      upvoteIds.push(req.id as string)
      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { upvoteIds, downvoteIds },
      })
    } else if (upvoteIds.includes(req.id as string)) {
      upvoteIds.splice(upvoteIds.indexOf(req.id as string), 1)
      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { upvoteIds },
      })
    } else {
      upvoteIds.push(req.id as string)
      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { upvoteIds },
      })
    }

    res.status(200).json({
      success: true,
      post: updatedPost,
    })
  }
)

const downvotePost = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id: postId } = req.params

    // get the post by matching the postId
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    const upvoteIds = [...(post?.upvoteIds as string[])]
    const downvoteIds = [...(post?.downvoteIds as string[])]
    let updatedPost: typeof post | undefined

    if (upvoteIds.includes(req.id as string)) {
      upvoteIds.splice(downvoteIds.indexOf(req.id as string), 1)
      downvoteIds.push(req.id as string)
      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { upvoteIds, downvoteIds },
      })
    } else if (downvoteIds.includes(req.id as string)) {
      downvoteIds.splice(downvoteIds.indexOf(req.id as string), 1)
      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { downvoteIds },
      })
    } else {
      downvoteIds.push(req.id as string)
      updatedPost = await prisma.post.update({
        where: { id: postId },
        data: { downvoteIds },
      })
    }

    res.status(200).json({
      success: true,
      post: updatedPost,
    })
  }
)

const addComment = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { postId, content } = req.body

    const record = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!record) {
      return next(new ErrorHandler("Post not found", 404))
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        content,
        authorId: req.id as string,
      },
    })

    res.status(200).json({
      success: true,
      comment,
    })
  }
)

export {
  createPost,
  getPosts,
  getUserPosts,
  getPost,
  deletePost,
  upvotePost,
  downvotePost,
  addComment,
}
