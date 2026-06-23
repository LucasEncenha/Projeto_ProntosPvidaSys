import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './pages/Login';
import Home from './pages/home';
import TelaDoadores from "./components/doadores/Tela.jsx";
import TelaTipoExame from './components/tipos-exames/Tela.jsx';
import TelaPaciente from "./components/pacientes/Tela.jsx";
import TelaExames from "./components/exames/Tela.jsx";
import TelaDoacoes from "./components/doacoes/Tela.jsx";
import TelaMedicos from "./components/medicos/Tela.jsx";
import TelaConsultas from "./components/consultas/Tela.jsx";
import TelaResultados from "./components/resultados/Tela.jsx";
import TelaUsuarios from './components/usuarios/TelaUsuarios.jsx';

import NavBar from "./components/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Perfil from "./components/Perfil.jsx";
import RecuperarSenha from "./components/RecuperarSenha.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="App">
                    <NavBar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/recuperar-senha" element={<RecuperarSenha />} />

                        <Route path="/" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />

                        <Route path="/pacientes" element={
                            <ProtectedRoute roles={['admin', 'operador', 'usuario']}>
                                <TelaPaciente />
                            </ProtectedRoute>
                        } />

                        <Route path="/tipo-exames" element={
                            <ProtectedRoute roles={['admin', 'operador']}>
                                <TelaTipoExame />
                            </ProtectedRoute>
                        } />

                        <Route path="/doadores" element={
                            <ProtectedRoute roles={['admin']}>
                                <TelaDoadores />
                            </ProtectedRoute>
                        } />

                        <Route path="/exames" element={
                            <ProtectedRoute>
                                <TelaExames />
                            </ProtectedRoute>
                        } />

                        <Route path="/perfil" element={
                            <ProtectedRoute>
                                <Perfil />
                            </ProtectedRoute>
                        } />

                        <Route path="/doacoes" element={
                            <ProtectedRoute>
                                <TelaDoacoes />
                            </ProtectedRoute>
                        } />

                        <Route path="/medicos" element={
                            <ProtectedRoute>
                                <TelaMedicos />
                            </ProtectedRoute>
                        } />
                        <Route path="/consultas" element={
                            <ProtectedRoute>
                                <TelaConsultas />
                            </ProtectedRoute>
                        } />
                        <Route path="/resultados" element={
                            <ProtectedRoute>
                                <TelaResultados />
                            </ProtectedRoute>
                        } />

                        <Route path="/usuarios" element={
                            <ProtectedRoute roles={['admin']}>
                                <TelaUsuarios />
                            </ProtectedRoute>
                        } />

                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;