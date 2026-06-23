import jwt from 'jsonwebtoken';
import pool from "../config/database.js";
import { enviarEmailCodigoRecuperacao } from "../services/EmailService.js";

class AuthController {
    static async login(req, res) {
        try {
            const { email, senha } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ erro: 'Preencha e-mail e senha.' });
            }

            const [usuarios] = await pool.query(
                'SELECT * FROM usuarios WHERE usu_email = ? AND usu_senha = ?',
                [email, senha]
            );
            const user = usuarios[0];
            if (!user) {
                return res.status(401).json({ erro: 'Credenciais inválidas. Verifique seus dados.' });
            }

            const secret = process.env.JWT_SECRET || 'chave_super_secreta_padrao';
            const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
            const token = jwt.sign(
                { sub: user.usu_id, role: user.usu_nivel },
                secret,
                { expiresIn, issuer: 'myapp' }
            );

            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000
            });

            return res.json({
                usuario: {
                    id: user.usu_id,
                    nome: user.usu_nome,
                    email: user.usu_email,
                    nivel: user.usu_nivel
                }
            });
        } catch (error) {
            console.error('Erro ao fazer login: ', error);
            res.status(500).json({ erro: 'Erro interno ao realizar login' });
        }
    }

    static async registrar(req, res) {
        try {
            const { nome, email, senha } = req.body;
            if (!nome || !email || !senha) {
                return res.status(400).json({ erro: 'Preencha todos os campos.' });
            }

            const [usuariosExistentes] = await pool.query(
                'SELECT * FROM usuarios WHERE usu_email = ?', [email]
            );
            if (usuariosExistentes.length > 0) {
                return res.status(400).json({ erro: 'Este e-mail já está cadastrado.' });
            }

            await pool.query(
                'INSERT INTO usuarios (usu_nome, usu_email, usu_senha, usu_nivel) VALUES (?, ?, ?, ?)',
                [nome, email, senha, 'usuario']
            );

            return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
        } catch (error) {
            console.error("Erro ao cadastrar usuário: ", error);
            return res.status(500).json({ erro: 'Erro interno ao cadastrar usuário' });
        }
    }

    static async getMe(req, res) {
        try {
            const [usuarios] = await pool.query(
                'SELECT * FROM usuarios WHERE usu_id = ?', [req.user.sub]
            );
            const user = usuarios[0];
            if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

            return res.json({
                usuario: {
                    id: user.usu_id,
                    nome: user.usu_nome,
                    email: user.usu_email,
                    nivel: user.usu_nivel
                }
            });
        } catch (error) {
            console.error("Erro ao buscar perfil: ", error);
            res.status(500).json({ erro: 'Erro ao buscar perfil do usuário' });
        }
    }

    static async alterarSenha(req, res) {
        try {
            const { senhaAtual, novaSenha } = req.body;
            if (!senhaAtual || !novaSenha) {
                return res.status(400).json({ erro: 'Preencha todos os campos.' });
            }
            if (novaSenha.length < 6) {
                return res.status(400).json({ erro: 'A nova senha deve ter no mínimo 6 caracteres.' });
            }

            const [usuarios] = await pool.query(
                'SELECT * FROM usuarios WHERE usu_id = ? AND usu_senha = ?',
                [req.user.sub, senhaAtual]
            );
            if (usuarios.length === 0) {
                return res.status(401).json({ erro: 'Senha atual incorreta.' });
            }

            await pool.query(
                'UPDATE usuarios SET usu_senha = ? WHERE usu_id = ?',
                [novaSenha, req.user.sub]
            );

            return res.json({ mensagem: 'Senha alterada com sucesso!' });
        } catch (error) {
            console.error("Erro ao alterar senha: ", error);
            res.status(500).json({ erro: 'Erro interno ao alterar senha.' });
        }
    }

    static async enviarCodigo(req, res) {
        try {
            const { email } = req.body;
            if (!email) return res.status(400).json({ erro: 'Informe o e-mail.' });

            const [usuarios] = await pool.query(
                'SELECT * FROM usuarios WHERE usu_email = ?', [email]
            );
            if (usuarios.length === 0) {
                return res.status(404).json({ erro: 'E-mail não encontrado.' });
            }

            await pool.query(
                'UPDATE codigos_recuperacao SET cod_usado = 1 WHERE cod_email = ? AND cod_usado = 0',
                [email]
            );

            const codigo = Math.floor(100000 + Math.random() * 900000).toString();
            const expiracao = new Date(Date.now() + 15 * 60 * 1000);

            await pool.query(
                'INSERT INTO codigos_recuperacao (cod_email, cod_codigo, cod_expiracao) VALUES (?, ?, ?)',
                [email, codigo, expiracao]
            );

            await enviarEmailCodigoRecuperacao(email, codigo);

            return res.json({ mensagem: 'Código enviado para o e-mail informado.' });
        } catch (error) {
            console.error("Erro ao enviar código: ", error);
            res.status(500).json({ erro: 'Erro ao enviar código. Tente novamente.' });
        }
    }

    static async verificarCodigo(req, res) {
        try {
            const { email, codigo } = req.body;
            if (!email || !codigo) {
                return res.status(400).json({ erro: 'Informe o e-mail e o código.' });
            }

            const [codigos] = await pool.query(
                `SELECT * FROM codigos_recuperacao 
                 WHERE cod_email = ? AND cod_codigo = ? AND cod_usado = 0 AND cod_expiracao > NOW()
                 ORDER BY cod_id DESC LIMIT 1`,
                [email, codigo]
            );

            if (codigos.length === 0) {
                return res.status(400).json({ erro: 'Código inválido ou expirado.' });
            }

            return res.json({ mensagem: 'Código válido.' });
        } catch (error) {
            console.error("Erro ao verificar código: ", error);
            res.status(500).json({ erro: 'Erro ao verificar código.' });
        }
    }

    static async redefinirSenha(req, res) {
        try {
            const { email, codigo, novaSenha } = req.body;

            if (!email || !codigo || !novaSenha) {
                return res.status(400).json({ erro: 'Preencha todos os campos.' });
            }
            if (novaSenha.length < 6) {
                return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres.' });
            }

            const [codigos] = await pool.query(
                `SELECT * FROM codigos_recuperacao 
                 WHERE cod_email = ? AND cod_codigo = ? AND cod_usado = 0 AND cod_expiracao > NOW()
                 ORDER BY cod_id DESC LIMIT 1`,
                [email, codigo]
            );

            if (codigos.length === 0) {
                return res.status(400).json({ erro: 'Código inválido ou expirado.' });
            }

            await pool.query(
                'UPDATE codigos_recuperacao SET cod_usado = 1 WHERE cod_id = ?',
                [codigos[0].cod_id]
            );

            await pool.query(
                'UPDATE usuarios SET usu_senha = ? WHERE usu_email = ?',
                [novaSenha, email]
            );

            return res.json({ mensagem: 'Senha redefinida com sucesso!' });
        } catch (error) {
            console.error("Erro ao redefinir senha: ", error);
            res.status(500).json({ erro: 'Erro interno ao redefinir senha.' });
        }
    }

    static async logout(req, res) {
        try {
            res.clearCookie('auth_token');
            return res.json({ mensagem: 'Logout realizado com sucesso' });
        } catch (error) {
            console.error("Erro ao fazer logout: ", error);
            res.status(500).json({ erro: 'Erro ao fazer logout' });
        }
    }
}

export default AuthController;