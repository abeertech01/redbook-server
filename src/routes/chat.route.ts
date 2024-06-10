import express from "express"
import { getChats, getMessages } from "../controllers/chat.controller"
import { isAuthenticated } from "../middlewares/auth"

const router = express.Router()

router.use(isAuthenticated)

router.get("/chats", getChats)

router.get("/messages/:chatId", getMessages)

export default router
