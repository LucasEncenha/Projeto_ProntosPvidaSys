import { Button, Form, InputGroup, Container, Badge } from "react-bootstrap";
import { BsSearch, BsPersonPlusFill, BsXCircle } from "react-icons/bs";
import { useState, useEffect } from "react";

import Dados from './Dados.jsx';
import ModalCadastrar from './ModalCadastrar.jsx';
import DoadorService from '../../services/DoadorService.js';

function TelaDoadores() {
    const [modalShow, setModalShow] = useState(false);
    const [doadores, setDoadores] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarDoadores();
    }, []);

    const carregarDoadores = async () => {
        setCarregando(true);
        try {
            const dados = await DoadorService.listarTodos();
            setDoadores(dados);
        } catch (error) {
            console.error('Erro ao carregar:', error);
        } finally {
            setCarregando(false);
        }
    };

    const handleBuscar = async () => {
        setCarregando(true);
        try {
            const dados = filtro ? await DoadorService.filtrar(filtro) : await DoadorService.listarTodos();
            setDoadores(dados);
        } catch (error) {
            setDoadores([]);
        } finally {
            setCarregando(false);
        }
    };

    const handleLimpar = () => {
        setFiltro('');
        carregarDoadores();
    };

    const handleAposCadastro = () => {
        setModalShow(false);
        carregarDoadores();
    };

    const handleExcluir = async (id) => {
        try {
            await DoadorService.excluir(id);
            await carregarDoadores();
        } catch (error) {
            alert("Erro ao excluir.");
        }
    };

    const totalDoado = doadores.reduce((acc, d) => acc + Number(d.do_valor_doado || 0), 0);

    return (
        <Container fluid className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Doadores</h2>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {carregando ? 'Carregando...' : (
                            <>
                                <Badge bg="success" className="me-1">{doadores.length}</Badge> doadores
                            </>
                        )}
                    </span>
                </div>
                <Button
                    variant="success"
                    onClick={() => setModalShow(true)}
                    className="d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', padding: '10px 20px' }}
                >
                    <BsPersonPlusFill />
                    Novo Doador
                </Button>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3 mb-4" style={{ border: '1px solid #e9ecef' }}>
                <InputGroup>
                    <InputGroup.Text style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRight: 'none' }}>
                        <BsSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar por nome, e-mail ou telefone..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                        style={{ border: '1px solid #dee2e6', borderLeft: 'none', borderRight: 'none' }}
                    />
                    {filtro && (
                        <Button variant="outline-secondary" onClick={handleLimpar} title="Limpar busca">
                            <BsXCircle />
                        </Button>
                    )}
                    <Button variant="success" onClick={handleBuscar} style={{ borderRadius: '0 6px 6px 0' }}>
                        Buscar
                    </Button>
                </InputGroup>
            </div>

            <div className="bg-white rounded-3 shadow-sm" style={{ border: '1px solid #e9ecef', overflow: 'hidden' }}>
                {carregando ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                        Carregando doadores...
                    </div>
                ) : (
                    <Dados
                        doadores={doadores}
                        ExcluirDoador={handleExcluir}
                        Cadastro={handleAposCadastro}
                    />
                )}
            </div>

            <ModalCadastrar
                show={modalShow}
                onHide={() => setModalShow(false)}
                Cadastro={handleAposCadastro}
            />
        </Container>
    );
}

export default TelaDoadores;