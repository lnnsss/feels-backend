import { Router } from "express";
import UserController from "../controllers/user-controller.mjs";

const router = Router();

// Получение всех пользователей
router.get("/", UserController.getUsers);

// Получение пользователя по id
router.get("/:id", UserController.getUser);

// Удаление пользователя по id
router.delete("/:id", UserController.deleteUser);

export default router;