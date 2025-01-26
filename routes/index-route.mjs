import { Router } from "express";
import AuthRoutes from "./auth-route.mjs";
import PostRoutes from "./post-route.mjs";

const router = Router();

// Регистрация / Вход
router.use("/auth", AuthRoutes);

// Посты
router.use("/posts", PostRoutes);

export default router;