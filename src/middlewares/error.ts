import { NextFunction, Response } from "express"
import { CONTROLLER_FUNC, IRequest } from "../utils/types"

interface IError extends Error {
  statusCode?: number
}

const errorMiddleware = (
  err: IError,
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal Server Error"
  err.statusCode ||= 500

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    error: err,
  })
}

const TryCatch =
  (controllerFunc: CONTROLLER_FUNC) =>
  async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      await controllerFunc(req, res, next)
    } catch (error: unknown) {
      next(error)
    }
  }

export { TryCatch, errorMiddleware }
