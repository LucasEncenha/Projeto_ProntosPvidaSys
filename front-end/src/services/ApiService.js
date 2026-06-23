const API_URL = 'http://localhost:3000/api';
const DEFAULT_OPTIONS = {
    credentials: 'include'
};

class ApiService {
    static async handleResponse(response) {
        if(!response.ok) {
            const error = await response.json().catch(() => ({error: 'Erro desconhecido'}));
            throw new Error(error.error || `Erro HTTP: ${response.status}`);
        }
        return response.json();
    }

    static async get(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`);
            return await this.handleResponse(response);
        } catch (error) {
            console.error("Erro na requisição GET:", error);
        }
    }

    static async delete(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {method: 'DELETE'});
            return await this.handleResponse(response);
        } catch (error) {
            console.error("Erro na requisição DELETE:", error);
        }
    }

    static async post(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error("Erro na requisição POST:", error);
            throw error;
        }
    }

    static async put(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error("Erro na requisição PUT:", error);
            throw error;
        }
    }

    async login(email, password) {
        return this.request('/auth', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            credentials: 'include' // Para cookies
        })
    }

    async logout() {
        return this.request('/auth/logout', {
            method: 'POST',
            credentials: 'include'
        })
    }

     async checkAuth() {
        return this.request('/auth/me', {
            credentials: 'include'
        })
    }
}

export default ApiService;