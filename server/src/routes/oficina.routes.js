import express from 'express';
import Oficina from '../models/oficina.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /oficinas
 * @desc    Cria uma nova oficina
 * @access  Admin
 */
router.post('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const oficina = new Oficina(req.body);
        const saved = await oficina.save();
        return res.status(201).json(saved);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

/**
 * @route   GET /oficinas
 * @desc    Lista todas as oficinas
 * @access  Admin 
 */
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const list = await Oficina.find().sort({ createdAt: -1 });
        return res.json(list);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

/**
 * @route   GET /oficinas/:id
 * @desc    Lista uma oficina por ID
 * @access  Admin
 */
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const oficina = await Oficina.findById(req.params.id);
        if (!oficina) return res.status(404).json({ error: 'Oficina não encontrada' });
        return res.json(oficina);
    } catch (err) {
        return res.status(400).json({ error: 'ID inválido' });
    }
});

/**
 * @route   PUT /oficinas/:id
 * @desc    Atualiza uma oficina por ID
 * @access  Admin
 */
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const updated = await Oficina.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ error: 'Oficina não encontrada' });
        return res.json(updated);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

/**
 * @route   DELETE /oficinas/:id
 * @desc    Deleta uma oficina por ID
 * @access  Admin
 */
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const removed = await Oficina.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ error: 'Oficina não encontrada' });
        return res.json({ message: 'Oficina removida' });
    } catch (err) {
        return res.status(400).json({ error: 'ID inválido' });
    }
});

export default router;
