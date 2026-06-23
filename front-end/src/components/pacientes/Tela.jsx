import { Button, Form, InputGroup, Container, Badge } from "react-bootstrap";
import { BsSearch, BsPersonPlusFill, BsXCircle, BsFileEarmarkPdfFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import DadosPaciente from "./Dados.jsx";
import ModalCadastrarPaciente from "./ModalCadastrar.jsx";
import PacienteService from "../../services/PacienteService.js";
import { gerarRelatorioPDF } from "../../utils/RelatorioUtils.js";
import HelpButton from "../../components/HelpButton.jsx";
import { helpPacientes } from "../../utils/helpTopicos.js";

function TelaPaciente() {
    const [modalShow, setModalShow] = useState(false);
    const [pacientes, setPacientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => { carregarPacientes(); }, []);

    const carregarPacientes = async () => {
        setCarregando(true);
        try {
            const dados = await PacienteService.listarTodos();
            setPacientes(dados);
        } catch (error) {
            console.error('Erro ao carregar:', error);
        } finally {
            setCarregando(false);
        }
    };

    const handleBuscar = async () => {
        setCarregando(true);
        try {
            const dados = filtro ? await PacienteService.filtrar(filtro) : await PacienteService.listarTodos();
            setPacientes(dados);
        } catch { setPacientes([]); }
        finally { setCarregando(false); }
    };

    const handleLimpar = () => {
        setFiltro('');
        carregarPacientes();
    };

    const handleAposCadastro = () => {
        setModalShow(false);
        carregarPacientes();
    };

    const handleExcluir = async (id) => {
        try {
            await PacienteService.excluir(id);
            await carregarPacientes();
        } catch { alert("Erro ao excluir."); }
    };

    return (
        <Container fluid className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Pacientes</h2>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {carregando ? 'Carregando...' : (
                            <><Badge bg="primary" className="me-1">{pacientes.length}</Badge> registros encontrados</>
                        )}
                    </span>
                </div>
                <div className="d-flex gap-2">
                    <HelpButton titulo={helpPacientes.titulo} topicos={helpPacientes.topicos} />
                    <Button variant="outline-danger" onClick={() => gerarRelatorioPDF('pacientes', { termo: filtro })} className="d-flex align-items-center gap-2">
                        <BsFileEarmarkPdfFill /> PDF
                    </Button>
                    <Button variant="primary" onClick={() => setModalShow(true)} className="d-flex align-items-center gap-2" style={{ borderRadius: '8px', padding: '10px 20px' }}>
                        <BsPersonPlusFill /> Novo Paciente
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3 mb-4" style={{ border: '1px solid #e9ecef' }}>
                <InputGroup>
                    <InputGroup.Text style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRight: 'none' }}>
                        <BsSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar por nome, CPF, telefone ou endereço..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
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
                        Carregando pacientes...
                    </div>
                ) : (
                    <DadosPaciente pacientes={pacientes} ExcluirPaciente={handleExcluir} Cadastro={handleAposCadastro} />
                )}
            </div>

            <ModalCadastrarPaciente show={modalShow} onHide={() => setModalShow(false)} Cadastro={handleAposCadastro} />
        </Container>
    );
}

export default TelaPaciente;