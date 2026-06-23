import pool from "../config/database.js";

class PacienteModel {
    static async listarPacientes() {
        const [rows] = await pool.query('SELECT * FROM pacientes ORDER BY pa_id DESC');
        return rows;
    }

    static async buscarPorCPF(pa_cpf) {
        const [rows] = await pool.query('SELECT * FROM pacientes WHERE pa_cpf = ?', [pa_cpf]);
        return rows;
    }

    static async buscarPorRGP(pa_rgp) {
        const [rows] = await pool.query('SELECT * FROM pacientes WHERE pa_rgp = ?', [pa_rgp]);
        return rows;
    }

    static async criar(paciente) {
        const { pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email } = paciente;

        const [result] = await pool.query(
            'INSERT INTO pacientes (pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email) VALUES (?,?,?,?,?,?,?)',
            [pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email || null]
        );

        return { id: result.insertId, pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email };
    }

    static async atualizar(id, paciente) {
        const { pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email } = paciente;

        const [result] = await pool.query(
            'UPDATE pacientes SET pa_cpf = ?, pa_rgp = ?, pa_nome = ?, pa_data_nascimento = ?, pa_telefone = ?, pa_endereco = ?, pa_email = ? WHERE pa_id = ?',
            [pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email || null, id]
        );

        if (result.affectedRows === 0) return null;
        return { id, pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email };
    }

    static async excluir(id) {
        const [result] = await pool.query('DELETE FROM pacientes WHERE pa_id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async filtrar(termo) {
        const t = `%${termo}%`;
        const [rows] = await pool.query(
            'SELECT * FROM pacientes WHERE pa_cpf LIKE ? OR pa_rgp LIKE ? OR pa_nome LIKE ? OR pa_telefone LIKE ? OR pa_endereco LIKE ? OR pa_email LIKE ? ORDER BY pa_id DESC',
            [t, t, t, t, t, t]
        );
        return rows;
    }
}

export default PacienteModel;