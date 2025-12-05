import express from "express";
import { login, register, getMe, updateMe } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rotas públicas
router.post("/login", login);
router.post("/register", register);

// Rotas protegidas
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, updateMe);

export default router;
