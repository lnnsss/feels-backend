import { Router } from "express";
import PostController from "../controllers/post-controller.mjs";

const router = Router();

// Создание поста
router.post("/", PostController.createPost);

// Получение постов
router.get("/", PostController.getPosts);

// Удаление поста
router.delete("/:id", PostController.deletePost);

export default router;
