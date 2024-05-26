import { NextFunction, Request, Response } from "express"

export interface CONTROLLER_FUNC {
  (req: Request, res: Response, next: NextFunction): void | Promise<void>
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

export interface IRequest extends Request {
  id?: string
}
