import { Router } from "express";
import ChatController from "../controllers/chat-controller.mjs";
import tokenValidation from "../middlewares/token-validation.mjs";

const router = Router();

// Создание чата
router.post("/", tokenValidation, ChatController.createChat);

// Создание сообщения
router.post("/:chatID/message", tokenValidation, ChatController.createMessage);

// Получение всех чатов пользователя
router.get("/", tokenValidation, ChatController.getChats);

// Получение конкретного чата пользователя
router.get("/:chatID", tokenValidation, ChatController.getChat);

export default router;
