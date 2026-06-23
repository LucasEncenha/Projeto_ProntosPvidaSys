const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const getHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

class ApiService {
    static async handleResponse(response) {
        if (response.status === 304) return null;
        if (response.status === 204) return null;

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
            throw new Error(error.error || `Erro HTTP: ${response.status}`);
        }
        return response.json();
    }

    static async get(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error("Erro na requisição GET:", error);
            throw error;
        }
    }

    static async delete(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error("Erro na requisição DELETE:", error);
            throw error;
        }
    }

    static async post(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: getHeaders(),
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
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error("Erro na requisição PUT:", error);
            throw error;
        }
    }
}

export default ApiService;