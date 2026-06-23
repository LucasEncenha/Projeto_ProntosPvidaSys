import ApiService from "./ApiService.js";

class DoacaoService {

    async listarTodos() {
        try {
            return await ApiService.get('/doacoes');
        } catch (error) {
            console.error('Erro ao listar doações:', error);
            return [];
        }
    }

    async salvar(doacao) {
        if (doacao.doa_id) {
            return await ApiService.put(`/doacoes/${doacao.doa_id}`, doacao);
        } else {
            return await ApiService.post('/doacoes', doacao);
        }
    }

    async excluir(id) {
        try {
            await ApiService.delete(`/doacoes/${id}`);
            return true;
        } catch (error) {
            console.error('Erro ao excluir doação:', error);
            return false;
        }
    }

    async filtrar(termo) {
        try {
            return await ApiService.get(`/doacoes?termo=${encodeURIComponent(termo)}`);
        } catch (error) {
            console.error('Erro ao filtrar doações:', error);
            return [];
        }
    }
}

export default new DoacaoService();