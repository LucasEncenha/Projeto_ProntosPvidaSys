import express from 'express';
import DoadorController from '../controllers/DoadorController.js';

const router = express.Router();

router.get('/doadores', DoadorController.listar);
router.post('/doadores', DoadorController.criar);
router.put('/doadores/:id', DoadorController.atualizar);
router.delete('/doadores/:id', DoadorController.excluir);
 
export default router;