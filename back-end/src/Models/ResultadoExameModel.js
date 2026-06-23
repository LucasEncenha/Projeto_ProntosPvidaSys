import pool from "../config/database.js";
//nodemeiler //funçoes consultas do dia
class ResultadoExameModel {
    static async listarResultados() {
        const [rows] = await pool.query(`
            SELECT 
                r.res_id, r.res_resultado, r.res_arquivo, r.res_data,
                e.ex_id, e.ex_data,
                p.pa_id, p.pa_nome, p.pa_cpf,
                t.te_nome
            FROM resultado_exames r
            INNER JOIN exames e ON r.res_exame_id = e.ex_id
            INNER JOIN pacientes p ON e.ex_paciente_id = p.pa_id
            INNER JOIN tipos_exames t ON e.ex_tipo_exame_id = t.te_id
            ORDER BY r.res_data DESC, r.res_id DESC
        `);
        return rows;
    }

    static async filtrar({ nome, cpf, tipoExame, dataInicio, dataFim }) {
        let query = `
            SELECT 
                r.res_id, r.res_resultado, r.res_arquivo, r.res_data,
                e.ex_id, e.ex_data,
                p.pa_id, p.pa_nome, p.pa_cpf,
                t.te_nome
            FROM resultado_exames r
            INNER JOIN exames e ON r.res_exame_id = e.ex_id
            INNER JOIN pacientes p ON e.ex_paciente_id = p.pa_id
            INNER JOIN tipos_exames t ON e.ex_tipo_exame_id = t.te_id
            WHERE 1=1
        `;
        const params = [];

        if (nome) { query += ' AND p.pa_nome LIKE ?'; params.push(`%${nome}%`); }
        if (cpf) { query += ' AND p.pa_cpf LIKE ?'; params.push(`%${cpf}%`); }
        if (tipoExame) { query += ' AND t.te_nome LIKE ?'; params.push(`%${tipoExame}%`); }
        if (dataInicio) { query += ' AND r.res_data >= ?'; params.push(dataInicio); }
        if (dataFim) { query += ' AND r.res_data <= ?'; params.push(dataFim); }

        query += ' ORDER BY r.res_data DESC, r.res_id DESC';

        const [rows] = await pool.query(query, params);
        return rows;
    }

    static async buscarExamesPendentesPorCPF(cpf) {
        const [rows] = await pool.query(`
            SELECT 
                e.ex_id, e.ex_data,
                p.pa_nome, p.pa_cpf,
                t.te_nome
            FROM exames e
            INNER JOIN pacientes p ON e.ex_paciente_id = p.pa_id
            INNER JOIN tipos_exames t ON e.ex_tipo_exame_id = t.te_id
            LEFT JOIN resultado_exames r ON r.res_exame_id = e.ex_id
            WHERE p.pa_cpf = ? AND r.res_id IS NULL
            ORDER BY e.ex_data DESC
        `, [cpf]);
        return rows;
    }

    static async criar(resultado) {
        const { res_exame_id, res_resultado, res_arquivo, res_data } = resultado;
        const [result] = await pool.query(
            'INSERT INTO resultado_exames (res_exame_id, res_resultado, res_arquivo, res_data) VALUES (?,?,?,?)',
            [res_exame_id, res_resultado || null, res_arquivo || null, res_data]
        );
        return { res_id: result.insertId, res_exame_id, res_resultado, res_arquivo, res_data };
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM resultado_exames WHERE res_id = ?', [id]);
        return result.affectedRows > 0;
    }
}

export default ResultadoExameModel;