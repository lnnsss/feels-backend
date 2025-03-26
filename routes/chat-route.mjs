import { Router } from "express";
import ChatController from "../controllers/chat-controller.mjs";
import tokenMiddleware from "../middlewares/token-middleware.mjs";

const router = Router();

// Создание чата
router.post("/", tokenMiddleware, ChatController.createChat);

// Создание сообщения
router.post("/:chatID/message", tokenMiddleware, ChatController.createMessage);

// Получение всех чатов пользователя
router.get("/", tokenMiddleware, ChatController.getChats);

// Получение конкретного чата пользователя
router.get("/:chatID", tokenMiddleware, ChatController.getChat);

export default router;
