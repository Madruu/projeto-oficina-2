import express from "express";
import Voluntario from "../models/voluntario.model.js";
import { authenticate, authorize, ROLES } from "../middleware/auth.middleware.js";
import { generateVolunteerPDF } from "../services/pdf.service.js";

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
 * @route   GET /voluntarios/:id/pdf
 * @desc    Gera PDF com informações do voluntário
 * @access  Admin, Coordenador, Visitante
 */
router.get(
  "/:id/pdf",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.COORDENADOR, ROLES.VISITANTE),
  async (req, res) => {
    try {
      const voluntario = await Voluntario.findById(req.params.id)
        .populate('oficinaId', 'titulo descricao data local responsavel');
      
      if (!voluntario)
        return res.status(404).json({ error: "Voluntário não encontrado" });

      // Gera o PDF
      const doc = generateVolunteerPDF(voluntario);

      // Configura headers para download
      const fileName = `termo-voluntariado-${voluntario.nomeCompleto.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      // Tratamento de erros no stream do PDF
      doc.on('error', (err) => {
        console.error('Erro ao gerar PDF:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Erro ao gerar PDF' });
        }
      });

      // Pipe do PDF para a resposta
      doc.pipe(res);
      doc.end();
    } catch (err) {
      console.error('Erro na rota de PDF:', err);
      if (!res.headersSent) {
        return res.status(500).json({ error: err.message || 'Erro ao gerar PDF' });
      }
    }
  }
);

/**
 * @route   GET /voluntarios/:id/history
 * @desc    Retorna o histórico completo de participação do voluntário em oficinas
 * @access  Admin, Coordenador, Visitante
 */
router.get(
  "/:id/history",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.COORDENADOR, ROLES.VISITANTE),
  async (req, res) => {
    try {
      const voluntario = await Voluntario.findById(req.params.id)
        .populate('oficinaId', 'titulo descricao data local responsavel');
      
      if (!voluntario)
        return res.status(404).json({ error: "Voluntário não encontrado" });

      // Monta o histórico com informações das oficinas
      const history = {
        voluntario: {
          id: voluntario._id,
          nomeCompleto: voluntario.nomeCompleto,
          dataEntrada: voluntario.dataEntrada,
          dataSaida: voluntario.dataSaida,
          ativo: voluntario.ativo,
        },
        oficinas: (voluntario.oficinaId || []).map((oficina) => ({
          id: oficina._id,
          titulo: oficina.titulo,
          descricao: oficina.descricao,
          data: oficina.data,
          local: oficina.local,
          responsavel: oficina.responsavel,
        })),
        totalOficinas: voluntario.oficinaId?.length || 0,
      };

      return res.json(history);
    } catch (err) {
      return res.status(400).json({ error: err.message || "ID inválido" });
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
      const voluntario = await Voluntario.findById(req.params.id)
        .populate("oficinaId", "titulo descricao data local responsavel")
        .populate("associacoes.oficinaId", "titulo descricao data local responsavel");
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

      // Busca o voluntário existente
      const voluntario = await Voluntario.findById(req.params.id);
      if (!voluntario)
        return res.status(404).json({ error: "Voluntario não encontrado" });

      if (req.body.cpf && req.body.cpf !== voluntario.cpf) {
        const existing = await Voluntario.findOne({ 
          cpf: req.body.cpf,
          _id: { $ne: req.params.id } 
        });
        if (existing) {
          return res.status(400).json({ error: "CPF já cadastrado" });
        }
      }
      Object.assign(voluntario, req.body);
      
      const updated = await voluntario.save();
      
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

      // Verifica se já está associado
      if (voluntario.oficinaId.includes(oficinaId)) {
        return res.status(409).json({ 
          error: "Este voluntário já está associado a esta oficina" 
        });
      }

      voluntario.oficinaId.push(oficinaId);
      
      // Adiciona ao histórico de associações
      if (!Array.isArray(voluntario.associacoes)) {
        voluntario.associacoes = [];
      }
      voluntario.associacoes.push({
        oficinaId: oficinaId,
        dataAssociacao: new Date()
      });
      
      await voluntario.save();

      const voluntarioPopulado = await Voluntario.findById(id)
        .populate("oficinaId", "titulo descricao data local responsavel")
        .populate("associacoes.oficinaId", "titulo descricao data local responsavel");

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
