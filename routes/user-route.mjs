import { Router } from "express";
import UserController from "../controllers/user-controller.mjs";
import { editValidation } from "../middlewares/edit-middleware.mjs";

const router = Router();

// Получение всех пользователей
router.get("/", UserController.getUsers);

// Получение пользователя по id
router.get("/:id", UserController.getUserByID);

// Получение подписок пользователя по id
router.get("/:id/subscriptions", UserController.getUserSubscriptions);

// Редактирование пользователя по id
router.patch("/:id", editValidation, UserController.editUser);

// Подписка
router.patch("/:id/subscribe", editValidation, UserController.subscribe);

// Отписка
router.patch("/:id/unsubscribe", editValidation, UserController.unsubscribe);

// Удаление пользователя по id
router.delete("/:id", UserController.deleteUser);

export default router;
