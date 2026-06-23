import { useState } from "react";
import { IMaskInput } from "react-imask";
import DoadorService from "../../services/DoadorService.js";
import { Modal, Button, Row, Form, Col, Alert } from "react-bootstrap";

function ModalCadastrar({ show, onHide, Cadastro }) {
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

    const [formDoador, setFormDoador] = useState({
        do_nome: '',
        do_email: '',
        do_telefone: '',
        do_endereco: ''
    });

    const [erros, setErros] = useState({});

    const validarFormulario = () => {
        const novosErros = {};
        if (!formDoador.do_nome) novosErros.do_nome = 'O nome do doador é obrigatório.';
        if (!formDoador.do_telefone) novosErros.do_telefone = 'O telefone do doador é obrigatório.';
        if (!formDoador.do_endereco) novosErros.do_endereco = 'O endereço do doador é obrigatório.';
        if (!formDoador.do_email) novosErros.do_email = 'O e-mail do doador é obrigatório.';
        
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDoador(prevState => ({ ...prevState, [name]: value }));
        if (erros[name]) {
            setErros(prevErros => ({ ...prevErros, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });
        if (!validarFormulario()) {
            setMensagem({ tipo: 'danger', texto: 'Há campos que não foram preenchidos.' });
            return;
        }
        try {
            await DoadorService.salvar(formDoador);
            setFormDoador({ do_nome: '', do_email: '', do_telefone: '', do_endereco: '' });
            setErros({});
            setMensagem({ tipo: 'success', texto: 'Doador cadastrado com sucesso!' });
            if (Cadastro) Cadastro();
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: 'Erro ao salvar doador. Tente novamente.' });
        }
    };

    const handleClose = () => {
        setMensagem({ tipo: '', texto: '' });
        setErros({});
        setFormDoador({ do_nome: '', do_email: '', do_telefone: '', do_endereco: '' });
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Header closeButton>
                    <Modal.Title>CADASTRO DE DOADORES</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {mensagem.texto && (
                        <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>
                    )}

                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Nome do doador *</Form.Label>
                                <Form.Control
                                    placeholder="Digite aqui..."
                                    name="do_nome"
                                    value={formDoador.do_nome}
                                    onChange={handleChange}
                                    isInvalid={!!erros.do_nome}
                                />
                                <Form.Control.Feedback type="invalid">{erros.do_nome}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>E-mail *</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="email@exemplo.com"
                                    name="do_email"
                                    value={formDoador.do_email}
                                    onChange={handleChange}
                                    isInvalid={!!erros.do_email}
                                />
                                <Form.Control.Feedback type="invalid">{erros.do_email}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Endereço *</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Digite o endereço..."
                                    name="do_endereco"
                                    value={formDoador.do_endereco}
                                    onChange={handleChange}
                                    isInvalid={!!erros.do_endereco}
                                />
                                <Form.Control.Feedback type="invalid">{erros.do_endereco}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Telefone *</Form.Label>
                                <Form.Control
                                    as={IMaskInput}
                                    mask={[
                                        { mask: '(00) 0000-0000' },
                                        { mask: '(00) 00000-0000' }
                                    ]}
                                    placeholder="(00) 00000-0000"
                                    name="do_telefone"
                                    value={formDoador.do_telefone}
                                    onChange={handleChange}
                                    isInvalid={!!erros.do_telefone}
                                />
                                <Form.Control.Feedback type="invalid">{erros.do_telefone}</Form.Control.Feedback>
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