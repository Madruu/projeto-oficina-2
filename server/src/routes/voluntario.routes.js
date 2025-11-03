import express from 'express';
import Voluntario from '../models/voluntario.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js'

const router = express.Router();

/**
 * @route   POST /voluntarios
 * @desc    Cria um novo voluntário
 * @access  Admin
 */
router.post('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const voluntario = new Voluntario(req.body);
        const saved = await voluntario.save();
        return res.status(201).json(saved);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

/**
 * @route   GET /voluntarios
 * @desc    Lista todos os voluntários
 * @access  Admin
 */
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const list = await Voluntario.find().sort({ createdAt: -1 });
        return res.json(list);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /voluntarios/me
 * @desc    Acessa própria página de usuário
 * @access  Admin e Usuário
 */

router.get('/me', authenticate, authorize('voluntario', 'admin'), (req, res) => {
    res.json({ message: `Bem-vindo, ${req.user.role}!`, userId: req.user.id })
})

/**
 * @route   GET /voluntarios/:id
 * @desc    Lista um voluntário por ID
 * @access  Admin
 */
router.get('/:id', authenticate, authorize('admin'),async (req, res) => {
    try {
        const voluntario = await Voluntario.findById(req.params.id);
        if (!voluntario) return res.status(404).json({ error: 'Voluntário não encontrado' });
        return res.json(voluntario);
    } catch (err) {
        return res.status(400).json({ error: 'ID inválido' });
    }
});

/**
 * @route   PUT /voluntarios/:id
 * @desc    Atualiza um voluntário por ID
 * @access  Public
 */
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const isDataSaidaInserted = req.body.dataSaida !== undefined;
        if (isDataSaidaInserted) {
            req.body.ativo = false;
        }
        const updated = await Voluntario.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: 'Voluntario não encontrado' });
        return res.json(updated);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

/**
 * @route   POST /volunteers/:id/assign
 * @desc    Associa uma oficina a um voluntário
 * @access  Public
 */
router.post('/:id/assign', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { oficinaId } = req.body;

        if (!oficinaId) return res.status(400).json({ error: 'Informe o ID da oficina' });

        const voluntario = await Voluntario.findById(id);
        if (!voluntario) return res.status(404).json({ error: 'Voluntário não encontrado' });
        if (!Array.isArray(voluntario.oficinaId)) {
            voluntario.oficinaId = [];
        }

        if (!voluntario.oficinaId.includes(oficinaId)) {
            voluntario.oficinaId.push(oficinaId);
            await voluntario.save();
        }

        const voluntarioPopulado = await Voluntario.findById(id)
            .populate('oficinaId', 'titulo descricao data local responsavel');

        return res.json({
            message: 'Oficina associada com sucesso',
            voluntario: voluntarioPopulado
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @route   DELETE /voluntarios/:id
 * @desc    Deleta um voluntário por ID
 * @access  Public
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const removed = await Voluntario.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ error: 'Voluntário não encontrado' });
        return res.json({ message: 'Voluntário removido' });
    } catch (err) {
        return res.status(400).json({ error: 'ID inválido' });
    }
});

export default router;