import { Router } from "express";
import UsuarioController from "../controllers/UsuarioController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

// Todas as rotas exigem autenticação + nível admin
router.use(authenticate, authorize('admin'));

router.get('/usuarios', UsuarioController.listar);
router.post('/usuarios', UsuarioController.criar);
router.put('/usuarios/:id', UsuarioController.atualizar);
router.delete('/usuarios/:id', UsuarioController.excluir);
router.put('/usuarios/:id/senha', UsuarioController.redefinirSenhaAdmin);

export default router;