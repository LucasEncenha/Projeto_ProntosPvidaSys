import express from 'express';
import ConsultaController from '../controllers/ConsultaController.js';

const router = express.Router();

router.get('/consultas', ConsultaController.listar);
router.get('/consultas/relatorio', ConsultaController.relatorio);
router.get('/consultas/verificar', ConsultaController.verificarDisponibilidade);
router.get('/consultas/paciente/:cpf', ConsultaController.buscarPacientePorCPF);
router.post('/consultas', ConsultaController.criar);
router.put('/consultas/:id', ConsultaController.atualizar);
router.delete('/consultas/:id', ConsultaController.excluir);

export default router;