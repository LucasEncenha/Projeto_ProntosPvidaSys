import pool from "../config/database.js";

class ConsultaModel {
    static async listarConsultas() {
        const [rows] = await pool.query(`
            SELECT 
                c.con_id, c.con_data, c.con_hora, c.con_tipo, c.con_status, c.con_observacoes,
                p.pa_id, p.pa_nome, p.pa_cpf,
                m.med_id, m.med_nome, m.med_especialidade
            FROM consultas c
            INNER JOIN pacientes p ON c.con_paciente_id = p.pa_id
            INNER JOIN medicos m ON c.con_medico_id = m.med_id
            ORDER BY c.con_data DESC, c.con_hora DESC
        `);
        return rows;
    }

    static async buscarPorCPF(cpf) {
        const [rows] = await pool.query(
            'SELECT * FROM pacientes WHERE pa_cpf = ?', [cpf]
        );
        return rows[0];
    }

    static async verificarDisponibilidade(med_id, data, hora, excluir_id = null) {
        let query = `
            SELECT con_id FROM consultas 
            WHERE con_medico_id = ? AND con_data = ? AND con_hora = ? AND con_status != 'cancelada'
        `;
        const params = [med_id, data, hora];
        if (excluir_id) {
            query += ' AND con_id != ?';
            params.push(excluir_id);
        }
        const [rows] = await pool.query(query, params);
        return rows.length === 0;
    }

    static async criar(consulta) {
        const { con_paciente_id, con_medico_id, con_data, con_hora, con_tipo, con_status, con_observacoes } = consulta;
        const [result] = await pool.query(
            'INSERT INTO consultas (con_paciente_id, con_medico_id, con_data, con_hora, con_tipo, con_status, con_observacoes) VALUES (?,?,?,?,?,?,?)',
            [con_paciente_id, con_medico_id, con_data, con_hora, con_tipo, con_status || 'agendada', con_observacoes || null]
        );
        return { con_id: result.insertId, ...consulta };
    }

    static async atualizar(id, consulta) {
        const { con_paciente_id, con_medico_id, con_data, con_hora, con_tipo, con_status, con_observacoes } = consulta;
        const [result] = await pool.query(
            'UPDATE consultas SET con_paciente_id=?, con_medico_id=?, con_data=?, con_hora=?, con_tipo=?, con_status=?, con_observacoes=? WHERE con_id=?',
            [con_paciente_id, con_medico_id, con_data, con_hora, con_tipo, con_status, con_observacoes || null, id]
        );
        if (result.affectedRows === 0) return null;
        return { con_id: id, ...consulta };
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM consultas WHERE con_id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const t = `%${termo}%`;
        const [rows] = await pool.query(`
            SELECT 
                c.con_id, c.con_data, c.con_hora, c.con_tipo, c.con_status, c.con_observacoes,
                p.pa_id, p.pa_nome, p.pa_cpf,
                m.med_id, m.med_nome, m.med_especialidade
            FROM consultas c
            INNER JOIN pacientes p ON c.con_paciente_id = p.pa_id
            INNER JOIN medicos m ON c.con_medico_id = m.med_id
            WHERE p.pa_nome LIKE ? OR p.pa_cpf LIKE ? OR m.med_nome LIKE ? OR c.con_status LIKE ? OR c.con_tipo LIKE ?
            ORDER BY c.con_data DESC, c.con_hora DESC
        `, [t, t, t, t, t]);
        return rows;
    }
}

export default ConsultaModel;