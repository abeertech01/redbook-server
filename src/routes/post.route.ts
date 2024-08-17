import express from "express"
import {
  createPost,
  getPosts,
  getUserPosts,
} from "../controllers/post.controller"
import { isAuthenticated } from "../middlewares/auth"

const router = express.Router()

router.use(isAuthenticated)

router.post("/create-post", createPost)

router.get("/all-posts", getPosts)

router.get("/user-posts", getUserPosts)

export default router
