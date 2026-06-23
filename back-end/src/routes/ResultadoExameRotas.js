import express from 'express';
import ResultadoExameController, { upload } from '../controllers/ResultadoExameController.js';

const router = express.Router();

router.get('/resultados', ResultadoExameController.listar);
router.get('/resultados/pendentes/:cpf', ResultadoExameController.buscarExamesPendentes);
router.post('/resultados', upload.single('arquivo'), ResultadoExameController.criar);
router.delete('/resultados/:id', ResultadoExameController.excluir);

export default router;