import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/perfil', {withCredentials: true})
        .then(res => setUsuario(res.data.usuario))
        .catch(() => setUsuario(null))
        .finally(() => setCarregando(false));
    }, []);

    async function login(email, senha) {
        const res = await axios.post('http://localhost:3000/auth/login', {email, senha}, {withCredentials: true});
        setUsuario(res.data.usuario);
    }

    async function registrar(nome, email, senha) {
        await axios.post('http://localhost:3000/auth/register', {nome, email, senha}, {withCredentials: true});
    }

    async function logout() {
        try {
            await axios.post('http://localhost:3000/auth/logout', {}, {withCredentials: true});
        } catch (error) {
            console.error("Erro ao comunicar logout ao servidor:", error);
        } finally {
            setUsuario(null); 
        }
    }

    async function alterarSenha(senhaAtual, novaSenha) {
        try {
            await axios.put('http://localhost:3000/auth/alterar-senha', {senhaAtual, novaSenha}, {withCredentials: true});
        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            throw error;
        }
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