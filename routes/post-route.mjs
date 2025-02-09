import { Router } from "express";
import PostController from "../controllers/post-controller.mjs";

const router = Router();

// Создание поста
router.post("/", PostController.createPost);

// Получение количества постов
router.get("/count", PostController.getPostsCount);

// Получение постов
router.get("/", PostController.getPosts);

// Получение всех постов с информацией о пользователе
router.get("/all", PostController.getAllPosts);

// Удаление поста
router.delete("/:id", PostController.deletePost);

export default router;
