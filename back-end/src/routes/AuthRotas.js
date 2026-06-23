import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.registrar);
router.post('/logout', AuthController.logout);
router.post('/enviar-codigo', AuthController.enviarCodigo);
router.post('/verificar-codigo', AuthController.verificarCodigo);
router.post('/redefinir-senha', AuthController.redefinirSenha);

router.get('/perfil', authenticate, AuthController.getMe);
router.put('/alterar-senha', authenticate, AuthController.alterarSenha);

export default router;