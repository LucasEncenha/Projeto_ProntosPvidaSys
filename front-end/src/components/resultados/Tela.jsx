import { Button, Container, Badge, Row, Col, Form } from "react-bootstrap";
import { BsClipboardCheckFill, BsSearch, BsXCircle } from "react-icons/bs";
import { useState, useEffect, useCallback } from "react";
import Dados from './Dados.jsx';
import ModalCadastrar from './ModalCadastrar.jsx';
import ResultadoExameService from '../../services/ResultadoExameService.js';

function TelaResultados() {
    const [modalShow, setModalShow] = useState(false);
    const [resultados, setResultados] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const [filtros, setFiltros] = useState({
        nome: '',
        cpf: '',
        tipoExame: '',
        dataInicio: '',
        dataFim: ''
    });

    const carregarResultados = useCallback(async () => {
        setCarregando(true);
        try {
            const dados = await ResultadoExameService.listarTodos();
            setResultados(dados || []);
        } catch (error) {
            console.error('Erro ao carregar resultados:', error);
            setResultados([]);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        carregarResultados();
    }, [carregarResultados]);

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({ ...prev, [name]: value }));
    };

    const handleBuscar = async () => {
        setCarregando(true);
        try {
            const temFiltro = Object.values(filtros).some(v => v !== '');
            const dados = temFiltro
                ? await ResultadoExameService.filtrar(filtros)
                : await ResultadoExameService.listarTodos();
            setResultados(dados || []);
        } catch (error) {
            console.error('Erro ao filtrar:', error);
            setResultados([]);
        } finally {
            setCarregando(false);
        }
    };

    const handleLimpar = () => {
        setFiltros({ nome: '', cpf: '', tipoExame: '', dataInicio: '', dataFim: '' });
        carregarResultados();
    };

    const temFiltroAtivo = Object.values(filtros).some(v => v !== '');

    return (
        <Container fluid className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Resultados de Exames</h2>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {carregando ? 'Carregando...' : (
                            <><Badge bg="primary" className="me-1">{resultados.length}</Badge> registros</>
                        )}
                    </span>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setModalShow(true)}
                    className="d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', padding: '10px 20px' }}
                >
                    <BsClipboardCheckFill /> Novo Resultado
                </Button>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-3 shadow-sm p-3 mb-4" style={{ border: '1px solid #e9ecef' }}>
                <Row className="g-2 align-items-end">
                    <Col md={3}>
                        <Form.Label className="small text-muted mb-1">Nome do Paciente</Form.Label>
                        <Form.Control
                            size="sm"
                            placeholder="Nome..."
                            name="nome"
                            value={filtros.nome}
                            onChange={handleFiltroChange}
                            onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Label className="small text-muted mb-1">CPF</Form.Label>
                        <Form.Control
                            size="sm"
                            placeholder="000.000.000-00"
                            name="cpf"
                            value={filtros.cpf}
                            onChange={handleFiltroChange}
                            onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                        />
                    </Col>
                    <Col md={3}>
                        <Form.Label className="small text-muted mb-1">Tipo de Exame</Form.Label>
                        <Form.Control
                            size="sm"
                            placeholder="Ex: Hemograma..."
                            name="tipoExame"
                            value={filtros.tipoExame}
                            onChange={handleFiltroChange}
                            onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Label className="small text-muted mb-1">Data Início</Form.Label>
                        <Form.Control
                            size="sm"
                            type="date"
                            name="dataInicio"
                            value={filtros.dataInicio}
                            onChange={handleFiltroChange}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Label className="small text-muted mb-1">Data Fim</Form.Label>
                        <Form.Control
                            size="sm"
                            type="date"
                            name="dataFim"
                            value={filtros.dataFim}
                            onChange={handleFiltroChange}
                        />
                    </Col>
                    <Col md={12} className="d-flex gap-2 mt-1">
                        <Button variant="primary" size="sm" onClick={handleBuscar} className="d-flex align-items-center gap-1">
                            <BsSearch /> Buscar
                        </Button>
                        {temFiltroAtivo && (
                            <Button variant="outline-secondary" size="sm" onClick={handleLimpar} className="d-flex align-items-center gap-1">
                                <BsXCircle /> Limpar Filtros
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>

            <div className="bg-white rounded-3 shadow-sm" style={{ border: '1px solid #e9ecef', overflow: 'hidden' }}>
                {carregando ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                        Carregando resultados...
                    </div>
                ) : (
                    <Dados resultados={resultados} Cadastro={carregarResultados} />
                )}
            </div>

            <ModalCadastrar
                show={modalShow}
                onHide={() => setModalShow(false)}
                Cadastro={() => { setModalShow(false); carregarResultados(); }}
            />
        </Container>
    );
}

export default TelaResultados;