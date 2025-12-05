import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "secure_secret_token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * @route   POST /auth/login
 * @desc    Autentica usuário e retorna token
 * @access  Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    if (!user.ativo) {
      return res.status(401).json({ error: "Usuário desativado" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @route   POST /auth/register
 * @desc    Registra um novo usuário
 * @access  Public (pode ser restrito a admin depois)
 */
export const register = async (req, res) => {
  const { nome, email, password, role } = req.body;

  if (!nome || !email || !password) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    const existing = await User.findOne({ email: email.toLowerCase() });

    if (existing) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Apenas admin pode criar outros admins
    const allowedRole = role === "admin" ? "visitante" : role || "visitante";

    const user = new User({
      nome,
      email: email.toLowerCase(),
      password,
      role: allowedRole,
    });

    await user.save();

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @route   GET /auth/me
 * @desc    Retorna dados do usuário autenticado
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      ativo: user.ativo,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

/**
 * @route   PUT /auth/me
 * @desc    Atualiza dados do usuário autenticado
 * @access  Private
 */
export const updateMe = async (req, res) => {
  const { nome, email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Atualiza nome
    if (nome) user.nome = nome;

    // Atualiza email (verifica duplicidade)
    if (email && email !== user.email) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ error: "Email já está em uso" });
      }
      user.email = email.toLowerCase();
    }

    // Atualiza senha
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Senha atual é obrigatória" });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: "Senha atual incorreta" });
      }

      user.password = newPassword;
    }

    await user.save();

    res.json({
      message: "Perfil atualizado com sucesso",
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
