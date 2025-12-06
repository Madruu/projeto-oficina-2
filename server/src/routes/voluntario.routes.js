import express from "express";
import Voluntario from "../models/voluntario.model.js";
import { authenticate, authorize, ROLES } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /voluntarios
 * @desc    Cria um novo voluntário
 * @access  Admin, Coordenador
 */
router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.COORDENADOR),
  async (req, res) => {
    try {
      const voluntario = new Voluntario(req.body);
      const saved = await voluntario.save();
      return res.status(201).json(saved);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * @route   GET /voluntarios
 * @desc    Lista todos os voluntários com filtros opcionais (nome, cpf, oficina)
 * @access  Admin, Coordenador, Visitante (leitura)
 * @query   nome - Filtra por nome (busca parcial, case-insensitive)
 * @query   cpf - Filtra por CPF (busca exata ou parcial)
 * @query   oficina - Filtra por ID da oficina
 */
router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.COORDENADOR, ROLES.VISITANTE),
  async (req, res) => {
    try {
      const { nome, cpf, oficina } = req.query;
      
      const filter = {};
      
      if (nome && nome.trim()) {
        filter.nomeCompleto = { $regex: nome.trim(), $options: 'i' };
      }
      
      if (cpf && cpf.trim()) {
        const cpfClean = cpf.trim().replace(/[.-]/g, '');
        filter.cpf = { $regex: cpfClean, $options: 'i' };
      }
      
      if (oficina && oficina.trim()) {
        filter.oficinaId = { $in: [oficina.trim()] };
      }
      
      const list = await Voluntario.find(filter)
        .populate('oficinaId', 'titulo descricao data local responsavel')
        .sort({ createdAt: -1 });
      
      return res.json(list);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @route   GET /voluntarios/:id
 * @desc    Lista um voluntário por ID
 * @access  Admin, Coordenador, Visitante
 */
router.get(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.COORDENADOR, ROLES.VISITANTE),
  async (req, res) => {
    try {
      const voluntario = await Voluntario.findById(req.params.id);
      if (!voluntario)
        return res.status(404).json({ error: "Voluntário não encontrado" });
      return res.json(voluntario);
    } catch (err) {
      return res.status(400).json({ error: "ID inválido" });
    }
  }
);

/**
 * @route   PUT /voluntarios/:id
 * @desc    Atualiza um voluntário por ID
 * @access  Admin, Coordenador
 */
router.put(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.COORDENADOR),
  async (req, res) => {
    try {
      const isDataSaidaInserted = req.body.dataSaida !== undefined;
      if (isDataSaidaInserted) {
        req.body.ativo = false;
      }
      const updated = await Voluntario.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!updated)
        return res.status(404).json({ error: "Voluntario não encontrado" });
      return res.json(updated);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
);

/**
 * @route   POST /voluntarios/:id/assign
 * @desc    Associa uma oficina a um voluntário
 * @access  Admin, Coordenador
 */
router.post(
  "/:id/assign",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.COORDENADOR),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { oficinaId } = req.body;

      if (!oficinaId)
        return res.status(400).json({ error: "Informe o ID da oficina" });

      const voluntario = await Voluntario.findById(id);
      if (!voluntario)
        return res.status(404).json({ error: "Voluntário não encontrado" });
      if (!Array.isArray(voluntario.oficinaId)) {
        voluntario.oficinaId = [];
      }

      if (!voluntario.oficinaId.includes(oficinaId)) {
        voluntario.oficinaId.push(oficinaId);
        await voluntario.save();
      }

      const voluntarioPopulado = await Voluntario.findById(id).populate(
        "oficinaId",
        "titulo descricao data local responsavel"
      );

      return res.json({
        message: "Oficina associada com sucesso",
        voluntario: voluntarioPopulado,
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

/**
 * @route   DELETE /voluntarios/:id
 * @desc    Deleta um voluntário por ID
 * @access  Admin only
 */
router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  async (req, res) => {
    try {
      const removed = await Voluntario.findByIdAndDelete(req.params.id);
      if (!removed)
        return res.status(404).json({ error: "Voluntário não encontrado" });
      return res.json({ message: "Voluntário removido" });
    } catch (err) {
      return res.status(400).json({ error: "ID inválido" });
    }
  }
);

export default router;
