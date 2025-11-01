import mongoose from "mongoose";
import dotenv from "dotenv";

// Carrega variáveis de ambiente
dotenv.config();

/**
 * Conecta ao MongoDB usando Mongoose
 * Utiliza a variável de ambiente MONGO_URI
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI não está definida nas variáveis de ambiente");
    }

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(mongoURI, options);

    console.log(`✅ MongoDB conectado com sucesso!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);

    // Event listeners para logs de conexão
    mongoose.connection.on("error", (err) => {
      console.error(`❌ Erro na conexão com MongoDB: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB desconectado");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconectado");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB desconectado devido ao encerramento da aplicação");
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error(`❌ Erro ao conectar ao MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;
