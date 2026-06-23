import ApiService from "./ApiService.js";

class ExameService {
    async listarTodos() {
        try { return await ApiService.get('/exames'); }
        catch (error) { console.error('Erro ao listar exames:', error); return []; }
    }

    async verificarDuplicidade(paciente, tipo, data, hora, excluirId = null) {
        try {
            if (!paciente || !data || !hora) return { duplicado: false };
            let url = `/exames/verificar?paciente=${paciente}&tipo=${tipo}&data=${data}&hora=${hora}`;
            if (excluirId) url += `&excluir_id=${excluirId}`;
            return await ApiService.get(url);
        } catch (error) {
            console.error('Erro ao verificar duplicidade:', error);
            return { duplicado: false };
        }
    }

    async salvar(exame) {
        if (exame.ex_id) return await ApiService.put(`/exames/${exame.ex_id}`, exame);
        return await ApiService.post('/exames', exame);
    }

    async excluir(id) {
        try { await ApiService.delete(`/exames/${id}`); return true; }
        catch (error) { console.error('Erro ao excluir exame:', error); return false; }
    }

    async filtrar(termo) {
        try { return await ApiService.get(`/exames?termo=${encodeURIComponent(termo)}`); }
        catch (error) { return []; }
    }
}

export default new ExameService();