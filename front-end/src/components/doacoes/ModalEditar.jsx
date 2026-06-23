import { useState, useEffect } from "react";
import { Modal, Button, Row, Form, Col, Alert } from "react-bootstrap";
import DoacaoService from "../../services/DoacaoService.js";
import DoadorService from "../../services/DoadorService.js";

function ModalEditar({ show, onHide, editandoDoacao, Cadastro }) {
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [erros, setErros] = useState({});
    const [doadores, setDoadores] = useState([]);

    const [formDoacao, setFormDoacao] = useState({
        doa_id: '',
        doa_doador_id: '',
        doa_valor: '',
        doa_data: '',
        doa_observacao: ''
    });

    useEffect(() => {
        if (show) {
            DoadorService.listarTodos().then(setDoadores).catch(() => setDoadores([]));
        }
    }, [show]);

    useEffect(() => {
        if (editandoDoacao) {
            setFormDoacao({
                doa_id: editandoDoacao.doa_id,
                doa_doador_id: editandoDoacao.do_id || '',
                doa_valor: editandoDoacao.doa_valor || '',
                doa_data: editandoDoacao.doa_data
                    ? editandoDoacao.doa_data.split('T')[0]
                    : '',
                doa_observacao: editandoDoacao.doa_observacao || ''
            });
            setErros({});
            setMensagem({ tipo: '', texto: '' });
        }
    }, [editandoDoacao]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormDoacao(prev => ({ ...prev, [name]: value }));
        if (erros[name]) setErros(prev => ({ ...prev, [name]: null }));
    };

    const validarFormulario = () => {
        const novosErros = {};
        if (!formDoacao.doa_doador_id) novosErros.doa_doador_id = 'Selecione o doador.';
        if (!formDoacao.doa_valor || formDoacao.doa_valor <= 0) novosErros.doa_valor = 'Informe um valor válido.';
        if (!formDoacao.doa_data) novosErros.doa_data = 'Informe a data da doação.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });

        if (!validarFormulario()) {
            setMensagem({ tipo: 'danger', texto: 'Preencha todos os campos obrigatórios.' });
            return;
        }

        try {
            await DoacaoService.salvar(formDoacao);
            setErros({});
            setMensagem({ tipo: 'success', texto: 'Doação atualizada com sucesso!' });
            setTimeout(() => {
                if (Cadastro) Cadastro();
            }, 1500);
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: 'Erro ao atualizar doação. Tente novamente.' });
        }
    };

    const handleClose = () => {
        setMensagem({ tipo: '', texto: '' });
        setErros({});
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Header closeButton>
                    <Modal.Title>EDITAR DOAÇÃO</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {mensagem.texto && (
                        <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>
                    )}

                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Doador *</Form.Label>
                                <Form.Select
                                    name="doa_doador_id"
                                    value={formDoacao.doa_doador_id}
                                    onChange={handleChange}
                                    isInvalid={!!erros.doa_doador_id}
                                >
                                    <option value="">Selecione o doador...</option>
                                    {doadores.map(d => (
                                        <option key={d.do_id} value={d.do_id}>
                                            {d.do_nome}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{erros.doa_doador_id}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Valor (R$) *</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0,00"
                                    name="doa_valor"
                                    value={formDoacao.doa_valor}
                                    onChange={handleChange}
                                    isInvalid={!!erros.doa_valor}
                                />
                                <Form.Control.Feedback type="invalid">{erros.doa_valor}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Data da Doação *</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="doa_data"
                                    value={formDoacao.doa_data}
                                    onChange={handleChange}
                                    isInvalid={!!erros.doa_data}
                                />
                                <Form.Control.Feedback type="invalid">{erros.doa_data}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={12} className="mb-3">
                            <Form.Group>
                                <Form.Label>Observação</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder="Informações adicionais sobre a doação..."
                                    name="doa_observacao"
                                    value={formDoacao.doa_observacao}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>FECHAR</Button>
                    <Button type="submit" variant="success">SALVAR ALTERAÇÕES</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalEditar;