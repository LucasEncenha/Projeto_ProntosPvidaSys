import ApiService from "./ApiService.js";

class TipoExameService {

    async listarTodos() {
        try {
            return await ApiService.get('/tipoExame');
        } catch (error) {
            console.error('Erro ao listar tipos de exame:', error);
            return [];
        }
    }

    async salvar(tipoExame) {
        if (tipoExame.te_id) {
            return await ApiService.put(`/tipoExame/${tipoExame.te_id}`, tipoExame);
        } else {
            return await ApiService.post('/tipoExame', tipoExame);
        }
    }

    async excluir(id) {
        try {
            await ApiService.delete(`/tipoExame/${id}`);
            return true;
        } catch (error) {
            console.error('Erro ao excluir tipo de exame:', error);
            return false;
        }
    }

    async filtrar(filtro) {
        try {
            const params = new URLSearchParams();
            if (filtro.nome) params.append('nome', filtro.nome);
            if (filtro.status !== undefined && filtro.status !== '') params.append('status', filtro.status);
            return await ApiService.get(`/tipoExame?${params.toString()}`);
        } catch (error) {
            console.error('Erro ao filtrar tipos de exame:', error);
            return [];
        }
    }
}

export default new TipoExameService();