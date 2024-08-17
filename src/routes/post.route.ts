import express from "express"
import {
  createPost,
  deletePost,
  getPosts,
  getUserPosts,
} from "../controllers/post.controller"
import { isAuthenticated } from "../middlewares/auth"

const router = express.Router()

router.use(isAuthenticated)

router.post("/create-post", createPost)

router.get("/all-posts", getPosts)

router.get("/user-posts", getUserPosts)

router.delete("/delete-post/:id", deletePost)

export default router
