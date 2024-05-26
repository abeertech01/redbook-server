import express from "express"
import { loginUser, registerUser } from "../controllers/user.controller"
import {
  loginValidator,
  registerValidator,
  validateHandler,
} from "../lib/validators"

const router = express.Router()

router.post("/register", registerValidator(), validateHandler, registerUser)

router.post("/login", loginValidator(), validateHandler, loginUser)

export default router
