import pool from "../config/database.js";

class MedicoModel {
    static async listarMedicos() {
        const [rows] = await pool.query('SELECT * FROM medicos ORDER BY med_nome');
        return rows;
    }

    static async buscarPorId(id) {
        const [rows] = await pool.query('SELECT * FROM medicos WHERE med_id = ?', [id]);
        return rows[0];
    }

    static async criar(medico) {
        const { med_nome, med_crm, med_especialidade } = medico;
        const [result] = await pool.query(
            'INSERT INTO medicos (med_nome, med_crm, med_especialidade) VALUES (?,?,?)',
            [med_nome, med_crm, med_especialidade]
        );
        return { med_id: result.insertId, med_nome, med_crm, med_especialidade };
    }

    static async atualizar(id, medico) {
        const { med_nome, med_crm, med_especialidade } = medico;
        const [result] = await pool.query(
            'UPDATE medicos SET med_nome = ?, med_crm = ?, med_especialidade = ? WHERE med_id = ?',
            [med_nome, med_crm, med_especialidade, id]
        );
        if (result.affectedRows === 0) return null;
        return { med_id: id, med_nome, med_crm, med_especialidade };
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM medicos WHERE med_id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const t = `%${termo}%`;
        const [rows] = await pool.query(
            'SELECT * FROM medicos WHERE med_nome LIKE ? OR med_crm LIKE ? OR med_especialidade LIKE ? ORDER BY med_nome',
            [t, t, t]
        );
        return rows;
    }
}

export default MedicoModel;