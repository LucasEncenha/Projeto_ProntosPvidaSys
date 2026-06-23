import { useState } from "react";
import TipoExameService from "../../services/TipoExameService.js";
import { Modal, Button, Row, Form, Col, Alert } from "react-bootstrap";

function ModalCadastrar({ show, onHide, Cadastro }) {
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [erros, setErros] = useState({});

    const [formTipoExame, setFormTipoExame] = useState({
        te_nome: '',
        te_descricao: '',
        te_status: '1'
    });

    const validarFormulario = () => {
        const novosErros = {};
        if (!formTipoExame.te_nome) novosErros.te_nome = 'O nome do tipo de exame é obrigatório.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormTipoExame(prevState => ({ ...prevState, [name]: value }));
        if (erros[name]) {
            setErros(prevErros => ({ ...prevErros, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });

        if (!validarFormulario()) {
            setMensagem({ tipo: 'danger', texto: 'Preencha todos os campos obrigatórios.' });
            return;
        }

        try {
            await TipoExameService.salvar(formTipoExame);
            setFormTipoExame({ te_nome: '', te_descricao: '', te_status: '1' });
            setErros({});
            setMensagem({ tipo: 'success', texto: 'Tipo de exame cadastrado com sucesso!' });
            if (Cadastro) Cadastro();
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: 'Erro ao salvar tipo de exame. Tente novamente.' });
        }
    };

    const handleClose = () => {
        setMensagem({ tipo: '', texto: '' });
        setErros({});
        setFormTipoExame({ te_nome: '', te_descricao: '', te_status: '1' });
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Header closeButton>
                    <Modal.Title>CADASTRO DE TIPOS DE EXAME</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {mensagem.texto && (
                        <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>
                    )}

                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Nome do Tipo de Exame *</Form.Label>
                                <Form.Control
                                    placeholder="Ex: Hemograma Completo"
                                    name="te_nome"
                                    value={formTipoExame.te_nome}
                                    onChange={handleChange}
                                    isInvalid={!!erros.te_nome}
                                />
                                <Form.Control.Feedback type="invalid">{erros.te_nome}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select
                                    name="te_status"
                                    value={formTipoExame.te_status}
                                    onChange={handleChange}
                                >
                                    <option value="1">Ativo</option>
                                    <option value="0">Inativo</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={12} className="mb-3">
                            <Form.Group>
                                <Form.Label>Descrição</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="Descreva o tipo de exame..."
                                    name="te_descricao"
                                    value={formTipoExame.te_descricao}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>FECHAR</Button>
                    <Button type="submit" variant="success">CADASTRAR</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalCadastrar;