import { NextFunction, Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { ErrorHandler } from "../utils/utility"

const validateHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ")

  if (errors.isEmpty()) return next()
  else next(new ErrorHandler(errorMessages, 400))
}

const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("username", "Please Enter Username").notEmpty(),
  body("email", "Please Enter Email").isEmail(),
  body("password", "Please Enter Password").notEmpty(),
]

const loginValidator = () => [
  body("userAddress", "Please Enter Username or Email").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
]

export { validateHandler, registerValidator, loginValidator }
