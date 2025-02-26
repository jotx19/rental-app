import express from "express";
import { createPost, getPostById, deletePost, editPost, getNearbyPosts } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getNearbyPosts);
router.post("/create-post", protectRoute, createPost);
router.get("/:id/posts", getPostById);
router.put("/edit-post/:id", protectRoute, editPost);
router.delete("/:id/delete-post", protectRoute, deletePost);

export default router;
