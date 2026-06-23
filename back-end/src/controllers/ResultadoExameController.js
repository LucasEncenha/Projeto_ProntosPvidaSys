import ResultadoExameModel from "../Models/ResultadoExameModel.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/resultados';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `resultado_${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Formato não permitido. Use PDF, JPG ou PNG.'));
    }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

class ResultadoExameController {
    static async listar(req, res) {
        try {
            const { nome, cpf, tipoExame, dataInicio, dataFim } = req.query;
            const temFiltro = nome || cpf || tipoExame || dataInicio || dataFim;

            const resultados = temFiltro
                ? await ResultadoExameModel.filtrar({ nome, cpf, tipoExame, dataInicio, dataFim })
                : await ResultadoExameModel.listarResultados();

            res.json(resultados);
        } catch (error) {
            console.error('Erro ao listar resultados:', error);
            res.status(500).json({ error: 'Erro ao listar resultados' });
        }
    }

    static async buscarExamesPendentes(req, res) {
        try {
            const { cpf } = req.params;
            const exames = await ResultadoExameModel.buscarExamesPendentesPorCPF(cpf);
            if (exames.length === 0) {
                return res.status(404).json({ error: 'Nenhum exame pendente encontrado para este CPF.' });
            }
            res.json(exames);
        } catch (error) {
            console.error('Erro ao buscar exames pendentes:', error);
            res.status(500).json({ error: 'Erro ao buscar exames pendentes' });
        }
    }

    static async criar(req, res) {
        try {
            const { res_exame_id, res_resultado, res_data } = req.body;
            const res_arquivo = req.file ? `/uploads/resultados/${req.file.filename}` : null;

            if (!res_exame_id || !res_data) {
                return res.status(400).json({ error: 'Exame e data são obrigatórios.' });
            }

            const resultado = await ResultadoExameModel.criar({ res_exame_id, res_resultado, res_arquivo, res_data });
            res.status(201).json(resultado);
        } catch (error) {
            console.error('Erro ao cadastrar resultado:', error);
            res.status(500).json({ error: 'Erro ao cadastrar resultado' });
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;
            const sucesso = await ResultadoExameModel.excluir(id);
            if (!sucesso) return res.status(404).json({ error: 'Resultado não encontrado' });
            res.json({ message: 'Resultado excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir resultado:', error);
            res.status(500).json({ error: 'Erro ao excluir resultado' });
        }
    }
}

export default ResultadoExameController;