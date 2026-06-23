import express from 'express';
import DoacaoController from '../controllers/DoacaoController.js';

const router = express.Router();

router.get('/doacoes', DoacaoController.listar);
router.get('/doacoes/relatorio', DoacaoController.relatorio);
router.post('/doacoes', DoacaoController.criar);
router.put('/doacoes/:id', DoacaoController.atualizar);
router.delete('/doacoes/:id', DoacaoController.excluir);

export default router;