import express from 'express';
import Voluntario from '../models/voluntario.model.js';
import Oficina from '../models/oficina.model.js';
import TermoLog from '../models/termoLog.model.js';
import { authenticate, authorize, ROLES } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @route GET /metrics/dashboard
 * @desc  Retorna indicadores gerais do sistema
 * @access Admin, Coordenador
 */
router.get(
  '/dashboard',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.COORDENADOR),
  async (req, res) => {
    try {
      // Executa contagens em paralelo
      const [ativos, inativos, oficinasCount, termosCount] = await Promise.all([
        Voluntario.countDocuments({ ativo: true }),
        Voluntario.countDocuments({ ativo: false }),
        Oficina.countDocuments(),
        TermoLog.countDocuments(),
      ]);

      return res.json({
        totalVoluntariosAtivos: ativos,
        totalVoluntariosInativos: inativos,
        totalOficinas: oficinasCount,
        totalTermosGerados: termosCount,
      });
    } catch (err) {
      console.error('Erro ao buscar métricas:', err);
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;
