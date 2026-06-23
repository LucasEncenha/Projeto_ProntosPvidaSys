import { Button, Form, InputGroup, Container, Badge } from "react-bootstrap";
import { BsSearch, BsXCircle, BsCashStack, BsFileEarmarkPdfFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import Dados from './Dados.jsx';
import ModalCadastrar from './ModalCadastrar.jsx';
import DoacaoService from '../../services/DoacaoService.js';
import { gerarRelatorioPDF } from '../../utils/RelatorioUtils.js';
import HelpButton from '../../components/HelpButton.jsx';
import { helpDoacoes } from '../../utils/helpTopicos.js';

function TelaDoacoes() {
    const [modalShow, setModalShow] = useState(false);
    const [doacoes, setDoacoes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => { carregarDoacoes(); }, []);

    const carregarDoacoes = async () => {
        setCarregando(true);
        try {
            const dados = await DoacaoService.listarTodos();
            setDoacoes(dados);
        } catch (error) {
            console.error('Erro ao carregar doações:', error);
        } finally {
            setCarregando(false);
        }
    };

    const handleBuscar = async () => {
        setCarregando(true);
        try {
            const dados = filtro ? await DoacaoService.filtrar(filtro) : await DoacaoService.listarTodos();
            setDoacoes(dados);
        } catch { setDoacoes([]); }
        finally { setCarregando(false); }
    };

    const handleLimpar = () => {
        setFiltro('');
        carregarDoacoes();
    };

    const handleAposCadastro = () => {
        setModalShow(false);
        carregarDoacoes();
    };

    const handleExcluir = async (id) => {
        try {
            await DoacaoService.excluir(id);
            await carregarDoacoes();
        } catch { alert("Erro ao excluir."); }
    };

    const totalArrecadado = doacoes.reduce((acc, d) => acc + Number(d.doa_valor || 0), 0);

    return (
        <Container fluid className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Doações</h2>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {carregando ? 'Carregando...' : (
                            <>
                                <Badge bg="success" className="me-1">{doacoes.length}</Badge> registros
                                {doacoes.length > 0 && (
                                    <span className="ms-2">
                                        · Total: <strong>{totalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                                    </span>
                                )}
                            </>
                        )}
                    </span>
                </div>
                <div className="d-flex gap-2">
                    <HelpButton titulo={helpDoacoes.titulo} topicos={helpDoacoes.topicos} />
                    <Button variant="outline-danger" onClick={() => gerarRelatorioPDF('doacoes', { termo: filtro })} className="d-flex align-items-center gap-2">
                        <BsFileEarmarkPdfFill /> PDF
                    </Button>
                    <Button variant="success" onClick={() => setModalShow(true)} className="d-flex align-items-center gap-2" style={{ borderRadius: '8px', padding: '10px 20px' }}>
                        <BsCashStack /> Nova Doação
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3 mb-4" style={{ border: '1px solid #e9ecef' }}>
                <InputGroup>
                    <InputGroup.Text style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRight: 'none' }}>
                        <BsSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar por doador, e-mail ou observação..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                        style={{ border: '1px solid #dee2e6', borderLeft: 'none', borderRight: 'none' }}
                    />
                    {filtro && <Button variant="outline-secondary" onClick={handleLimpar}><BsXCircle /></Button>}
                    <Button variant="success" onClick={handleBuscar} style={{ borderRadius: '0 6px 6px 0' }}>Buscar</Button>
                </InputGroup>
            </div>

            <div className="bg-white rounded-3 shadow-sm" style={{ border: '1px solid #e9ecef', overflow: 'hidden' }}>
                {carregando ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                        Carregando doações...
                    </div>
                ) : (
                    <Dados doacoes={doacoes} ExcluirDoacao={handleExcluir} Cadastro={handleAposCadastro} />
                )}
            </div>

            <ModalCadastrar show={modalShow} onHide={() => setModalShow(false)} Cadastro={handleAposCadastro} />
        </Container>
    );
}

export default TelaDoacoes;