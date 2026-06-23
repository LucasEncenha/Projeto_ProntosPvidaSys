import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
 
export default function ProtectedRoute({ children, roles }) {
    const { usuario, carregando } = useAuth();
 
    if (carregando) return <p>Carregando...</p>;
 
    if (!usuario) return <Navigate to="/login" />;
 
    if (roles && roles.length > 0 && !roles.includes(usuario.nivel)) {
        return <Navigate to="/" />;
    }
 
    return children;
}
 