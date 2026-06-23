import { useState, useEffect } from "react";
import { Modal, Button, Row, Form, Col, Alert, Spinner } from "react-bootstrap";
import ConsultaService from "../../services/ConsultaService.js";
import MedicoService from "../../services/MedicoService.js";

const STATUS_OPTIONS = ['agendada', 'realizada', 'cancelada'];

function ModalEditar({ show, onHide, editandoConsulta, Cadastro }) {
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [erros, setErros] = useState({});
    const [medicos, setMedicos] = useState([]);
    const [paciente, setPaciente] = useState(null);
    const [cpfBusca, setCpfBusca] = useState('');
    const [buscando, setBuscando] = useState(false);

    const [form, setForm] = useState({
        con_id: '', con_paciente_id: '', con_medico_id: '',
        con_data: '', con_hora: '', con_tipo: '', con_status: 'agendada', con_observacoes: ''
    });

    useEffect(() => {
        if (show) MedicoService.listarTodos().then(setMedicos).catch(() => setMedicos([]));
    }, [show]);

    useEffect(() => {
        if (editandoConsulta) {
            setForm({
                con_id: editandoConsulta.con_id,
                con_paciente_id: editandoConsulta.pa_id || '',
                con_medico_id: editandoConsulta.med_id || '',
                con_data: editandoConsulta.con_data ? editandoConsulta.con_data.split('T')[0] : '',
                con_hora: editandoConsulta.con_hora ? editandoConsulta.con_hora.slice(0, 5) : '',
                con_tipo: editandoConsulta.con_tipo || '',
                con_status: editandoConsulta.con_status || 'agendada',
                con_observacoes: editandoConsulta.con_observacoes || ''
            });
            setPaciente({ pa_nome: editandoConsulta.pa_nome, pa_cpf: editandoConsulta.pa_cpf });
            setCpfBusca(editandoConsulta.pa_cpf || '');
            setErros({});
            setMensagem({ tipo: '', texto: '' });
        }
    }, [editandoConsulta]);

    const handleBuscarPaciente = async () => {
        if (!cpfBusca) return;
        setBuscando(true);
        setPaciente(null);
        try {
            const p = await ConsultaService.buscarPacientePorCPF(cpfBusca);
            setPaciente(p);
            setForm(prev => ({ ...prev, con_paciente_id: p.pa_id }));
        } catch {
            setErros(prev => ({ ...prev, con_paciente_id: 'Paciente não encontrado.' }));
        } finally { setBuscando(false); }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (erros[name]) setErros(prev => ({ ...prev, [name]: null }));
    };

    const validar = () => {
        const novosErros = {};
        if (!form.con_paciente_id) novosErros.con_paciente_id = 'Busque e selecione um paciente.';
        if (!form.con_medico_id) novosErros.con_medico_id = 'Selecione o médico.';
        if (!form.con_data) novosErros.con_data = 'Informe a data.';
        if (!form.con_hora) novosErros.con_hora = 'Informe o horário.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });
        if (!validar()) return;
        try {
            await ConsultaService.salvar(form);
            setMensagem({ tipo: 'success', texto: 'Consulta atualizada com sucesso!' });
            setTimeout(() => { if (Cadastro) Cadastro(); }, 1500);
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: error.response?.data?.error || 'Erro ao atualizar consulta.' });
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
                    <Modal.Title>EDITAR CONSULTA</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {mensagem.texto && <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>}

                    <div className="p-3 mb-3 rounded" style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}>
                        <Form.Label className="fw-bold">Paciente</Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control placeholder="CPF do paciente" value={cpfBusca} onChange={e => setCpfBusca(e.target.value)} isInvalid={!!erros.con_paciente_id} />
                            <Button variant="primary" onClick={handleBuscarPaciente} disabled={buscando} style={{ whiteSpace: 'nowrap' }}>
                                {buscando ? <Spinner size="sm" /> : 'Buscar'}
                            </Button>
                        </div>
                        {erros.con_paciente_id && <div className="text-danger small mt-1">{erros.con_paciente_id}</div>}
                        {paciente && (
                            <div className="mt-2 p-2 rounded" style={{ background: '#d4edda', border: '1px solid #c3e6cb' }}>
                                <strong>{paciente.pa_nome}</strong> — CPF: {paciente.pa_cpf}
                            </div>
                        )}
                    </div>

                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Médico *</Form.Label>
                                <Form.Select name="con_medico_id" value={form.con_medico_id} onChange={handleChange} isInvalid={!!erros.con_medico_id}>
                                    <option value="">Selecione o médico...</option>
                                    {medicos.map(m => <option key={m.med_id} value={m.med_id}>{m.med_nome} — {m.med_especialidade}</option>)}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{erros.con_medico_id}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Form.Group>
                                <Form.Label>Data *</Form.Label>
                                <Form.Control type="date" name="con_data" value={form.con_data} onChange={handleChange} isInvalid={!!erros.con_data} />
                                <Form.Control.Feedback type="invalid">{erros.con_data}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Form.Group>
                                <Form.Label>Horário *</Form.Label>
                                <Form.Control type="time" name="con_hora" value={form.con_hora} onChange={handleChange} isInvalid={!!erros.con_hora} />
                                <Form.Control.Feedback type="invalid">{erros.con_hora}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Tipo</Form.Label>
                                <Form.Control placeholder="Ex: Retorno, Primeira consulta..." name="con_tipo" value={form.con_tipo} onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Status</Form.Label>
                                <Form.Select name="con_status" value={form.con_status} onChange={handleChange}>
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={12} className="mb-3">
                            <Form.Group>
                                <Form.Label>Observações</Form.Label>
                                <Form.Control as="textarea" rows={2} name="con_observacoes" value={form.con_observacoes} onChange={handleChange} />
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