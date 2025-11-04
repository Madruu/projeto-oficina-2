import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import connectDB from "./config/db.js";
import oficinaRoutes from "./routes/oficina.routes.js";
import voluntarioRoutes from "./routes/voluntario.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/oficinas", oficinaRoutes);
app.use("/voluntarios", voluntarioRoutes);


if (process.env.NODE_ENV !== "test") {
  const startServer = async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
      });
    } catch (error) {
      console.error("❌ Erro ao iniciar servidor:", error.message);
      process.exit(1);
    }
  };
  startServer();
}

export default app;
