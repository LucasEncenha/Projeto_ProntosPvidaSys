import { useState } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


export default function RecuperarSenha() {
    const ETAPAS = { EMAIL: 'email', CODIGO: 'codigo', NOVA_SENHA: 'nova_senha', SUCESSO: 'sucesso' };
    const navigate = useNavigate();
    const [etapa, setEtapa] = useState(ETAPAS.EMAIL);
    const [email, setEmail] = useState('');
    const [codigo, setCodigo] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const limparErro = () => setErro('');

    const handleEnviarCodigo = async (e) => {
        e.preventDefault();
        setErro('');
        if (!email) { setErro('Informe o e-mail.'); return; }
        setCarregando(true);
        try {
            await axios.post('http://localhost:3000/auth/enviar-codigo', { email }, { withCredentials: true });
            setEtapa(ETAPAS.CODIGO);
        } catch (error) {
            setErro(error.response?.data?.erro || 'Erro ao enviar código.');
        } finally {
            setCarregando(false);
        }
    };

    const handleVerificarCodigo = async (e) => {
        e.preventDefault();
        setErro('');
        if (!codigo) { setErro('Informe o código.'); return; }
        setCarregando(true);
        try {
            await axios.post('http://localhost:3000/auth/verificar-codigo', { email, codigo }, { withCredentials: true });
            setEtapa(ETAPAS.NOVA_SENHA);
        } catch (error) {
            setErro(error.response?.data?.erro || 'Código inválido ou expirado.');
        } finally {
            setCarregando(false);
        }
    };

    const handleRedefinirSenha = async (e) => {
        e.preventDefault();
        setErro('');
        if (novaSenha.length < 6) { setErro('A senha deve ter no mínimo 6 caracteres.'); return; }
        if (novaSenha !== confirmarSenha) { setErro('As senhas não coincidem.'); return; }
        setCarregando(true);
        try {
            await axios.post('http://localhost:3000/auth/redefinir-senha', { email, codigo, novaSenha }, { withCredentials: true });
            setEtapa(ETAPAS.SUCESSO);
        } catch (error) {
            setErro(error.response?.data?.erro || 'Erro ao redefinir senha.');
        } finally {
            setCarregando(false);
        }
    };

    const handleReenviar = async () => {
        setErro('');
        setCarregando(true);
        try {
            await axios.post('http://localhost:3000/auth/enviar-codigo', { email }, { withCredentials: true });
            setCodigo('');
            alert('Novo código enviado!');
        } catch (error) {
            setErro(error.response?.data?.erro || 'Erro ao reenviar código.');
        } finally {
            setCarregando(false);
        }
    };

    const progressoEtapa = {
        [ETAPAS.EMAIL]: 1,
        [ETAPAS.CODIGO]: 2,
        [ETAPAS.NOVA_SENHA]: 3,
        [ETAPAS.SUCESSO]: 3
    };

    return (
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
            <Card className="shadow p-4" style={{ width: '100%', maxWidth: '420px' }}>
                <Card.Body>
                    <h2 className="text-center fw-bold text-primary mb-2">Recuperar Senha</h2>

                    {etapa !== ETAPAS.SUCESSO && (
                        <div className="d-flex justify-content-center gap-2 mb-4">
                            {[1, 2, 3].map(n => (
                                <div
                                    key={n}
                                    style={{
                                        width: 32, height: 32, borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.85rem', fontWeight: 600,
                                        background: progressoEtapa[etapa] >= n ? '#0d6efd' : '#e9ecef',
                                        color: progressoEtapa[etapa] >= n ? '#fff' : '#aaa'
                                    }}
                                >{n}</div>
                            ))}
                        </div>
                    )}

                    {erro && <Alert variant="danger" dismissible onClose={limparErro}>{erro}</Alert>}

                    {etapa === ETAPAS.EMAIL && (
                        <Form onSubmit={handleEnviarCodigo} noValidate>
                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                                Informe seu e-mail cadastrado. Enviaremos um código de 6 dígitos para confirmar sua identidade.
                            </p>
                            <Form.Group className="mb-4">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100" disabled={carregando}>
                                {carregando ? 'Enviando...' : 'Enviar Código'}
                            </Button>
                            <div className="text-center mt-3">
                                <Link to="/login" className="text-decoration-none text-secondary" style={{ fontSize: '0.9rem' }}>
                                    Voltar para o Login
                                </Link>
                            </div>
                        </Form>
                    )}

                    {etapa === ETAPAS.CODIGO && (
                        <Form onSubmit={handleVerificarCodigo} noValidate>
                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                                Enviamos um código para <strong>{email}</strong>. Digite-o abaixo. Ele expira em 15 minutos.
                            </p>
                            <Form.Group className="mb-4">
                                <Form.Label>Código de 6 dígitos</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="000000"
                                    maxLength={6}
                                    value={codigo}
                                    onChange={e => setCodigo(e.target.value.replace(/\D/g, ''))}
                                    style={{ letterSpacing: '6px', fontSize: '1.4rem', textAlign: 'center' }}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" variant="primary" className="w-100 mb-2" disabled={carregando}>
                                {carregando ? 'Verificando...' : 'Verificar Código'}
                            </Button>
                            <div className="text-center mt-2">
                                <span
                                    className="text-primary"
                                    style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                    onClick={handleReenviar}
                                >
                                    Reenviar código
                                </span>
                                <span className="text-muted mx-2">·</span>
                                <span
                                    className="text-secondary"
                                    style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                    onClick={() => { setEtapa(ETAPAS.EMAIL); setErro(''); }}
                                >
                                    Trocar e-mail
                                </span>
                            </div>
                        </Form>
                    )}

                    {etapa === ETAPAS.NOVA_SENHA && (
                        <Form onSubmit={handleRedefinirSenha} noValidate>
                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                                Código confirmado! Defina sua nova senha.
                            </p>
                            <Form.Group className="mb-3">
                                <Form.Label>Nova Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={novaSenha}
                                    onChange={e => setNovaSenha(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Confirmar Nova Senha</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Repita a nova senha"
                                    value={confirmarSenha}
                                    onChange={e => setConfirmarSenha(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" variant="success" className="w-100" disabled={carregando}>
                                {carregando ? 'Salvando...' : 'Redefinir Senha'}
                            </Button>
                        </Form>
                    )}

                    {etapa === ETAPAS.SUCESSO && (
                        <div className="text-center">
                            <div style={{ fontSize: '3rem' }}>✅</div>
                            <h5 className="fw-bold mt-2">Senha redefinida!</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                Sua senha foi alterada com sucesso. Faça login com a nova senha.
                            </p>
                            <Button variant="primary" className="w-100 mt-2" onClick={() => navigate('/login')}>
                                Ir para o Login
                            </Button>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}