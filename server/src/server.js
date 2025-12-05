import app from "./app.js";
import connectDB from "./config/db.js";
import seedDefaultAdmin from "./config/seed.js";

const PORT = process.env.PORT || 8000;

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // Conecta ao MongoDB antes de iniciar o servidor
    await connectDB();

    // Cria usuário admin padrão se não existir
    await seedDefaultAdmin();

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
