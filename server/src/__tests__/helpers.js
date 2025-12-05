import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "secure_secret_token";

/**
 * Cria um token JWT para testes
 * @param {Object} payload - Dados do usuário (id, role)
 * @returns {string} Token JWT
 */
export const generateToken = (payload = { id: "test-id", role: "admin" }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

/**
 * Cria um usuário de teste no banco
 * @param {Object} userData - Dados do usuário
 * @returns {Promise<Object>} Usuário criado
 */
export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    nome: userData.nome || "Usuário Teste",
    email: userData.email || "test@example.com",
    password: userData.password || "password123",
    role: userData.role || "admin",
    ativo: userData.ativo !== undefined ? userData.ativo : true,
  };

  // Se a senha não foi hasheada, faz o hash
  if (defaultUser.password && !defaultUser.password.startsWith("$2")) {
    const salt = await bcrypt.genSalt(10);
    defaultUser.password = await bcrypt.hash(defaultUser.password, salt);
  }

  const user = new User(defaultUser);
  return await user.save();
};

/**
 * Cria um token autenticado para um usuário existente
 * @param {Object} user - Usuário do banco
 * @returns {string} Token JWT
 */
export const getAuthToken = (user) => {
  return generateToken({
    id: user._id.toString(),
    role: user.role,
  });
};
