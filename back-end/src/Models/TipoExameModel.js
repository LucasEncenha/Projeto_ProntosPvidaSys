import pool from "../config/database.js";

class TipoExameModel {
    static async listarTiposExames() {
        const [rows] = await pool.query('SELECT * FROM tipos_exames');
        return rows;
    }

    static async criar(tipoExame) {
        const { te_nome, te_descricao, te_status = 1 } = tipoExame;

        const [result] = await pool.query(
            'INSERT INTO tipos_exames (te_nome, te_descricao, te_status) VALUES (?,?,?)',
            [te_nome, te_descricao, te_status]
        );

        return { te_id: result.insertId, te_nome, te_descricao, te_status };
    }

    static async atualizar(id, tipoExame) {
        const { te_nome, te_descricao, te_status } = tipoExame;

        const [result] = await pool.query(
            'UPDATE tipos_exames SET te_nome = ?, te_descricao = ?, te_status = ? WHERE te_id = ?',
            [te_nome, te_descricao, te_status, id]
        );

        if (result.affectedRows === 0) return null;

        return { te_id: id, te_nome, te_descricao, te_status };
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM tipos_exames WHERE te_id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async filtrar(filtro) {
        let query = 'SELECT * FROM tipos_exames WHERE 1=1';
        const params = [];

        if (filtro.nome) {
            query += ' AND te_nome LIKE ?';
            params.push(`%${filtro.nome}%`);
        }

        if (filtro.status !== undefined && filtro.status !== '') {
            query += ' AND te_status = ?';
            params.push(filtro.status);
        }

        query += ' ORDER BY te_id DESC';

        const [rows] = await pool.query(query, params);
        return rows;
    }
}

export default TipoExameModel;