import express from 'express';
import ExameController from '../controllers/ExameController.js';

const router = express.Router();

router.get('/exames', ExameController.listar);
router.get('/exames/relatorio', ExameController.relatorio);
router.get('/exames/verificar', ExameController.verificarDuplicidade);
router.post('/exames', ExameController.criar);
router.put('/exames/:id', ExameController.atualizar);
router.delete('/exames/:id', ExameController.excluir);

export default router;