import { NextFunction, Request, Response } from "express"

export interface CONTROLLER_FUNC {
  (req: Request, res: Response, next: NextFunction): void | Promise<void>
}
