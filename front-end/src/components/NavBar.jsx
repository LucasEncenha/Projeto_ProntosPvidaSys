import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { usuario, logout } = useAuth();

    const handleLogout = async () => {
        if (window.confirm('Deseja sair do sistema?')) {
            await logout();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    Sistema ProntosPvidaSys
                </Link>

                {usuario && (
                    <>
                        <div className="navbar-nav me-auto">
                            <Link className="nav-link" to="/pacientes">Paciente</Link>
                            <Link className="nav-link" to="/exames">Exames</Link>
                            <Link className="nav-link" to="/doacoes">Doações</Link>
                            <Link className="nav-link" to="/consultas">Consultas</Link>
                        </div>

                        <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
                            <ul className="navbar-nav">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        Menu
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                                        <Link className="nav-link" to="/tipo-exames">Tipo-Exames</Link>
                                        <Link className="nav-link" to="/doadores">Doadores</Link>
                                        <Link className="nav-link" to="/medicos">Médicos</Link>
                                        <Link className="nav-link" to="/resultados">Resultados de Exames</Link>
                                    </ul>
                                </li>
                            </ul>
                        </div>

                        <div className="navbar-nav">
                            <span className="navbar-text me-3">
                                <Link className="nav-link" to="/perfil">Olá, {usuario.nome} ({usuario.nivel})</Link>
                            </span>
                            <button
                                className="btn btn-outline-light btn-sm mb-3  mt-3"
                                onClick={handleLogout}
                            >
                                Sair
                            </button>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;