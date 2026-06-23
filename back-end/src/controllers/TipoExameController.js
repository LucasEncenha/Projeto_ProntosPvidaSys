import TipoExameModel from "../Models/TipoExameModel.js";

class TipoExameController {
    static async listar(req, res) {
        try {
            const { nome, status } = req.query;
            let tiposExames;

            if (nome || status) {
                tiposExames = await TipoExameModel.filtrar({ nome, status });
            } else {
                tiposExames = await TipoExameModel.listarTiposExames();
            }

            res.json(tiposExames);

        } catch (error) {
            console.error('Erro ao listar tipos de exame: ', error);
            res.status(500).json({ error: 'Erro ao listar tipos de exame' });
        }
    }

    static async criar(req, res) {
        try {
            const { te_nome, te_descricao, te_status } = req.body;

            if (!te_nome) {
                return res.status(400).json({ error: 'O nome do tipo de exame é obrigatório.' });
            }

            const tipoExame = await TipoExameModel.criar({ te_nome, te_descricao, te_status });
            res.status(201).json(tipoExame);

        } catch (error) {
            console.error("Erro ao criar tipo de exame: ", error);
            res.status(500).json({ error: "Erro ao criar tipo de exame" });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { te_nome, te_descricao, te_status } = req.body;

            if (!te_nome) {
                return res.status(400).json({ error: 'O nome do tipo de exame é obrigatório.' });
            }

            const tipoExame = await TipoExameModel.atualizar(id, { te_nome, te_descricao, te_status });

            if (!tipoExame) {
                return res.status(404).json({ error: 'Tipo de exame não encontrado' });
            }

            res.status(200).json(tipoExame);

        } catch (error) {
            console.error("Erro ao atualizar tipo de exame: ", error);
            res.status(500).json({ error: "Erro ao atualizar tipo de exame" });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await TipoExameModel.excluir(id);

            if (!sucesso) {
                return res.status(404).json({ error: 'Tipo de exame não encontrado' });
            }

            res.json({ message: 'Tipo de exame excluído com sucesso' });

        } catch (error) {
            console.error("Erro ao excluir tipo de exame: ", error);
            res.status(500).json({ error: "Erro ao excluir tipo de exame" });
        }
    }
}

export default TipoExameController;