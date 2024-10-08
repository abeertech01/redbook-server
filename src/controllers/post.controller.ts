import { NextFunction, Response } from "express"
import { TryCatch } from "../middlewares/error"
import { Comment, IRequest } from "../utils/types"
import prisma from "../lib/prismadb"
import { ErrorHandler } from "../utils/utility"
import {
  downvoteCommentHelper,
  downvotePostHelper,
  upvoteCommentHelper,
  upvotePostHelper,
} from "../lib/helpers"

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
        comments: true,
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
        comments: true,
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
    const { id: postId } = req.params

    const record = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!record) return next(new ErrorHandler("Post not found", 404))

    const post = await prisma.post.delete({
      where: { authorId: req.id, id: postId },
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

    const updatedPost = upvotePostHelper(post!, prisma, req.id!, postId)

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

    const updatedPost = await downvotePostHelper(post!, prisma, req.id!, postId)

    res.status(200).json({
      success: true,
      post: updatedPost,
    })
  }
)

const getPostComments = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id: postId } = req.params

    const postRecord = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!postRecord) return next(new ErrorHandler("Post not found", 404))

    const comments = await prisma.comment.findMany({
      where: { postId: postId as string },
      orderBy: { createdAt: "desc" },
      include: {
        author: true,
      },
    })

    res.status(200).json({
      success: true,
      comments,
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

const upvoteComment = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id: commentId } = req.params

    // get the comment by matching the commentId
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return next(new ErrorHandler("Comment not found", 404))
    }

    const updatedComment = await upvoteCommentHelper(
      comment!,
      req.id!,
      prisma,
      commentId
    )

    res.status(200).json({
      success: true,
      comment: updatedComment,
    })
  }
)

const downvoteComment = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id: commentId } = req.params

    // get the comment by matching the commentId
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return next(new ErrorHandler("Comment not found", 404))
    }

    const updatedComment = downvoteCommentHelper(
      comment!,
      req.id!,
      prisma,
      commentId
    )

    res.status(200).json({
      success: true,
      comment: updatedComment,
    })
  }
)

const deleteComment = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const { id: commentId } = req.params

    const record = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!record) return next(new ErrorHandler("Comment not found", 404))

    const comment = await prisma.comment.delete({
      where: { authorId: req.id, id: commentId },
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
  getPostComments,
  addComment,
  upvoteComment,
  downvoteComment,
  deleteComment,
}
