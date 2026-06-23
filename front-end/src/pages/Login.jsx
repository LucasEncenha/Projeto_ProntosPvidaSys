import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom"; // <-- Importe o Link aqui

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    const [nome, setNome] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        try {
            await login(nome, senha);
            navigate("/");
        } catch (error) {
            setErro("Falha ao fazer login. Verifique suas credenciais.");
            console.error(error);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <Card className="shadow p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4 fw-bold text-primary">Login</h2>
                    
                    {erro && <Alert variant="danger">{erro}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formNome">
                            <Form.Label>Email de Usuário</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Digite seu email" 
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formSenha">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Digite sua senha" 
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                            <div className="text-end mt-2">
                                <Link 
                                    to="/recuperar-senha" 
                                    className="text-decoration-none text-secondary" 
                                    style={{ fontSize: "0.85rem" }}
                                >
                                    Esqueci minha senha
                                </Link>
                            </div>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 py-2 fs-5 mt-2"
                            disabled={carregando}
                        >
                            {carregando ? 'Entrando...' : 'Entrar'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}