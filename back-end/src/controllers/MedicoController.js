import MedicoModel from "../Models/MedicoModel.js";
import { gerarPDF } from "../utils/PdfGenerator.js";

class MedicoController {
    static async listar(req, res) {
        try {
            const { termo } = req.query;
            const medicos = termo ? await MedicoModel.filtrar(termo) : await MedicoModel.listarMedicos();
            res.json(medicos);
        } catch (error) {
            console.error('Erro ao listar médicos:', error);
            res.status(500).json({ error: 'Erro ao listar médicos' });
        }
    }

    static async criar(req, res) {
        try {
            const { med_nome, med_crm, med_especialidade } = req.body;
            if (!med_nome || !med_crm || !med_especialidade) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }
            const medico = await MedicoModel.criar({ med_nome, med_crm, med_especialidade });
            res.status(201).json(medico);
        } catch (error) {
            console.error('Erro ao criar médico:', error);
            res.status(500).json({ error: 'Erro ao criar médico' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { med_nome, med_crm, med_especialidade } = req.body;
            if (!med_nome || !med_crm || !med_especialidade) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }
            const medico = await MedicoModel.atualizar(id, { med_nome, med_crm, med_especialidade });
            if (!medico) return res.status(404).json({ error: 'Médico não encontrado' });
            res.json(medico);
        } catch (error) {
            console.error('Erro ao atualizar médico:', error);
            res.status(500).json({ error: 'Erro ao atualizar médico' });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await MedicoModel.excluir(id);
            if (!sucesso) return res.status(404).json({ error: 'Médico não encontrado' });
            res.json({ message: 'Médico excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir médico:', error);
            res.status(500).json({ error: 'Erro ao excluir médico' });
        }
    }

    static async relatorio(req, res) {
        try {
            const { termo } = req.query;
            const medicos = termo ? await MedicoModel.filtrar(termo) : await MedicoModel.listarMedicos();

            const colunas = ["ID", "Nome", "CRM", "Especialidade"];

            const dados = medicos.map(m => [
                m.med_id,
                m.med_nome || "-",
                m.med_crm || "-",
                m.med_especialidade || "-"
            ]);

            gerarPDF(res, "Relatorio_Medicos", colunas, dados);
        } catch (error) {
            console.error("Erro ao gerar relatório de médicos:", error);
            res.status(500).json({ error: "Erro ao gerar relatório" });
        }
    }
}

export default MedicoController;