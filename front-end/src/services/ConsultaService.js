import ApiService from "./ApiService.js";

class ConsultaService {
    async listarTodos() {
        try { return await ApiService.get('/consultas'); }
        catch (error) { console.error('Erro ao listar consultas:', error); return []; }
    }

    async buscarPacientePorCPF(cpf) {
        return await ApiService.get(`/consultas/paciente/${cpf}`);
    }

    async verificarDisponibilidade(medico, data, hora) {
        try {
            return await ApiService.get(`/consultas/verificar?medico=${medico}&data=${data}&hora=${hora}`);
        } catch (error) {
            console.error('Erro ao verificar disponibilidade:', error);
            return { ocupado: false };
        }
    }

    async salvar(consulta) {
        if (consulta.con_id) return await ApiService.put(`/consultas/${consulta.con_id}`, consulta);
        return await ApiService.post('/consultas', consulta);
    }

    async excluir(id) {
        try { await ApiService.delete(`/consultas/${id}`); return true; }
        catch (error) { console.error('Erro ao excluir consulta:', error); return false; }
    }

    async filtrar(termo) {
        try { return await ApiService.get(`/consultas?termo=${encodeURIComponent(termo)}`); }
        catch (error) { return []; }
    }
}

export default new ConsultaService();