import pool from "../config/database.js";

class DoacaoModel {
    static async listarDoacoes() {
        const [rows] = await pool.query(`
            SELECT 
                d.doa_id,
                d.doa_valor,
                d.doa_data,
                d.doa_observacao,
                do.do_id,
                do.do_nome,
                do.do_email
            FROM doacoes d
            INNER JOIN doadores do ON d.doa_doador_id = do.do_id
            ORDER BY d.doa_id DESC
        `);
        return rows;
    }

    static async criar(doacao) {
        const { doa_doador_id, doa_valor, doa_data, doa_observacao } = doacao;

        const [result] = await pool.query(
            'INSERT INTO doacoes (doa_doador_id, doa_valor, doa_data, doa_observacao) VALUES (?,?,?,?)',
            [doa_doador_id, doa_valor, doa_data, doa_observacao || null]
        );

        return { doa_id: result.insertId, doa_doador_id, doa_valor, doa_data, doa_observacao };
    }

    static async atualizar(id, doacao) {
        const { doa_doador_id, doa_valor, doa_data, doa_observacao } = doacao;

        const [result] = await pool.query(
            'UPDATE doacoes SET doa_doador_id = ?, doa_valor = ?, doa_data = ?, doa_observacao = ? WHERE doa_id = ?',
            [doa_doador_id, doa_valor, doa_data, doa_observacao || null, id]
        );

        if (result.affectedRows === 0) return null;

        return { doa_id: id, doa_doador_id, doa_valor, doa_data, doa_observacao };
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM doacoes WHERE doa_id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const termoBusca = `%${termo}%`;
        const [rows] = await pool.query(`
            SELECT 
                d.doa_id,
                d.doa_valor,
                d.doa_data,
                d.doa_observacao,
                do.do_id,
                do.do_nome,
                do.do_email
            FROM doacoes d
            INNER JOIN doadores do ON d.doa_doador_id = do.do_id
            WHERE do.do_nome LIKE ? OR do.do_email LIKE ? OR d.doa_data LIKE ? OR d.doa_observacao LIKE ?
            ORDER BY d.doa_id DESC
        `, [termoBusca, termoBusca, termoBusca, termoBusca]);
        return rows;
    }
}

export default DoacaoModel;