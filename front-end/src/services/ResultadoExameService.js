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
        const token = localStorage.getItem('auth_token');
        const baseURL = `${import.meta.env.VITE_API_URL}/api`;

        const response = await fetch(`${baseURL}/resultados`, {
            method: 'POST',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
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