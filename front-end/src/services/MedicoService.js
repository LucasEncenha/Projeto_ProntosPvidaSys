import ApiService from "./ApiService.js";

class MedicoService {
    async listarTodos() {
        try { return await ApiService.get('/medicos'); }
        catch (error) { console.error('Erro ao listar médicos:', error); return []; }
    }
    async salvar(medico) {
        if (medico.med_id) return await ApiService.put(`/medicos/${medico.med_id}`, medico);
        return await ApiService.post('/medicos', medico);
    }
    async excluir(id) {
        try { await ApiService.delete(`/medicos/${id}`); return true; }
        catch (error) { console.error('Erro ao excluir médico:', error); return false; }
    }
    async filtrar(termo) {
        try { return await ApiService.get(`/medicos?termo=${encodeURIComponent(termo)}`); }
        catch (error) { return []; }
    }
}
export default new MedicoService();