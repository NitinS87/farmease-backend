/* eslint-disable @typescript-eslint/no-misused-promises */
import { login, register, me } from "$/controller/user.controller";
import { authMiddleware } from "$/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authMiddleware, me);

export default router;
