import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Container, Row, Col, Card } from "react-bootstrap";
import PacienteService from "../services/PacienteService.js";
import ExameService from "../services/ExameService.js";
import ConsultaService from "../services/ConsultaService.js";
import DoacaoService from "../services/DoacaoService.js";

export default function Home() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);

    const [stats, setStats] = useState({
        pacientes: '--',
        consultas: '--',
        exames: '--',
        totalDoacoes: '--',
    });

    useEffect(() => {
        async function carregarStats() {
            const [pacientes, consultas, exames, doacoes] = await Promise.allSettled([
                PacienteService.listarTodos(),
                ConsultaService.listarTodos(),
                ExameService.listarTodos(),
                DoacaoService.listarTodos(),
            ]);

            const doacoesData = doacoes.status === 'fulfilled' ? doacoes.value : [];
            const total = doacoesData.reduce((acc, d) => acc + Number(d.doa_valor || 0), 0);

            setStats({
                pacientes: pacientes.status === 'fulfilled' ? pacientes.value.length : '--',
                consultas: consultas.status === 'fulfilled' ? consultas.value.length : '--',
                exames: exames.status === 'fulfilled' ? exames.value.length : '--',
                totalDoacoes: total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            });
        }
        carregarStats();
    }, []);

    const saudacao = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Bom dia';
        if (h < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    const statCards = [
        { label: 'Pacientes', value: stats.pacientes, color: '#0d6efd', bg: '#e8f0fe' },
        { label: 'Consultas Agendadas', value: stats.consultas, color: '#6f42c1', bg: '#f0ebff' },
        { label: 'Exames', value: stats.exames, color: '#0dcaf0', bg: '#e0f7fa' },
        { label: 'Total Arrecadado', value: stats.totalDoacoes, color: '#20c997', bg: '#e0f5f1' },
    ];

    const atalhos = [
        {
            label: 'Pacientes',
            descricao: 'Cadastrar e gerenciar pacientes',
            path: '/pacientes',
            color: '#0d6efd',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
            ),
        },
        {
            label: 'Consultas',
            descricao: 'Agendar e gerenciar consultas',
            path: '/consultas',
            color: '#6f42c1',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
            ),
        },
        {
            label: 'Exames',
            descricao: 'Gerenciar exames dos pacientes',
            path: '/exames',
            color: '#0dcaf0',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
            ),
        },
        {
            label: 'Doações',
            descricao: 'Registros e histórico de doações',
            path: '/doacoes',
            color: '#fd7e14',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
            ),
        },
        {
            label: 'Resultados de Exames',
            descricao: 'Cadastrar resultados e arquivos',
            path: '/resultados',
            color: '#20c997',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>
                </svg>
            ),
        },
        {
            label: 'Meu Perfil',
            descricao: 'Visualizar e alterar seus dados',
            path: '/perfil',
            color: '#6c757d',
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
            ),
        },
    ];

    return (
        <Container fluid className="py-4 px-4">
            <div className="mb-5">
                <p className="text-muted mb-0 fs-5">{saudacao()},</p>
                <h1 className="fw-bold mb-0">{usuario.nome}.</h1>
                <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
                    Nível: <strong>{usuario.nivel}</strong>
                </p>
            </div>

            <h5 className="text-muted fw-semibold mb-3 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                Resumo Geral
            </h5>
            <Row className="mb-5 g-3">
                {statCards.map(({ label, value, color, bg }) => (
                    <Col md={3} key={label}>
                        <Card className="border-0 shadow-sm h-100" style={{ background: bg }}>
                            <Card.Body className="text-center py-3">
                                <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>{label}</p>
                                <p className="fw-bold mb-0" style={{ fontSize: '1.8rem', color }}>{value}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <h5 className="text-muted fw-semibold mb-3 text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                Acesso Rápido
            </h5>
            <Row className="g-3">
                {atalhos.map(({ label, descricao, path, color, icon }) => (
                    <Col md={4} key={path}>
                        <Card
                            className="h-100 border-0 shadow-sm"
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                transform: hoveredCard === path ? 'translateY(-3px)' : 'translateY(0)',
                                boxShadow: hoveredCard === path ? '0 8px 24px rgba(0,0,0,0.12)' : '',
                                borderLeft: `4px solid ${color}`,
                            }}
                            onClick={() => navigate(path)}
                            onMouseEnter={() => setHoveredCard(path)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <Card.Body className="d-flex align-items-center gap-3 py-3">
                                <div style={{ color, flexShrink: 0 }}>{icon}</div>
                                <div>
                                    <h6 className="mb-0 fw-bold">{label}</h6>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.82rem' }}>{descricao}</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}