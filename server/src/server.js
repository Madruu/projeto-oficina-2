import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import connectDB from "./config/db.js";
import oficinaRoutes from "./routes/oficina.routes.js";
import voluntarioRoutes from "./routes/voluntario.routes.js";

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/health", healthRoutes);
app.use('/oficinas', oficinaRoutes);
app.use('/voluntarios', voluntarioRoutes);

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // Conecta ao MongoDB antes de iniciar o servidor
    await connectDB();

    // Inicia o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error.message);
    process.exit(1);
  }
};

// Inicia o servidor
startServer();

export default app;
