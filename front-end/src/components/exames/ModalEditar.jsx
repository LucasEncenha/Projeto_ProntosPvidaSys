import { useState, useEffect } from "react";
import { Modal, Button, Row, Form, Col, Alert, Spinner } from "react-bootstrap";
import ExameService from "../../services/ExameService.js";
import PacienteService from "../../services/PacienteService.js";
import TipoExameService from "../../services/TipoExameService.js";

function ModalEditar({ show, onHide, editandoExame, Cadastro }) {
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [erros, setErros] = useState({});
    const [pacientes, setPacientes] = useState([]);
    const [tiposExames, setTiposExames] = useState([]);
    const [verificandoDup, setVerificandoDup] = useState(false);
    const [exDuplicado, setExDuplicado] = useState(false);

    const [formExame, setFormExame] = useState({
        ex_id: '',
        ex_paciente_id: '',
        ex_tipo_exame_id: '',
        ex_data: '',
        ex_hora: ''
    });

    useEffect(() => {
        if (show) {
            PacienteService.listarTodos().then(setPacientes).catch(() => setPacientes([]));
            TipoExameService.listarTodos().then(setTiposExames).catch(() => setTiposExames([]));
        }
    }, [show]);

    useEffect(() => {
        if (editandoExame) {
            setFormExame({
                ex_id: editandoExame.ex_id,
                ex_paciente_id: editandoExame.pa_id || '',
                ex_tipo_exame_id: editandoExame.te_id || '',
                ex_data: editandoExame.ex_data ? editandoExame.ex_data.split('T')[0] : '',
                ex_hora: editandoExame.ex_hora ? editandoExame.ex_hora.slice(0, 5) : ''
            });
            setErros({});
            setExDuplicado(false);
            setMensagem({ tipo: '', texto: '' });
        }
    }, [editandoExame]);

    useEffect(() => {
        const verificar = async () => {
            const { ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora, ex_id } = formExame;

            if (!ex_paciente_id || !ex_data || ex_data.length < 10 || !ex_hora || !ex_id) {
                setExDuplicado(false);
                setErros(prev => ({ ...prev, ex_hora: null }));
                return;
            }

            setVerificandoDup(true);
            try {
                const result = await ExameService.verificarDuplicidade(ex_paciente_id, ex_tipo_exame_id, ex_data, ex_hora, ex_id);
                setExDuplicado(result?.duplicado === true);
                if (result?.duplicado === true) {
                    setErros(prev => ({ ...prev, ex_hora: 'Este paciente já possui um exame agendado neste dia e horário.' }));
                } else {
                    setErros(prev => ({ ...prev, ex_hora: null }));
                }
            } catch {
                setExDuplicado(false);
            } finally {
                setVerificandoDup(false);
            }
        };

        const timer = setTimeout(verificar, 400);
        return () => clearTimeout(timer);
    }, [formExame.ex_paciente_id, formExame.ex_data, formExame.ex_hora]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormExame(prev => ({ ...prev, [name]: value }));
        if (erros[name]) setErros(prev => ({ ...prev, [name]: null }));
    };

    const validarFormulario = () => {
        const novosErros = {};
        if (!formExame.ex_paciente_id) novosErros.ex_paciente_id = 'Selecione o paciente.';
        if (!formExame.ex_tipo_exame_id) novosErros.ex_tipo_exame_id = 'Selecione o tipo de exame.';
        if (!formExame.ex_data) novosErros.ex_data = 'Informe a data do exame.';
        if (exDuplicado) novosErros.ex_data = 'Este paciente já possui este exame cadastrado para esta data.';
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
            await ExameService.salvar(formExame);
            setErros({});
            setExDuplicado(false);
            setMensagem({ tipo: 'success', texto: 'Exame atualizado com sucesso!' });
            setTimeout(() => { if (Cadastro) Cadastro(); }, 1500);
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: error.message || 'Erro ao atualizar exame. Tente novamente.' });
        }
    };

    const handleClose = () => {
        setMensagem({ tipo: '', texto: '' });
        setErros({});
        setExDuplicado(false);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Header closeButton>
                    <Modal.Title>EDITAR EXAME</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {mensagem.texto && <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>}

                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Paciente *</Form.Label>
                                <Form.Select name="ex_paciente_id" value={formExame.ex_paciente_id} onChange={handleChange} isInvalid={!!erros.ex_paciente_id}>
                                    <option value="">Selecione o paciente...</option>
                                    {pacientes.map(p => (
                                        <option key={p.pa_id} value={p.pa_id}>{p.pa_nome} — {p.pa_cpf}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{erros.ex_paciente_id}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Tipo de Exame *</Form.Label>
                                <Form.Select name="ex_tipo_exame_id" value={formExame.ex_tipo_exame_id} onChange={handleChange} isInvalid={!!erros.ex_tipo_exame_id}>
                                    <option value="">Selecione o tipo de exame...</option>
                                    {tiposExames.map(t => (
                                        <option key={t.te_id} value={t.te_id}>{t.te_nome}</option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{erros.ex_tipo_exame_id}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>
                                    Data do Exame * {verificandoDup && <Spinner size="sm" className="ms-1" />}
                                </Form.Label>
                                <Form.Control
                                    type="date"
                                    name="ex_data"
                                    value={formExame.ex_data}
                                    onChange={handleChange}
                                    isInvalid={!!erros.ex_data}
                                />
                                <Form.Control.Feedback type="invalid">{erros.ex_data}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Horário</Form.Label>
                                <Form.Control
                                    type="time"
                                    name="ex_hora"
                                    value={formExame.ex_hora}
                                    onChange={handleChange}
                                    isInvalid={!!erros.ex_hora || exDuplicado}
                                />
                                <Form.Control.Feedback type="invalid">{erros.ex_hora}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>FECHAR</Button>
                    <Button type="submit" variant="success" disabled={exDuplicado}>SALVAR ALTERAÇÕES</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalEditar;