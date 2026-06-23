import ApiService from "./ApiService.js";

class UsuarioService {
    async listarTodos() {
        try { return await ApiService.get('/usuarios'); }
        catch (error) { console.error('Erro ao listar usuários:', error); return []; }
    }

    async salvar(usuario) {
        if (usuario.usu_id) return await ApiService.put(`/usuarios/${usuario.usu_id}`, usuario);
        return await ApiService.post('/usuarios', usuario);
    }

    async excluir(id) {
        try { await ApiService.delete(`/usuarios/${id}`); return true; }
        catch (error) { throw error; }
    }

    async redefinirSenha(id, novaSenha) {
        return await ApiService.put(`/usuarios/${id}/senha`, { novaSenha });
    }
}

export default new UsuarioService();