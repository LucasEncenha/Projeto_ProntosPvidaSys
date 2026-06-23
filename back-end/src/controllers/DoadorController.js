import DoadorModel from "../Models/DoadorModel.js";

class DoadorController {
    static async listar(req, res) {
        try {
            const { termo } = req.query;
            let doadores;

            if (termo) {
                doadores = await DoadorModel.filtrar(termo);
            } else {
                doadores = await DoadorModel.listarDoadores();
            }

            res.json(doadores);

        } catch (error) {
            console.error('Erro ao listar doadores: ', error);
            res.status(500).json({ error: 'Erro ao listar doadores' });
        }
    }

    static async criar(req, res) {
        try {
            const { do_nome, do_email, do_telefone, do_endereco } = req.body;

            if (!do_nome || !do_telefone || !do_email || !do_endereco) {
                return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
            }

            const doador = await DoadorModel.criar({ do_nome, do_email, do_telefone, do_endereco });
            res.status(201).json(doador);

        } catch (error) {
            console.error("Erro ao criar doador: ", error);
            res.status(500).json({ error: "Erro ao criar doador" });
        }
    }

    static async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { do_nome, do_email, do_telefone, do_endereco } = req.body;

            if (!do_nome || !do_telefone || !do_email || !do_endereco) {
                return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
            }

            const doador = await DoadorModel.atualizar(id, { do_nome, do_email, do_telefone, do_endereco });

            if (!doador) {
                return res.status(404).json({ error: 'Doador não encontrado' });
            }

            res.status(200).json(doador);

        } catch (error) {
            console.error("Erro ao atualizar doador: ", error);
            res.status(500).json({ error: "Erro ao atualizar doador" });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await DoadorModel.excluir(id);

            if (!sucesso) {
                return res.status(404).json({ error: 'Doador não encontrado' });
            }

            res.json({ message: 'Doador excluído com sucesso' });

        } catch (error) {
            console.error("Erro ao excluir doador: ", error);
            res.status(500).json({ error: "Erro ao excluir doador" });
        }
    }
}

export default DoadorController;