import { Router } from "express";
import AuthRoutes from "./auth-route.mjs";
import PostRoutes from "./post-route.mjs";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/posts", PostRoutes);

export default router;