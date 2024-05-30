import { NextFunction, Response } from "express"
import { ErrorHandler } from "../utils/utility"
import { TryCatch } from "./error"
import jwt, { JwtPayload } from "jsonwebtoken"
import { IRequest } from "../utils/types"

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

export { isAuthenticated }
