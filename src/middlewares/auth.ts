import express from "express"
import { NextFunction, Response } from "express"
import { ErrorHandler } from "../utils/utility"
import { IError, TryCatch } from "./error"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IRequest, User } from "../utils/types"
import { Socket } from "socket.io"
import "dotenv"
import { IncomingMessage } from "http"

interface CustomJwtPayload extends JwtPayload {
  id: string
}

const isAuthenticated = TryCatch(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const token = req.cookies["redbook-token"]

    if (!token)
      return next(new ErrorHandler("Please login to access this route", 401))

    const decodedData = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as CustomJwtPayload

    req.id = decodedData.id

    next()
  }
)

interface IIncomingMessage extends IncomingMessage {
  cookies?: {
    "redbook-token"?: string
  }
}

export interface ExtendedSocket extends Socket {
  request: IIncomingMessage
  user?: User
}

const socketAuthenticator = async (
  err: Error,
  socket: ExtendedSocket,
  next: (err?: Error) => void
) => {
  try {
    if (err) return next(err)

    const authToken = (socket.request as express.Request).cookies[
      "redbook-token"
    ]

    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401))

    const decodedData = jwt.verify(
      authToken,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload

    const user = await prisma?.user.findUnique({
      where: { id: decodedData.id },
    })

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401))

    socket.user = user

    return next()
  } catch (error) {
    console.error(error)
    return next(new ErrorHandler("Please login to access this route", 401))
  }
}

export { isAuthenticated, socketAuthenticator }
