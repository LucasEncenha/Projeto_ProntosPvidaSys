import ApiService from "./ApiService.js";

class ResultadoExameService {
    async listarTodos() {
        try {
            return await ApiService.get('/resultados') || [];
        } catch (error) {
            console.error('Erro ao listar resultados:', error);
            return [];
        }
    }

    async filtrar({ nome, cpf, tipoExame, dataInicio, dataFim }) {
        try {
            const params = new URLSearchParams();
            if (nome) params.append('nome', nome);
            if (cpf) params.append('cpf', cpf);
            if (tipoExame) params.append('tipoExame', tipoExame);
            if (dataInicio) params.append('dataInicio', dataInicio);
            if (dataFim) params.append('dataFim', dataFim);
            return await ApiService.get(`/resultados?${params.toString()}`) || [];
        } catch (error) {
            console.error('Erro ao filtrar resultados:', error);
            return [];
        }
    }

    async buscarExamesPendentes(cpf) {
        try {
            return await ApiService.get(`/resultados/pendentes/${cpf}`) || [];
        } catch {
            return [];
        }
    }

    async salvar(formData) {
        const response = await fetch('http://localhost:3000/api/resultados', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Erro ao salvar resultado.');
        }
        return response.json();
    }

    async excluir(id) {
        try {
            await ApiService.delete(`/resultados/${id}`);
            return true;
        } catch (error) {
            console.error('Erro ao excluir resultado:', error);
            return false;
        }
    }
}

export default new ResultadoExameService();