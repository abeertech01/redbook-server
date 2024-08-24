import { NextFunction, Request, Response } from "express"

export interface CONTROLLER_FUNC {
  (req: IRequest, res: Response, next: NextFunction): void | Promise<void>
}

export interface User {
  id: string
  name: string
  username: string
  email: string
  password?: string
  createdAt: Date
  updatedAt: Date
}

export interface SearchedUser {
  id: string
  name: string
  username: string
}

export interface IRequest extends Request {
  id?: string
}

export interface Post {
  id: string
  createdAt: Date
  updatedAt: Date
  title: string
  content: string
  upvoteIds: string[]
  downvoteIds: string[]
  authorId: string
  comments?: Comment[]
  author?: User
}

export interface Comment {
  id: string
  createdAt: Date
  updatedAt: Date
  content: string
  upvoteIds: string[]
  downvoteIds: string[]
  authorId: string
  author?: User
  postId: string
}
