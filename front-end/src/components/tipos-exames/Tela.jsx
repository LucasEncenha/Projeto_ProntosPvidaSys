import { Button, Form, InputGroup, Container, Badge, Row, Col } from "react-bootstrap";
import { BsSearch, BsFillPlusCircleFill, BsXCircle } from "react-icons/bs";
import { useState, useEffect } from "react";

import Dados from './Dados.jsx';
import ModalCadastrar from './ModalCadastrar.jsx';
import TipoExameService from '../../services/TipoExameService.js';

function TelaTipoExame() {
    const [modalShow, setModalShow] = useState(false);
    const [tiposExames, setTiposExames] = useState([]);
    const [filtro, setFiltro] = useState({ nome: '' });
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarTipoExame();
    }, []);

    const carregarTipoExame = async () => {
        setCarregando(true);
        try {
            const dados = await TipoExameService.listarTodos();
            setTiposExames(dados);
        } catch (error) {
            console.error('Erro ao carregar tipos de exame:', error);
        } finally {
            setCarregando(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltro(prev => ({ ...prev, [name]: value }));
    };

    const handleBuscar = async () => {
        setCarregando(true);
        try {
            const dados = filtro.nome
                ? await TipoExameService.filtrar(filtro)
                : await TipoExameService.listarTodos();
            setTiposExames(dados);
        } catch (error) {
            console.error('Erro ao buscar tipos de exame:', error);
            setTiposExames([]);
        } finally {
            setCarregando(false);
        }
    };

    const handleLimpar = () => {
        setFiltro({ nome: '' });
        carregarTipoExame();
    };

    const handleExcluir = async (id) => {
        try {
            await TipoExameService.excluir(id);
            await carregarTipoExame();
        } catch (error) {
            alert("Erro ao excluir.");
        }
    };

    return (
        <Container fluid className="py-4 px-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: '#1a1a2e' }}>Tipos de Exame</h2>
                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                        {carregando ? 'Carregando...' : (
                            <><Badge bg="info" text="dark" className="me-1">{tiposExames.length}</Badge> tipos cadastrados</>
                        )}
                    </span>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setModalShow(true)}
                    className="d-flex align-items-center gap-2"
                    style={{ borderRadius: '8px', padding: '10px 20px' }}
                >
                    <BsFillPlusCircleFill />
                    Novo Tipo de Exame
                </Button>
            </div>

            <div className="bg-white rounded-3 shadow-sm p-3 mb-4" style={{ border: '1px solid #e9ecef' }}>
                <Row className="align-items-center g-2">
                    <Col md={9}>
                        <InputGroup>
                            <InputGroup.Text style={{ background: '#f8f9fa', border: '1px solid #dee2e6', borderRight: 'none' }}>
                                <BsSearch className="text-muted" />
                            </InputGroup.Text>
                            <Form.Control
                                name="nome"
                                placeholder="Buscar por nome do exame..."
                                value={filtro.nome}
                                onChange={handleChange}
                                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                                style={{ border: '1px solid #dee2e6', borderLeft: 'none', borderRight: 'none' }}
                            />
                            {filtro.nome && (
                                <Button variant="outline-secondary" onClick={handleLimpar} title="Limpar busca">
                                    <BsXCircle />
                                </Button>
                            )}
                        </InputGroup>
                    </Col>
                    <Col md={3}>
                        <Button variant="primary" onClick={handleBuscar} className="w-100">
                            Buscar
                        </Button>
                    </Col>
                </Row>
            </div>

            <div className="bg-white rounded-3 shadow-sm" style={{ border: '1px solid #e9ecef', overflow: 'hidden' }}>
                {carregando ? (
                    <div className="text-center py-5 text-muted">
                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                        Carregando tipos de exame...
                    </div>
                ) : (
                    <Dados
                        tiposExames={tiposExames}
                        ExcluirTipoExame={handleExcluir}
                        Cadastro={carregarTipoExame}
                    />
                )}
            </div>

            <ModalCadastrar
                show={modalShow}
                onHide={() => setModalShow(false)}
                Cadastro={carregarTipoExame}
            />
        </Container>
    );
}

export default TelaTipoExame;