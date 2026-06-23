import { Button, Form, InputGroup, Container, Badge } from "react-bootstrap";
import { BsSearch, BsXCircle, BsPersonBadgeFill, BsFileEarmarkPdfFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import Dados from './Dados.jsx';
import ModalCadastrar from './ModalCadastrar.jsx';
import MedicoService from '../../services/MedicoService.js';
import { gerarRelatorioPDF } from '../../utils/RelatorioUtils.js';

function TelaMedicos() {
    const [modalShow, setModalShow] = useState(false);
    const [medicos, setMedicos] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => { carregarMedicos(); }, []);

    const carregarMedicos = async () => {
        setCarregando(true);
        try {
            const dados = await MedicoService.listarTodos();
            setMedicos(dados);
        } catch (error) {
            console.error('Erro ao carregar médicos:', error);
        } finally {
            setCarregando(false);
        }
    };

    const handleBuscar = async () => {
        setCarregando(true);
        try {
            const dados = filtro ? await MedicoService.filtrar(filtro) : await MedicoService.listarTodos();
            setMedicos(dados);
        } catch { setMedicos([]); }
        finally { setCarregando(false); }
    };

    const handleExcluir = async (id) => {
        try {
            await MedicoService.excluir(id);
            await carregarMedicos();
        } catch { alert("Erro ao excluir."); }
    };

    return (
        <Container fluid className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Médicos</h2>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {carregando ? 'Carregando...' : <><Badge bg="primary" className="me-1">{medicos.length}</Badge> cadastrados</>}
                    </span>
                </div>
                <div className="d-flex gap-2">
                    <Button variant="outline-danger" onClick={() => gerarRelatorioPDF('medicos', { termo: filtro })} className="d-flex align-items-center gap-2">
                        <BsFileEarmarkPdfFill /> PDF
                    </Button>
                    <Button variant="primary" onClick={() => setModalShow(true)} className="d-flex align-items-center gap-2" style={{ borderRadius: '8px', padding: '10px 20px' }}>
                        <BsPersonBadgeFill /> Novo Médico
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3 mb-4" style={{ border: '1px solid #e9ecef' }}>
                <InputGroup>
                    <InputGroup.Text style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRight: 'none' }}>
                        <BsSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar por nome, CRM ou especialidade..."
                        value={filtro}
                        onChange={e => setFiltro(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                        style={{ border: '1px solid #dee2e6', borderLeft: 'none', borderRight: 'none' }}
                    />
                    {filtro && <Button variant="outline-secondary" onClick={() => { setFiltro(''); carregarMedicos(); }}><BsXCircle /></Button>}
                    <Button variant="primary" onClick={handleBuscar} style={{ borderRadius: '0 6px 6px 0' }}>Buscar</Button>
                </InputGroup>
            </div>

            <div className="bg-white rounded-3 shadow-sm" style={{ border: '1px solid #e9ecef', overflow: 'hidden' }}>
                {carregando ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                        Carregando médicos...
                    </div>
                ) : (
                    <Dados medicos={medicos} ExcluirMedico={handleExcluir} Cadastro={carregarMedicos} />
                )}
            </div>

            <ModalCadastrar show={modalShow} onHide={() => setModalShow(false)} Cadastro={() => { setModalShow(false); carregarMedicos(); }} />
        </Container>
    );
}

export default TelaMedicos;