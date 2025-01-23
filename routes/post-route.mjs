import { Router } from "express";
import PostController from "../controllers/post-controller.mjs";

const router = Router();

router.post("/", PostController.createPost);
router.get("/", PostController.getPosts);
router.delete("/:id", PostController.deletePost);

export default router;
