import { useState, useEffect } from "react";
import { Container, Badge, Button, Table, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import { BsPersonPlusFill, BsPencilSquare, BsTrash, BsKeyFill } from "react-icons/bs";
import UsuarioService from "../../services/UsuarioService.js";

const NIVEIS = ['admin', 'usuario'];

function TelaUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [modalCadastrar, setModalCadastrar] = useState(false);
    const [modalEditar, setModalEditar] = useState(false);
    const [modalSenha, setModalSenha] = useState(false);
    const [modalExcluir, setModalExcluir] = useState(false);
    const [selecionado, setSelecionado] = useState(null);
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [erros, setErros] = useState({});

    const [formCadastrar, setFormCadastrar] = useState({ usu_nome: '', usu_email: '', usu_senha: '', usu_nivel: 'usuario' });
    const [formEditar, setFormEditar] = useState({ usu_id: '', usu_nome: '', usu_email: '', usu_nivel: 'usuario' });
    const [novaSenha, setNovaSenha] = useState('');

    useEffect(() => { carregarUsuarios(); }, []);

    const carregarUsuarios = async () => {
        setCarregando(true);
        try {
            const dados = await UsuarioService.listarTodos();
            setUsuarios(dados || []);
        } catch { setUsuarios([]); }
        finally { setCarregando(false); }
    };

    const handleCadastrar = async (e) => {
        e.preventDefault();
        const novosErros = {};
        if (!formCadastrar.usu_nome) novosErros.usu_nome = 'Nome obrigatório.';
        if (!formCadastrar.usu_email) novosErros.usu_email = 'E-mail obrigatório.';
        if (!formCadastrar.usu_senha || formCadastrar.usu_senha.length < 6) novosErros.usu_senha = 'Senha com mínimo 6 caracteres.';
        if (Object.keys(novosErros).length > 0) { setErros(novosErros); return; }

        try {
            await UsuarioService.salvar(formCadastrar);
            setModalCadastrar(false);
            setFormCadastrar({ usu_nome: '', usu_email: '', usu_senha: '', usu_nivel: 'usuario' });
            setErros({});
            carregarUsuarios();
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: error.message || 'Erro ao cadastrar usuário.' });
        }
    };

    const handleEditar = async (e) => {
        e.preventDefault();
        const novosErros = {};
        if (!formEditar.usu_nome) novosErros.usu_nome = 'Nome obrigatório.';
        if (!formEditar.usu_email) novosErros.usu_email = 'E-mail obrigatório.';
        if (Object.keys(novosErros).length > 0) { setErros(novosErros); return; }

        try {
            await UsuarioService.salvar(formEditar);
            setModalEditar(false);
            setErros({});
            carregarUsuarios();
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: error.message || 'Erro ao atualizar usuário.' });
        }
    };

    const handleRedefinirSenha = async (e) => {
        e.preventDefault();
        if (!novaSenha || novaSenha.length < 6) {
            setErros({ novaSenha: 'Senha com mínimo 6 caracteres.' });
            return;
        }
        try {
            await UsuarioService.redefinirSenha(selecionado.usu_id, novaSenha);
            setModalSenha(false);
            setNovaSenha('');
            setErros({});
        } catch (error) {
            setErros({ novaSenha: error.message || 'Erro ao redefinir senha.' });
        }
    };

    const handleExcluir = async () => {
        try {
            await UsuarioService.excluir(selecionado.usu_id);
            setModalExcluir(false);
            carregarUsuarios();
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: error.message || 'Erro ao excluir usuário.' });
            setModalExcluir(false);
        }
    };

    const abrirEditar = (u) => {
        setFormEditar({ usu_id: u.usu_id, usu_nome: u.usu_nome, usu_email: u.usu_email, usu_nivel: u.usu_nivel });
        setErros({});
        setModalEditar(true);
    };

    const abrirSenha = (u) => { setSelecionado(u); setNovaSenha(''); setErros({}); setModalSenha(true); };
    const abrirExcluir = (u) => { setSelecionado(u); setModalExcluir(true); };

    return (
        <Container fluid className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Usuários</h2>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {carregando ? 'Carregando...' : <><Badge bg="primary" className="me-1">{usuarios.length}</Badge> cadastrados</>}
                    </span>
                </div>
                <Button variant="primary" onClick={() => { setFormCadastrar({ usu_nome: '', usu_email: '', usu_senha: '', usu_nivel: 'usuario' }); setErros({}); setMensagem({ tipo: '', texto: '' }); setModalCadastrar(true); }} className="d-flex align-items-center gap-2">
                    <BsPersonPlusFill /> Novo Usuário
                </Button>
            </div>

            {mensagem.texto && <Alert variant={mensagem.tipo} dismissible onClose={() => setMensagem({ tipo: '', texto: '' })}>{mensagem.texto}</Alert>}

            <div className="bg-white rounded-3 shadow-sm" style={{ border: '1px solid #e9ecef', overflow: 'hidden' }}>
                {carregando ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                        Carregando usuários...
                    </div>
                ) : (
                    <Table responsive hover className="mb-0">
                        <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Nível</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.length === 0 ? (
                                <tr><td colSpan="4"><Alert variant="info" className="m-0">Nenhum usuário encontrado.</Alert></td></tr>
                            ) : usuarios.map(u => (
                                <tr key={u.usu_id}>
                                    <td className="fw-semibold">{u.usu_nome}</td>
                                    <td>{u.usu_email}</td>
                                    <td>
                                        <Badge bg={u.usu_nivel === 'admin' ? 'danger' : 'secondary'}>
                                            {u.usu_nivel}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button size="sm" variant="warning" className="me-1" onClick={() => abrirEditar(u)} title="Editar"><BsPencilSquare /></Button>
                                        <Button size="sm" variant="info" className="me-1 text-white" onClick={() => abrirSenha(u)} title="Redefinir senha"><BsKeyFill /></Button>
                                        <Button size="sm" variant="danger" onClick={() => abrirExcluir(u)} title="Excluir"><BsTrash /></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Modal Cadastrar */}
            <Modal show={modalCadastrar} onHide={() => setModalCadastrar(false)} centered>
                <Form onSubmit={handleCadastrar} noValidate>
                    <Modal.Header closeButton><Modal.Title>NOVO USUÁRIO</Modal.Title></Modal.Header>
                    <Modal.Body>
                        {mensagem.texto && <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>}
                        <Row>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Nome *</Form.Label>
                                    <Form.Control placeholder="Nome completo" value={formCadastrar.usu_nome}
                                        onChange={e => setFormCadastrar(p => ({ ...p, usu_nome: e.target.value }))}
                                        isInvalid={!!erros.usu_nome} />
                                    <Form.Control.Feedback type="invalid">{erros.usu_nome}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>E-mail *</Form.Label>
                                    <Form.Control type="email" placeholder="email@exemplo.com" value={formCadastrar.usu_email}
                                        onChange={e => setFormCadastrar(p => ({ ...p, usu_email: e.target.value }))}
                                        isInvalid={!!erros.usu_email} />
                                    <Form.Control.Feedback type="invalid">{erros.usu_email}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Senha *</Form.Label>
                                    <Form.Control type="password" placeholder="Mínimo 6 caracteres" value={formCadastrar.usu_senha}
                                        onChange={e => setFormCadastrar(p => ({ ...p, usu_senha: e.target.value }))}
                                        isInvalid={!!erros.usu_senha} />
                                    <Form.Control.Feedback type="invalid">{erros.usu_senha}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Nível *</Form.Label>
                                    <Form.Select value={formCadastrar.usu_nivel}
                                        onChange={e => setFormCadastrar(p => ({ ...p, usu_nivel: e.target.value }))}>
                                        {NIVEIS.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalCadastrar(false)}>FECHAR</Button>
                        <Button type="submit" variant="success">CADASTRAR</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal Editar */}
            <Modal show={modalEditar} onHide={() => setModalEditar(false)} centered>
                <Form onSubmit={handleEditar} noValidate>
                    <Modal.Header closeButton><Modal.Title>EDITAR USUÁRIO</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Nome *</Form.Label>
                                    <Form.Control placeholder="Nome completo" value={formEditar.usu_nome}
                                        onChange={e => setFormEditar(p => ({ ...p, usu_nome: e.target.value }))}
                                        isInvalid={!!erros.usu_nome} />
                                    <Form.Control.Feedback type="invalid">{erros.usu_nome}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>E-mail *</Form.Label>
                                    <Form.Control type="email" placeholder="email@exemplo.com" value={formEditar.usu_email}
                                        onChange={e => setFormEditar(p => ({ ...p, usu_email: e.target.value }))}
                                        isInvalid={!!erros.usu_email} />
                                    <Form.Control.Feedback type="invalid">{erros.usu_email}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label>Nível *</Form.Label>
                                    <Form.Select value={formEditar.usu_nivel}
                                        onChange={e => setFormEditar(p => ({ ...p, usu_nivel: e.target.value }))}>
                                        {NIVEIS.map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalEditar(false)}>CANCELAR</Button>
                        <Button type="submit" variant="success">SALVAR</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal Redefinir Senha */}
            <Modal show={modalSenha} onHide={() => setModalSenha(false)} centered>
                <Form onSubmit={handleRedefinirSenha} noValidate>
                    <Modal.Header closeButton>
                        <Modal.Title>Redefinir Senha — {selecionado?.usu_nome}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Nova Senha *</Form.Label>
                            <Form.Control type="password" placeholder="Mínimo 6 caracteres"
                                value={novaSenha} onChange={e => setNovaSenha(e.target.value)}
                                isInvalid={!!erros.novaSenha} />
                            <Form.Control.Feedback type="invalid">{erros.novaSenha}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setModalSenha(false)}>CANCELAR</Button>
                        <Button type="submit" variant="warning">REDEFINIR</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal Excluir */}
            <Modal show={modalExcluir} onHide={() => setModalExcluir(false)} centered>
                <Modal.Header closeButton><Modal.Title>⚠️ Confirmar Exclusão</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p>Tem certeza que deseja excluir o usuário:<br />
                        Nome: <strong>{selecionado?.usu_nome}</strong><br />
                        E-mail: <strong>{selecionado?.usu_email}</strong>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalExcluir(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleExcluir}>Confirmar Exclusão</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default TelaUsuarios;