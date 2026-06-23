import { useState } from "react";
import { Modal, Button, Row, Form, Col, Alert, Spinner, Badge } from "react-bootstrap";
import ResultadoExameService from "../../services/ResultadoExameService.js";

function ModalCadastrarResultado({ show, onHide, Cadastro }) {
    const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
    const [erros, setErros] = useState({});
    const [cpfBusca, setCpfBusca] = useState('');
    const [buscando, setBuscando] = useState(false);
    const [examesPendentes, setExamesPendentes] = useState([]);
    const [exameSelecionado, setExameSelecionado] = useState(null);
    const [arquivo, setArquivo] = useState(null);

    const [form, setForm] = useState({
        res_exame_id: '',
        res_resultado: '',
        res_data: ''
    });

    const handleBuscarExames = async () => {
        if (!cpfBusca) return;
        setBuscando(true);
        setExamesPendentes([]);
        setExameSelecionado(null);
        setErros(prev => ({ ...prev, cpf: null }));

        try {
            const exames = await ResultadoExameService.buscarExamesPendentes(cpfBusca.trim());
            if (exames.length === 0) {
                setErros(prev => ({ ...prev, cpf: 'Nenhum exame pendente encontrado para este CPF.' }));
            } else {
                setExamesPendentes(exames);
            }
        } catch {
            setErros(prev => ({ ...prev, cpf: 'Erro ao buscar exames.' }));
        } finally {
            setBuscando(false);
        }
    };

    const handleSelecionarExame = (exame) => {
        setExameSelecionado(exame);
        setForm(prev => ({ ...prev, res_exame_id: exame.ex_id }));
        setErros(prev => ({ ...prev, res_exame_id: null }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (erros[name]) setErros(prev => ({ ...prev, [name]: null }));
    };

    const validar = () => {
        const novosErros = {};
        if (!form.res_exame_id) novosErros.res_exame_id = 'Selecione um exame.';
        if (!form.res_data) novosErros.res_data = 'Informe a data do resultado.';
        if (!form.res_resultado && !arquivo) novosErros.res_resultado = 'Informe o resultado ou anexe um arquivo.';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem({ tipo: '', texto: '' });
        if (!validar()) return;

        const formData = new FormData();
        formData.append('res_exame_id', form.res_exame_id);
        formData.append('res_resultado', form.res_resultado);
        formData.append('res_data', form.res_data);
        if (arquivo) formData.append('arquivo', arquivo);

        try {
            await ResultadoExameService.salvar(formData);
            setMensagem({ tipo: 'success', texto: 'Resultado cadastrado com sucesso!' });
            if (Cadastro) Cadastro();
            handleClose();
        } catch (error) {
            setMensagem({ tipo: 'danger', texto: error.response?.data?.error || 'Erro ao salvar resultado.' });
        }
    };

    const handleClose = () => {
        setMensagem({ tipo: '', texto: '' });
        setErros({});
        setCpfBusca('');
        setExamesPendentes([]);
        setExameSelecionado(null);
        setArquivo(null);
        setForm({ res_exame_id: '', res_resultado: '', res_data: '' });
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Header closeButton>
                    <Modal.Title>CADASTRAR RESULTADO DE EXAME</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {mensagem.texto && <Alert variant={mensagem.tipo}>{mensagem.texto}</Alert>}

                    {/* Busca por CPF */}
                    <div className="p-3 mb-3 rounded" style={{ background: '#f8f9fa', border: '1px solid #dee2e6' }}>
                        <Form.Label className="fw-bold">Buscar Exames Pendentes por CPF</Form.Label>
                        <div className="d-flex gap-2">
                            <Form.Control
                                placeholder="000.000.000-00"
                                value={cpfBusca}
                                onChange={e => setCpfBusca(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleBuscarExames())}
                                isInvalid={!!erros.cpf}
                            />
                            <Button variant="primary" onClick={handleBuscarExames} disabled={buscando} style={{ whiteSpace: 'nowrap' }}>
                                {buscando ? <Spinner size="sm" /> : 'Buscar'}
                            </Button>
                        </div>
                        {erros.cpf && <div className="text-danger small mt-1">{erros.cpf}</div>}

                        {examesPendentes.length > 0 && (
                            <div className="mt-3">
                                <p className="mb-2 fw-bold text-muted" style={{ fontSize: '0.85rem' }}>Selecione o exame:</p>
                                {examesPendentes.map(ex => (
                                    <div
                                        key={ex.ex_id}
                                        className="p-2 mb-1 rounded"
                                        style={{
                                            cursor: 'pointer',
                                            border: `1px solid ${exameSelecionado?.ex_id === ex.ex_id ? '#0d6efd' : '#dee2e6'}`,
                                            background: exameSelecionado?.ex_id === ex.ex_id ? '#e8f0fe' : '#fff'
                                        }}
                                        onClick={() => handleSelecionarExame(ex)}
                                    >
                                        <strong>{ex.te_nome}</strong> — {ex.pa_nome} — Data: {new Date(ex.ex_data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                    </div>
                                ))}
                            </div>
                        )}
                        {erros.res_exame_id && <div className="text-danger small mt-1">{erros.res_exame_id}</div>}
                    </div>

                    <Row>
                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Data do Resultado *</Form.Label>
                                <Form.Control type="date" name="res_data" value={form.res_data} onChange={handleChange} isInvalid={!!erros.res_data} />
                                <Form.Control.Feedback type="invalid">{erros.res_data}</Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={6} className="mb-3">
                            <Form.Group>
                                <Form.Label>Anexar Arquivo (PDF, JPG, PNG — max 10MB)</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={e => setArquivo(e.target.files[0])}
                                />
                                {arquivo && <div className="text-success small mt-1">✓ {arquivo.name}</div>}
                            </Form.Group>
                        </Col>

                        <Col md={12} className="mb-3">
                            <Form.Group>
                                <Form.Label>Resultado (texto)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    name="res_resultado"
                                    value={form.res_resultado}
                                    onChange={handleChange}
                                    placeholder="Descreva o resultado do exame..."
                                    isInvalid={!!erros.res_resultado}
                                />
                                <Form.Control.Feedback type="invalid">{erros.res_resultado}</Form.Control.Feedback>
                                <Form.Text className="text-muted">Preencha o texto, anexe um arquivo ou ambos.</Form.Text>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>FECHAR</Button>
                    <Button type="submit" variant="success">SALVAR RESULTADO</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}

export default ModalCadastrarResultado;