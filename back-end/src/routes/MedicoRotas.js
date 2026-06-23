import express from 'express';
import MedicoController from '../controllers/MedicoController.js';

const router = express.Router();

router.get('/medicos', MedicoController.listar);
router.get('/medicos/relatorio', MedicoController.relatorio);
router.post('/medicos', MedicoController.criar);
router.put('/medicos/:id', MedicoController.atualizar);
router.delete('/medicos/:id', MedicoController.excluir);

export default router;