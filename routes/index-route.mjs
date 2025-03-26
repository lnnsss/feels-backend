import { Router } from "express";
import AuthRoutes from "./auth-route.mjs";
import UserRoutes from "./user-route.mjs";
import PostRoutes from "./post-route.mjs";
import ChatRoutes from "./chat-route.mjs"

const router = Router();

// Регистрация / Вход
router.use("/auth", AuthRoutes);

// Пользователи
router.use("/users", UserRoutes);

// Посты
router.use("/posts", PostRoutes);

// Чаты
router.use("/chats", ChatRoutes);

export default router;
