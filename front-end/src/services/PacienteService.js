import ApiService from "./ApiService.js";

class PacienteService {

    converterData(data) {
        if (!data) return data;
        if (data.includes('T')) {
            return data.split('T')[0];
        }
        if (data.includes('/')) {
            const [dia, mes, ano] = data.split('/');
            return `${ano}-${mes}-${dia}`;
        }

        return data;
    }

    async listarTodos() {
        try {
            return await ApiService.get('/pacientes');
        } catch (error) {
            console.error('Erro ao listar pacientes:', error);
            return [];
        }
    }

    async buscarPorId(id) {
        const pacientes = await this.listarTodos();
        return pacientes.find(v => v.pa_id === id);
    }

    async salvar(paciente) {
        const dados = {
            ...paciente,
            pa_data_nascimento: this.converterData(paciente.pa_data_nascimento)
        };

        if (dados.pa_id) {
            return await ApiService.put(`/pacientes/${dados.pa_id}`, dados);
        } else {
            return await ApiService.post('/pacientes', dados);
        }
    }

    async excluir(id) {
        try {
            await ApiService.delete(`/pacientes/${id}`);
            return true;
        } catch (error) {
            console.error('Erro ao excluir paciente:', error);
            return false;
        }
    }

    async filtrar(termo) {
        try {
            return await ApiService.get(`/pacientes?termo=${encodeURIComponent(termo)}`);
        } catch (error) {
            console.error('Erro ao filtrar pacientes:', error);
            return [];
        }
    }
}

export default new PacienteService();