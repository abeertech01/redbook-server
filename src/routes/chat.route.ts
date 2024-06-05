import express from "express"
import { getChats } from "../controllers/chat.controller"
import { isAuthenticated } from "../middlewares/auth"

const router = express.Router()

router.use(isAuthenticated)

router.get("/chats", getChats)

export default router
