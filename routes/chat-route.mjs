import { Router } from "express";
import ChatController from "../controllers/chat-controller.mjs";
import tokenMiddleware from "../middlewares/token-middleware.mjs";

const router = Router();

// Проверяем токен
router.use(tokenMiddleware)

// Создание чата
router.post("/", ChatController.createChat);

// Создание сообщения
router.post("/:chatID/message", ChatController.createMessage);

// Получение всех чатов пользователя
router.get("/", ChatController.getChats);

// Получение конкретного чата пользователя
router.get("/:chatID", ChatController.getChat);

export default router;
