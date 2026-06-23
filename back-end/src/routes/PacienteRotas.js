import express from 'express';
import PacienteController from '../controllers/PacienteController.js';

const router = express.Router();

router.get('/pacientes', PacienteController.listar);
router.get('/pacientes/relatorio', PacienteController.relatorio);
router.post('/pacientes', PacienteController.criar);
router.put('/pacientes/:id', PacienteController.atualizar);
router.delete('/pacientes/:id', PacienteController.excluir);
 
export default router;