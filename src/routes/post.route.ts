import express from "express"
import {
  createPost,
  deletePost,
  downvotePost,
  getPosts,
  upvotePost,
} from "../controllers/post.controller"
import { isAuthenticated } from "../middlewares/auth"

const router = express.Router()

router.use(isAuthenticated)

router.post("/create-post", createPost)

router.get("/all-posts", getPosts)

router.delete("/delete-post/:id", deletePost)

router.put("/upvote/:id", upvotePost)

router.put("/downvote/:id", downvotePost)

export default router
