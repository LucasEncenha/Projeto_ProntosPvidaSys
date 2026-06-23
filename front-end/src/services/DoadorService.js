import ApiService from "./ApiService.js";

class DoadorService {

    async listarTodos() {
        try {
            return await ApiService.get('/doadores');
        } catch (error) {
            console.error('Erro ao listar doadores:', error);
            return [];
        }
    }

    async buscarPorId(id) {
        const doadores = await this.listarTodos();
        return doadores.find(v => v.do_id === id);
    }

    async salvar(doador) {
        if (doador.do_id) {
            return await ApiService.put(`/doadores/${doador.do_id}`, doador);
        } else {
            return await ApiService.post('/doadores', doador);
        }
    }

    async excluir(id) {
        try {
            await ApiService.delete(`/doadores/${id}`);
            return true;
        } catch (error) {
            console.error('Erro ao excluir doador:', error);
            return false;
        }
    }

    async filtrar(termo) {
        try {
            return await ApiService.get(`/doadores?termo=${encodeURIComponent(termo)}`);
        } catch (error) {
            console.error('Erro ao filtrar doadores:', error);
            return [];
        }
    }
}

export default new DoadorService();