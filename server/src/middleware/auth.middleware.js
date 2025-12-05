import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "secure_secret_token";

/**
 * Middleware de autenticação
 * Valida o token JWT e anexa o usuário ao req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    if (!user.ativo) {
      return res.status(401).json({ error: "Usuário desativado" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    return res.status(500).json({ error: "Erro na autenticação" });
  }
};

/**
 * Middleware de autorização por role
 * Verifica se o usuário tem uma das roles permitidas
 * @param  {...string} allowedRoles - Roles permitidas
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: "Acesso negado. Permissão insuficiente.",
        required: allowedRoles,
        current: req.user.role
      });
    }

    next();
  };
};

/**
 * Roles do sistema:
 * - admin: acesso total
 * - coordenador: gerir oficinas e voluntários
 * - visitante: apenas leitura
 */
export const ROLES = {
  ADMIN: "admin",
  COORDENADOR: "coordenador",
  VISITANTE: "visitante",
};

export default { authenticate, authorize, ROLES };

