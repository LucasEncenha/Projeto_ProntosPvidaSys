import { useState } from "react";
import { Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "../context/AuthContext.jsx";

function Perfil() {
    const { usuario, alterarSenha } = useAuth();

    const [form, setForm] = useState({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
    });

    const [erros, setErros] = useState({});
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [carregando, setCarregando] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (erros[name]) {
            setErros(prev => ({ ...prev, [name]: null }));
        }
    };

    const validar = () => {
        const novosErros = {};
        if (!form.senhaAtual) novosErros.senhaAtual = 'Informe a senha atual.';
        if (!form.novaSenha) novosErros.novaSenha = 'Informe a nova senha.';
        else if (form.novaSenha.length < 6) novosErros.novaSenha = 'A nova senha deve ter no mínimo 6 caracteres.';
        if (!form.confirmarSenha) novosErros.confirmarSenha = 'Confirme a nova senha.';
        else if (form.novaSenha !== form.confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem.';

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });

        if (!validar()) return;

        setCarregando(true);
        try {
            await alterarSenha(form.senhaAtual, form.novaSenha);
            setMensagem({ tipo: 'success', texto: 'Senha alterada com sucesso!' });
        } catch (error) {
            const msg = error.response?.data?.erro || 'Erro...';
            setMensagem({ tipo: 'danger', texto: msg });
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Meu Perfil</h1>

            <Row>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Header>
                            <strong>Informações da Conta</strong>
                        </Card.Header>
                        <Card.Body>
                            <p><strong>Nome:</strong> {usuario?.nome}</p>
                            <p><strong>E-mail:</strong> {usuario?.email}</p>
                            <p><strong>Nível:</strong> {usuario?.nivel}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <strong>Alterar Senha</strong>
                        </Card.Header>
                        <Card.Body>
                            {mensagem.texto && (
                                <Alert
                                    variant={mensagem.tipo}
                                    dismissible
                                    onClose={() => setMensagem({ tipo: '', texto: '' })}
                                >
                                    {mensagem.texto}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit} noValidate>
                                <Form.Group className="mb-3">
                                    <Form.Label>Senha Atual *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="senhaAtual"
                                        value={form.senhaAtual}
                                        onChange={handleChange}
                                        isInvalid={!!erros.senhaAtual}
                                        placeholder="Digite sua senha atual"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {erros.senhaAtual}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Nova Senha *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="novaSenha"
                                        value={form.novaSenha}
                                        onChange={handleChange}
                                        isInvalid={!!erros.novaSenha}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {erros.novaSenha}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Confirmar Nova Senha *</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="confirmarSenha"
                                        value={form.confirmarSenha}
                                        onChange={handleChange}
                                        isInvalid={!!erros.confirmarSenha}
                                        placeholder="Repita a nova senha"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {erros.confirmarSenha}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={carregando}
                                    style={{ width: '100%' }}
                                >
                                    {carregando ? 'Salvando...' : 'Alterar Senha'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Perfil;