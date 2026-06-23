import { useState, useEffect } from "react";
import { Modal, Button, Row, Form, Col, Alert } from "react-bootstrap";
import MedicoService from "../../services/MedicoService.js";

function ModalEditar({ show, onHide, editandoMedico, Cadastro }) {
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [erros, setErros] = useState({});
    const [form, setForm] = useState({ med_id: '', med_nome: '', med_crm: '', med_especialidade: '' });

    useEffect(() => {
        if (editandoMedico) {
            setForm({
                med_id: editandoMedico.med_id,
                med_nome: editandoMedico.med_nome || '',
                med_crm: editandoMedico.med_crm || '',
                med_especialidade: editandoMedico.med_especialidade || ''
            });
            setErros({});
            setMensagem({ tipo: '', texto: '' });
        }
    }, [editandoMedico]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (erros[name]) setErros(prev => ({ ...prev, [name]: null }));
    };

    const validar = () => {
        const novosErros = {};
        if (!form.med_nome) novosErros.med_nome = 'O nome é obrigatório.';
        if (!form.med_crm) novosErros.med_crm = 'O CRM é obrigatório.';
        if (!form.med_especialidade) novosErros.med_especialidade = 'A especialidade é obrigatória.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });
        if (!validar()) return;
        try {
            await MedicoService.salvar(form);
            setMensagem({ tipo: 'success', texto: 'Médico atualizado com sucesso!' });
            setTimeout(() => { if (Cadastro) Cadastro(); }, 1500);
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: error.response?.data?.error || 'Erro ao atualizar médico.' });
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
                    <Modal.Title>EDITAR MÉDICO</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {mensagem.texto && <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>}
                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Nome *</Form.Label>
                                <Form.Control placeholder="Nome completo" name="med_nome" value={form.med_nome} onChange={handleChange} isInvalid={!!erros.med_nome} />
                                <Form.Control.Feedback type="invalid">{erros.med_nome}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>CRM *</Form.Label>
                                <Form.Control placeholder="Ex: CRM/SP 123456" name="med_crm" value={form.med_crm} onChange={handleChange} isInvalid={!!erros.med_crm} />
                                <Form.Control.Feedback type="invalid">{erros.med_crm}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={12} className="mb-3">
                            <Form.Group>
                                <Form.Label>Especialidade *</Form.Label>
                                <Form.Control placeholder="Ex: Oncologia, Clínico Geral..." name="med_especialidade" value={form.med_especialidade} onChange={handleChange} isInvalid={!!erros.med_especialidade} />
                                <Form.Control.Feedback type="invalid">{erros.med_especialidade}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>FECHAR</Button>
                    <Button type="submit" variant="success">SALVAR</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalEditar;