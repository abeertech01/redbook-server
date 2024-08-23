import express from "express"
import {
  addComment,
  createPost,
  deletePost,
  downvotePost,
  getPost,
  getPosts,
  getUserPosts,
  upvotePost,
} from "../controllers/post.controller"
import { isAuthenticated } from "../middlewares/auth"

const router = express.Router()

router.use(isAuthenticated)

router.post("/create-post", createPost)

router.get("/all-posts", getPosts)

router.get("/user-posts/:id", getUserPosts)

router.get("/get-post/:id", getPost)

router.delete("/delete-post/:id", deletePost)

router.put("/upvote/:id", upvotePost)

router.put("/downvote/:id", downvotePost)

router.post("/add-comment", addComment)

export default router
