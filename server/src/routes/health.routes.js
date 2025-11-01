import express from 'express';

const router = express.Router();

/**
 * @route   GET /health
 * @desc    Rota de saúde da API
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default router;

