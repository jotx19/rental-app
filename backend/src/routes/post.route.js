import express from "express";
import { createPost, getPostById, deletePost, editPost, getNearbyPosts, getRecentPostsWithImages } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getNearbyPosts);
router.post("/create-post", upload.single("image") , protectRoute, createPost);
router.get("/:id/posts", getPostById);
router.put("/edit-post/:id", protectRoute, editPost);
router.delete("/:id/delete-post", protectRoute, deletePost);
router.get("/latest-post", getRecentPostsWithImages)

export default router;
