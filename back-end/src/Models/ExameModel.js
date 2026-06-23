import pool from "../config/database.js";

class ExameModel {
    static async listarExames() {
        const [rows] = await pool.query(`
            SELECT 
                e.ex_id, e.ex_data, e.ex_hora,
                p.pa_id, p.pa_nome, p.pa_cpf,
                t.te_id, t.te_nome
            FROM exames e
            INNER JOIN pacientes p ON e.ex_paciente_id = p.pa_id
            INNER JOIN tipos_exames t ON e.ex_tipo_exame_id = t.te_id
            ORDER BY e.ex_id DESC
        `);
        return rows;
    }

    static async verificarDuplicidade(ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora, excluir_id = null) {
        if (!ex_paciente_id || !ex_data || !ex_hora) return true;

        let query = `
            SELECT ex_id FROM exames
            WHERE ex_paciente_id = ? AND ex_data = ? AND ex_hora = ?
        `;
        const params = [ex_paciente_id, ex_data, ex_hora];
        if (excluir_id) {
            query += ' AND ex_id != ?';
            params.push(excluir_id);
        }
        const [rows] = await pool.query(query, params);
        return rows.length === 0;
    }

    static async criar(exame) {
        const { ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora } = exame;
        const [result] = await pool.query(
            'INSERT INTO exames (ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora) VALUES (?,?,?,?)',
            [ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora || null]
        );
        return { ex_id: result.insertId, ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora };
    }

    static async atualizar(id, exame) {
        const { ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora } = exame;
        const [result] = await pool.query(
            'UPDATE exames SET ex_paciente_id = ?, ex_tipo_exame_id = ?, ex_data = ?, ex_hora = ? WHERE ex_id = ?',
            [ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora || null, id]
        );
        if (result.affectedRows === 0) return null;
        return { ex_id: id, ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora };
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM exames WHERE ex_id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const t = `%${termo}%`;
        const [rows] = await pool.query(`
            SELECT 
                e.ex_id, e.ex_data, e.ex_hora,
                p.pa_id, p.pa_nome, p.pa_cpf,
                t.te_id, t.te_nome
            FROM exames e
            INNER JOIN pacientes p ON e.ex_paciente_id = p.pa_id
            INNER JOIN tipos_exames t ON e.ex_tipo_exame_id = t.te_id
            WHERE p.pa_nome LIKE ? OR p.pa_cpf LIKE ? OR t.te_nome LIKE ? OR e.ex_data LIKE ?
            ORDER BY e.ex_id DESC
        `, [t, t, t, t]);
        return rows;
    }
}

export default ExameModel;