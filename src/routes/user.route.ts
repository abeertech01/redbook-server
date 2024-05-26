import express from "express"
import {
  loginUser,
  logoutUser,
  registerUser,
  userProfile,
} from "../controllers/user.controller"
import {
  loginValidator,
  registerValidator,
  validateHandler,
} from "../lib/validators"
import { isAuthenticated } from "../middlewares/auth"

const router = express.Router()

router.post("/register", registerValidator(), validateHandler, registerUser)

router.post("/login", loginValidator(), validateHandler, loginUser)

// Before accessing these routes, one must be authenticated
router.use(isAuthenticated)

router.delete("/logout", logoutUser)

router.get("/profile", userProfile)

export default router
