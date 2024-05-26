import express from "express"
import { createChat, getChats } from "../controllers/chat.controller"
import { isAuthenticated } from "../middlewares/auth"

const router = express.Router()

router.use(isAuthenticated)

router.post("/new-chat", createChat)

router.get("/chats", getChats)

export default router
