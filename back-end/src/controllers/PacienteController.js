import PacienteModel from "../Models/PacienteModel.js";
import { gerarPDF } from "../utils/PdfGenerator.js";

class PacienteController {
    static async listar(req, res) {
        try {
            const { termo } = req.query;
            const pacientes = termo ? await PacienteModel.filtrar(termo) : await PacienteModel.listarPacientes();
            res.json(pacientes);
        } catch (error) {
            console.error('Erro ao listar pacientes:', error);
            res.status(500).json({ error: 'Erro ao listar pacientes' });
        }
    }

    static async criar(req, res) {
        try {
            const { pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email } = req.body;

            if (!pa_cpf || !pa_rgp || !pa_nome || !pa_data_nascimento || !pa_telefone || !pa_endereco) {
                return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
            }

            const pacienteExistente = await PacienteModel.buscarPorCPF(pa_cpf);
            if (pacienteExistente.length > 0) {
                return res.status(400).json({ error: 'CPF já cadastrado!' });
            }

            const rgpExistente = await PacienteModel.buscarPorRGP(pa_rgp);
            if (rgpExistente.length > 0) {
                return res.status(400).json({ error: 'RGP já cadastrado!' });
            }

            const paciente = await PacienteModel.criar({ pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email });
            res.status(201).json(paciente);
        } catch (error) {
            console.error('Erro ao criar paciente:', error);
            res.status(500).json({ error: 'Erro ao criar paciente' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email } = req.body;

            if (!pa_cpf || !pa_rgp || !pa_nome || !pa_data_nascimento || !pa_telefone || !pa_endereco) {
                return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
            }

            const paciente = await PacienteModel.atualizar(id, { pa_cpf, pa_rgp, pa_nome, pa_data_nascimento, pa_telefone, pa_endereco, pa_email });
            if (!paciente) return res.status(404).json({ error: 'Paciente não encontrado.' });
            res.json(paciente);
        } catch (error) {
            console.error('Erro ao atualizar paciente:', error);
            res.status(500).json({ error: 'Erro ao atualizar paciente' });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await PacienteModel.excluir(id);
            if (!sucesso) return res.status(404).json({ error: 'Paciente não encontrado.' });
            res.json({ message: 'Paciente excluído com sucesso.' });
        } catch (error) {
            console.error('Erro ao excluir paciente:', error);
            res.status(500).json({ error: 'Erro ao excluir paciente' });
        }
    }

    static async relatorio(req, res) {
        try {
            const { termo } = req.query;
            const pacientes = termo ? await PacienteModel.filtrar(termo) : await PacienteModel.listarPacientes();

            const colunas = ["RGP", "Nome", "CPF", "Telefone", "E-mail", "Endereço"];

            const dados = pacientes.map(p => [
                p.pa_rgp || '-',
                p.pa_nome || '-',
                p.pa_cpf || '-',
                p.pa_telefone || '-',
                p.pa_email || '-',
                p.pa_endereco || '-'
            ]);

            gerarPDF(res, "Relatorio_Pacientes", colunas, dados);
        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            res.status(500).json({ error: 'Erro ao gerar relatório' });
        }
    }
}

export default PacienteController;