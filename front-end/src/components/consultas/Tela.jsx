import { Button, Form, InputGroup, Container, Badge } from "react-bootstrap";
import { BsSearch, BsXCircle, BsCalendarPlusFill, BsFileEarmarkPdfFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import Dados from './Dados.jsx';
import ModalCadastrar from './ModalCadastrar.jsx';
import ConsultaService from '../../services/ConsultaService.js';
import { gerarRelatorioPDF } from '../../utils/RelatorioUtils.js';
import HelpButton from '../../components/HelpButton.jsx';
import { helpConsultas } from '../../utils/helpTopicos.js';

function TelaConsultas() {
    const [modalShow, setModalShow] = useState(false);
    const [consultas, setConsultas] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => { carregarConsultas(); }, []);

    const carregarConsultas = async () => {
        setCarregando(true);
        try {
            const dados = await ConsultaService.listarTodos();
            setConsultas(dados);
        } catch (error) {
            console.error('Erro ao carregar consultas:', error);
        } finally {
            setCarregando(false);
        }
    };

    const handleBuscar = async () => {
        setCarregando(true);
        try {
            const dados = filtro ? await ConsultaService.filtrar(filtro) : await ConsultaService.listarTodos();
            setConsultas(dados);
        } catch { setConsultas([]); }
        finally { setCarregando(false); }
    };

    const handleLimpar = () => {
        setFiltro('');
        carregarConsultas();
    };

    const handleExcluir = async (id) => {
        try {
            await ConsultaService.excluir(id);
            await carregarConsultas();
        } catch { alert("Erro ao excluir."); }
    };

    const agendadas = consultas.filter(c => c.con_status === 'agendada').length;
    const realizadas = consultas.filter(c => c.con_status === 'realizada').length;
    const canceladas = consultas.filter(c => c.con_status === 'cancelada').length;

    return (
        <Container fluid className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Consultas</h2>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {carregando ? 'Carregando...' : (
                            <>
                                <Badge bg="primary" className="me-1">{agendadas}</Badge> agendadas
                                <Badge bg="success" className="ms-2 me-1">{realizadas}</Badge> realizadas
                                <Badge bg="danger" className="ms-2 me-1">{canceladas}</Badge> canceladas
                            </>
                        )}
                    </span>
                </div>
                <div className="d-flex gap-2">
                    <HelpButton titulo={helpConsultas.titulo} topicos={helpConsultas.topicos} />
                    <Button variant="outline-danger" onClick={() => gerarRelatorioPDF('consultas', { termo: filtro })} className="d-flex align-items-center gap-2">
                        <BsFileEarmarkPdfFill /> PDF
                    </Button>
                    <Button variant="primary" onClick={() => setModalShow(true)} className="d-flex align-items-center gap-2" style={{ borderRadius: '8px', padding: '10px 20px' }}>
                        <BsCalendarPlusFill /> Nova Consulta
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3 mb-4" style={{ border: '1px solid #e9ecef' }}>
                <InputGroup>
                    <InputGroup.Text style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRight: 'none' }}>
                        <BsSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar por paciente, médico, tipo ou status..."
                        value={filtro}
                        onChange={e => setFiltro(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                        style={{ border: '1px solid #dee2e6', borderLeft: 'none', borderRight: 'none' }}
                    />
                    {filtro && <Button variant="outline-secondary" onClick={handleLimpar}><BsXCircle /></Button>}
                    <Button variant="primary" onClick={handleBuscar} style={{ borderRadius: '0 6px 6px 0' }}>Buscar</Button>
                </InputGroup>
            </div>

            <div className="bg-white rounded-3 shadow-sm" style={{ border: '1px solid #e9ecef', overflow: 'hidden' }}>
                {carregando ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                        Carregando consultas...
                    </div>
                ) : (
                    <Dados consultas={consultas} ExcluirConsulta={handleExcluir} Cadastro={carregarConsultas} />
                )}
            </div>

            <ModalCadastrar show={modalShow} onHide={() => setModalShow(false)} Cadastro={() => { setModalShow(false); carregarConsultas(); }} />
        </Container>
    );
}

export default TelaConsultas;