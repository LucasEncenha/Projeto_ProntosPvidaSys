import ConsultaModel from "../Models/ConsultaModel.js";
import { gerarPDF } from "../utils/PdfGenerator.js";

class ConsultaController {
    static async listar(req, res) {
        try {
            const { termo } = req.query;
            const consultas = termo
                ? await ConsultaModel.filtrar(termo)
                : await ConsultaModel.listarConsultas();
            res.json(consultas);
        } catch (error) {
            console.error('Erro ao listar consultas:', error);
            res.status(500).json({ error: 'Erro ao listar consultas' });
        }
    }

    static async criar(req, res) {
        try {
            const { con_paciente_id, con_medico_id, con_data, con_hora, con_tipo, con_status, con_observacoes } = req.body;

            if (!con_paciente_id || !con_medico_id || !con_data || !con_hora || !con_tipo) {
                return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
            }

            const disponivel = await ConsultaModel.verificarDisponibilidade(con_medico_id, con_data, con_hora);
            if (!disponivel) {
                return res.status(400).json({ error: 'O médico já possui uma consulta agendada para este dia e horário.' });
            }

            const consulta = await ConsultaModel.criar({ con_paciente_id, con_medico_id, con_data, con_hora, con_tipo, con_status, con_observacoes });
            res.status(201).json(consulta);
        } catch (error) {
            console.error('Erro ao criar consulta:', error);
            res.status(500).json({ error: 'Erro ao criar consulta' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { con_paciente_id, con_medico_id, con_data, con_hora, con_tipo, con_status, con_observacoes } = req.body;

            if (!con_paciente_id || !con_medico_id || !con_data || !con_hora || !con_tipo || !con_status) {
                return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
            }

            const disponivel = await ConsultaModel.verificarDisponibilidade(con_medico_id, con_data, con_hora, id);
            if (!disponivel) {
                return res.status(400).json({ error: 'O médico já possui outra consulta neste mesmo dia e horário.' });
            }

            const consulta = await ConsultaModel.atualizar(id, { con_paciente_id, con_medico_id, con_data, con_hora, con_tipo, con_status, con_observacoes });
            if (!consulta) return res.status(404).json({ error: 'Consulta não encontrada.' });
            res.json(consulta);
        } catch (error) {
            console.error('Erro ao atualizar consulta:', error);
            res.status(500).json({ error: 'Erro ao atualizar consulta' });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await ConsultaModel.excluir(id);
            if (!sucesso) return res.status(404).json({ error: 'Consulta não encontrada.' });
            res.json({ message: 'Consulta excluída com sucesso.' });
        } catch (error) {
            console.error('Erro ao excluir consulta:', error);
            res.status(500).json({ error: 'Erro ao excluir consulta' });
        }
    }

    static async buscarPacientePorCPF(req, res) {
        try {
            const { cpf } = req.params;
            const paciente = await ConsultaModel.buscarPorCPF(cpf);
            if (!paciente) return res.status(404).json({ error: 'Paciente não encontrado com o CPF informado.' });
            res.json(paciente);
        } catch (error) {
            console.error('Erro ao buscar paciente por CPF:', error);
            res.status(500).json({ error: 'Erro ao buscar paciente por CPF' });
        }
    }

    static async verificarDisponibilidade(req, res) {
        try {
            const { medico, data, hora } = req.query;
            const disponivel = await ConsultaModel.verificarDisponibilidade(medico, data, hora);
            res.json({ ocupado: !disponivel });
        } catch (error) {
            console.error("Erro ao verificar disponibilidade:", error);
            res.status(500).json({ error: "Erro ao verificar disponibilidade" });
        }
    }

    static async relatorio(req, res) {
        try {
            const { termo } = req.query;
            const consultas = termo
                ? await ConsultaModel.filtrar(termo)
                : await ConsultaModel.listarConsultas();

            const colunas = ["ID", "Paciente", "Médico", "Data", "Hora", "Tipo", "Status"];

            const dados = consultas.map(c => {
                if (!c) return ["-", "-", "-", "-", "-", "-", "-"];
                let dataFormatada = "-";
                if (c.con_data) {
                    const dataObj = new Date(c.con_data);
                    dataObj.setMinutes(dataObj.getMinutes() + dataObj.getTimezoneOffset());
                    dataFormatada = dataObj.toLocaleDateString('pt-BR');
                }
                return [
                    c.con_id || "-",
                    c.pa_nome || "-",
                    c.med_nome || "-",
                    dataFormatada,
                    c.con_hora ? c.con_hora.slice(0, 5) : "-",
                    c.con_tipo || "-",
                    c.con_status || "-"
                ];
            });

            gerarPDF(res, "Relatorio_Consultas", colunas, dados);
        } catch (error) {
            console.error("Erro ao gerar relatório de consultas:", error);
            res.status(500).json({ error: "Erro ao gerar relatório de consultas" });
        }
    }
}

export default ConsultaController;