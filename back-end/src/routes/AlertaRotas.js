import express from 'express';
import { dispararAlertasManualmente } from '../services/AlertaJob.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/alertas/disparar', async (req, res) => {
    try {
        await dispararAlertasManualmente();
        res.json({ mensagem: 'Alertas disparados com sucesso.' });
    } catch (error) {
        console.error('Erro ao disparar alertas:', error);
        res.status(500).json({ error: 'Erro ao disparar alertas.' });
    }
});

export default router;