import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import oficinaRoutes from "./routes/oficina.routes.js";
import voluntarioRoutes from "./routes/voluntario.routes.js";
import authRoutes from "./routes/auth.routes.js";

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/oficinas", oficinaRoutes);
app.use("/voluntarios", voluntarioRoutes);

export default app;
