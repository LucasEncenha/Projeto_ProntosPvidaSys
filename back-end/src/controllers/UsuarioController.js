import pool from "../config/database.js";

class UsuarioController {
    static async listar(req, res) {
        try {
            const [usuarios] = await pool.query(
                'SELECT usu_id, usu_nome, usu_email, usu_nivel FROM usuarios ORDER BY usu_id DESC'
            );
            res.json(usuarios);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({ error: 'Erro ao listar usuários' });
        }
    }

    static async criar(req, res) {
        try {
            const { usu_nome, usu_email, usu_senha, usu_nivel } = req.body;

            if (!usu_nome || !usu_email || !usu_senha || !usu_nivel) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }

            if (!['admin', 'usuario'].includes(usu_nivel)) {
                return res.status(400).json({ error: 'Nível inválido. Use "admin" ou "usuario".' });
            }

            const [existente] = await pool.query(
                'SELECT usu_id FROM usuarios WHERE usu_email = ?', [usu_email]
            );
            if (existente.length > 0) {
                return res.status(400).json({ error: 'E-mail já cadastrado.' });
            }

            const [result] = await pool.query(
                'INSERT INTO usuarios (usu_nome, usu_email, usu_senha, usu_nivel) VALUES (?, ?, ?, ?)',
                [usu_nome, usu_email, usu_senha, usu_nivel]
            );

            res.status(201).json({ usu_id: result.insertId, usu_nome, usu_email, usu_nivel });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: 'Erro ao criar usuário' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { usu_nome, usu_email, usu_nivel } = req.body;

            if (!usu_nome || !usu_email || !usu_nivel) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }

            if (!['admin', 'usuario'].includes(usu_nivel)) {
                return res.status(400).json({ error: 'Nível inválido. Use "admin" ou "usuario".' });
            }

            const [result] = await pool.query(
                'UPDATE usuarios SET usu_nome = ?, usu_email = ?, usu_nivel = ? WHERE usu_id = ?',
                [usu_nome, usu_email, usu_nivel, id]
            );

            if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

            res.json({ usu_id: id, usu_nome, usu_email, usu_nivel });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;

            if (parseInt(id) === req.user.sub) {
                return res.status(400).json({ error: 'Você não pode excluir sua própria conta.' });
            }

            const [result] = await pool.query('DELETE FROM usuarios WHERE usu_id = ?', [id]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

            res.json({ message: 'Usuário excluído com sucesso.' });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({ error: 'Erro ao excluir usuário' });
        }
    }

    static async redefinirSenhaAdmin(req, res) {
        try {
            const { id } = req.params;
            const { novaSenha } = req.body;

            if (!novaSenha || novaSenha.length < 6) {
                return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
            }

            const [result] = await pool.query(
                'UPDATE usuarios SET usu_senha = ? WHERE usu_id = ?',
                [novaSenha, id]
            );

            if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

            res.json({ mensagem: 'Senha redefinida com sucesso.' });
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            res.status(500).json({ error: 'Erro ao redefinir senha' });
        }
    }
}

export default UsuarioController;