import express from "express"
import {
  createPost,
  deletePost,
  downvotePost,
  getPosts,
  getUserPosts,
  upvotePost,
} from "../controllers/post.controller"
import { isAuthenticated } from "../middlewares/auth"

const router = express.Router()

router.use(isAuthenticated)

router.post("/create-post", createPost)

router.get("/all-posts", getPosts)

router.get("/user-posts", getUserPosts)

router.delete("/delete-post/:id", deletePost)

router.put("/upvote/:id", upvotePost)

router.put("/downvote/:id", downvotePost)

export default router
