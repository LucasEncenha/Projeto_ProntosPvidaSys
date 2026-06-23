import express from 'express';
import TipoExameController from '../controllers/TipoExameController.js';

const router = express.Router();

router.get('/tipoExame', TipoExameController.listar);
router.post('/tipoExame', TipoExameController.criar);
router.put('/tipoExame/:id', TipoExameController.atualizar);
router.delete('/tipoExame/:id', TipoExameController.excluir);
 
export default router;