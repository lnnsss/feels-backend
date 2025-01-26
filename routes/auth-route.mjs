import { Router } from "express";
import AuthController from "../controllers/auth-controller.mjs";
import { registerValidation } from "../middlewares/auth-middleware.mjs";

const router = Router();

// Регистрация
router.post("/registration", registerValidation, AuthController.registration);

// Вход
router.post("/login", AuthController.login);

export default router;