import DoacaoModel from "../Models/DoacaoModel.js";
import { gerarPDF } from "../utils/PdfGenerator.js";

class DoacaoController {
    static async listar(req, res) {
        try {
            const { termo } = req.query;
            const doacoes = termo ? await DoacaoModel.filtrar(termo) : await DoacaoModel.listarDoacoes();
            res.json(doacoes);
        } catch (error) {
            console.error('Erro ao listar doações: ', error);
            res.status(500).json({ error: 'Erro ao listar doações' });
        }
    }

    static async criar(req, res) {
        try {
            const { doa_doador_id, doa_valor, doa_data, doa_observacao } = req.body;
            if (!doa_doador_id || !doa_valor || !doa_data) {
                return res.status(400).json({ error: 'Doador, valor e data são obrigatórios.' });
            }
            const doacao = await DoacaoModel.criar({ doa_doador_id, doa_valor, doa_data, doa_observacao });
            res.status(201).json(doacao);
        } catch (error) {
            console.error("Erro ao criar doação: ", error);
            res.status(500).json({ error: "Erro ao criar doação" });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { doa_doador_id, doa_valor, doa_data, doa_observacao } = req.body;
            if (!doa_doador_id || !doa_valor || !doa_data) {
                return res.status(400).json({ error: 'Doador, valor e data são obrigatórios.' });
            }
            const doacao = await DoacaoModel.atualizar(id, { doa_doador_id, doa_valor, doa_data, doa_observacao });
            if (!doacao) return res.status(404).json({ error: 'Doação não encontrada' });
            res.json(doacao);
        } catch (error) {
            console.error("Erro ao atualizar doação: ", error);
            res.status(500).json({ error: "Erro ao atualizar doação" });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await DoacaoModel.excluir(id);
            if (!sucesso) return res.status(404).json({ error: 'Doação não encontrada' });
            res.json({ message: 'Doação excluída com sucesso' });
        } catch (error) {
            console.error("Erro ao excluir doação: ", error);
            res.status(500).json({ error: "Erro ao excluir doação" });
        }
    }

    static async relatorio(req, res) {
        try {
            const { termo } = req.query;
            const doacoes = termo ? await DoacaoModel.filtrar(termo) : await DoacaoModel.listarDoacoes();

            const colunas = ["ID", "Doador", "E-mail", "Valor", "Data", "Observação"];

            const dados = doacoes.map(d => {
                let dataFormatada = "-";
                if (d.doa_data) {
                    const dt = new Date(d.doa_data);
                    dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
                    dataFormatada = dt.toLocaleDateString('pt-BR');
                }
                return [
                    d.doa_id,
                    d.do_nome || "-",
                    d.do_email || "-",
                    `R$ ${Number(d.doa_valor).toFixed(2)}`,
                    dataFormatada,
                    d.doa_observacao || "-"
                ];
            });

            gerarPDF(res, "Relatorio_Doacoes", colunas, dados);
        } catch (error) {
            console.error("Erro ao gerar relatório de doações:", error);
            res.status(500).json({ error: "Erro ao gerar relatório" });
        }
    }
}

export default DoacaoController;