import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
import { Comment, IRequest, Post, User } from "../utils/types"
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

const upvotePostHelper = async (
  post: Post,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  authorId: string,
  postId: string
) => {
  const upvoteIds = [...(post?.upvoteIds as string[])]
  const downvoteIds = [...(post?.downvoteIds as string[])]
  let updatedPost: typeof post | undefined

  if (downvoteIds.includes(authorId as string)) {
    downvoteIds.splice(downvoteIds.indexOf(authorId as string), 1)
    upvoteIds.push(authorId as string)
    updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { upvoteIds, downvoteIds },
    })
  } else if (upvoteIds.includes(authorId as string)) {
    upvoteIds.splice(upvoteIds.indexOf(authorId as string), 1)
    updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { upvoteIds },
    })

    return updatedPost
  } else {
    upvoteIds.push(authorId as string)
    updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { upvoteIds },
    })

    return updatedPost
  }
}

const downvotePostHelper = async (
  post: Post,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  authorId: string,
  postId: string
) => {
  const upvoteIds = [...(post?.upvoteIds as string[])]
  const downvoteIds = [...(post?.downvoteIds as string[])]
  let updatedPost: typeof post | undefined

  if (upvoteIds.includes(authorId as string)) {
    upvoteIds.splice(downvoteIds.indexOf(authorId as string), 1)
    downvoteIds.push(authorId as string)
    updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { upvoteIds, downvoteIds },
    })
  } else if (downvoteIds.includes(authorId as string)) {
    downvoteIds.splice(downvoteIds.indexOf(authorId as string), 1)
    updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { downvoteIds },
    })

    return updatedPost
  } else {
    downvoteIds.push(authorId as string)
    updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { downvoteIds },
    })

    return updatedPost
  }
}

const upvoteCommentHelper = async (
  comment: Comment,
  authorId: string,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  commentId: string
) => {
  const upvoteIds = comment.upvoteIds
  const downvoteIds = comment.downvoteIds
  let updatedComment: typeof comment | undefined

  if (upvoteIds.includes(authorId as string)) {
    //  remove the upvote
    updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        upvoteIds: upvoteIds.filter((id) => id !== authorId),
      },
    })
  } else {
    if (downvoteIds.includes(authorId as string)) {
      //  remove the downvote
      updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          downvoteIds: downvoteIds.filter((id) => id !== authorId),
          upvoteIds: [...(comment.upvoteIds as string[]), authorId as string],
        },
      })

      return updatedComment
    } else {
      updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          upvoteIds: [...(comment.upvoteIds as string[]), authorId as string],
        },
      })

      return updatedComment
    }
  }
}

const downvoteCommentHelper = async (
  comment: Comment,
  authorId: string,
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  commentId: string
) => {
  const upvoteIds = comment.upvoteIds
  const downvoteIds = comment.downvoteIds
  let updatedComment: typeof comment | undefined

  if (downvoteIds.includes(authorId as string)) {
    // remove the downvote
    updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        downvoteIds: downvoteIds.filter((id) => id !== authorId),
      },
    })
  } else {
    if (upvoteIds.includes(authorId as string)) {
      // remove the upvote
      updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          upvoteIds: upvoteIds.filter((id) => id !== authorId),
          downvoteIds: [
            ...(comment.downvoteIds as string[]),
            authorId as string,
          ],
        },
      })

      return updatedComment
    } else {
      updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: {
          downvoteIds: [
            ...(comment.downvoteIds as string[]),
            authorId as string,
          ],
        },
      })

      return updatedComment
    }
  }
}

export {
  getAllChats,
  getSockets,
  upvotePostHelper,
  downvotePostHelper,
  upvoteCommentHelper,
  downvoteCommentHelper,
}
