import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setCarregando(false);
            return;
        }

        axios.get(`${API}/auth/perfil`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => setUsuario(res.data.usuario))
            .catch(() => {
                localStorage.removeItem('auth_token');
                setUsuario(null);
            })
            .finally(() => setCarregando(false));
    }, []);

    async function login(email, senha) {
        const res = await axios.post(`${API}/auth/login`, { email, senha });
        const { token, usuario } = res.data;
        localStorage.setItem('auth_token', token);
        setUsuario(usuario);
    }

    async function registrar(nome, email, senha) {
        await axios.post(`${API}/auth/register`, { nome, email, senha });
    }

    async function logout() {
        try {
            const token = localStorage.getItem('auth_token');
            await axios.post(`${API}/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Erro ao comunicar logout ao servidor:", error);
        } finally {
            localStorage.removeItem('auth_token');
            setUsuario(null);
        }
    }

    async function alterarSenha(senhaAtual, novaSenha) {
        const token = localStorage.getItem('auth_token');
        await axios.put(`${API}/auth/alterar-senha`, { senhaAtual, novaSenha }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    return (
        <AuthContext.Provider value={{ usuario, carregando, login, logout, registrar, alterarSenha }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}