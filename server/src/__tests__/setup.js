import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

/**
 * Conecta ao MongoDB em memória para testes
 */
export const connectDBTest = async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'jest-test',
    },
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
};

/**
 * Desconecta e limpa o banco de dados de teste
 */
export const disconnectDBTest = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

/**
 * Limpa todas as coleções do banco de dados de teste
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

