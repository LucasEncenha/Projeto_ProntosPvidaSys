import ExameModel from "../Models/ExameModel.js";
import { gerarPDF } from "../utils/PdfGenerator.js";

class ExameController {
    static async listar(req, res) {
        try {
            const { termo } = req.query;
            const exames = termo ? await ExameModel.filtrar(termo) : await ExameModel.listarExames();
            res.json(exames);
        } catch (error) {
            console.error('Erro ao listar exames:', error);
            res.status(500).json({ error: 'Erro ao listar exames' });
        }
    }

    static async verificarDuplicidade(req, res) {
        try {
            const { paciente, tipo, data, hora, excluir_id } = req.query;

            if (!paciente || !data || !hora) {
                return res.json({ duplicado: false });
            }

            const disponivel = await ExameModel.verificarDuplicidade(paciente, tipo, data, hora, excluir_id || null);
            res.json({ duplicado: !disponivel });
        } catch (error) {
            console.error('Erro ao verificar duplicidade:', error);
            res.status(500).json({ error: 'Erro ao verificar duplicidade' });
        }
    }

    static async criar(req, res) {
        try {
            const { ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora } = req.body;

            if (!ex_paciente_id || !ex_tipo_exame_id || !ex_data) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }

            const disponivel = await ExameModel.verificarDuplicidade(ex_paciente_id, ex_tipo_exame_id, ex_data);
            if (!disponivel) {
                return res.status(400).json({ error: 'Este paciente já possui este tipo de exame cadastrado para esta data.' });
            }

            const exame = await ExameModel.criar({ ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora });
            res.status(201).json(exame);
        } catch (error) {
            console.error('Erro ao criar exame:', error);
            res.status(500).json({ error: 'Erro ao criar exame' });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora } = req.body;

            if (!ex_paciente_id || !ex_tipo_exame_id || !ex_data) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
            }

            const disponivel = await ExameModel.verificarDuplicidade(ex_paciente_id, ex_tipo_exame_id, ex_data, id);
            if (!disponivel) {
                return res.status(400).json({ error: 'Este paciente já possui este tipo de exame cadastrado para esta data.' });
            }

            const exame = await ExameModel.atualizar(id, { ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora });
            if (!exame) return res.status(404).json({ error: 'Exame não encontrado' });
            res.json(exame);
        } catch (error) {
            console.error('Erro ao atualizar exame:', error);
            res.status(500).json({ error: 'Erro ao atualizar exame' });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await ExameModel.excluir(id);
            if (!sucesso) return res.status(404).json({ error: 'Exame não encontrado' });
            res.json({ message: 'Exame excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir exame:', error);
            res.status(500).json({ error: 'Erro ao excluir exame' });
        }
    }

    static async relatorio(req, res) {
        try {
            const { termo } = req.query;
            const exames = termo ? await ExameModel.filtrar(termo) : await ExameModel.listarExames();

            const colunas = ["Paciente", "CPF", "Tipo de Exame", "Data", "Horário"];

            const dados = exames.map(e => {
                let dataFormatada = "-";
                if (e.ex_data) {
                    const dataObj = new Date(e.ex_data);
                    dataObj.setMinutes(dataObj.getMinutes() + dataObj.getTimezoneOffset());
                    dataFormatada = dataObj.toLocaleDateString('pt-BR');
                }
                return [
                    e.pa_nome || "-",
                    e.pa_cpf || "-",
                    e.te_nome || "-",
                    dataFormatada,
                    e.ex_hora ? e.ex_hora.slice(0, 5) : "-"
                ];
            });

            gerarPDF(res, "Relatorio_Exames", colunas, dados);
        } catch (error) {
            console.error("Erro ao gerar relatório de exames:", error);
            res.status(500).json({ error: "Erro ao gerar relatório de exames" });
        }
    }
}

export default ExameController;