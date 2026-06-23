import { Table, Modal, Button, Alert, Badge } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useState } from "react";
import ModalEditar from "./ModalEditar.jsx";

const STATUS_BADGE = {
    agendada: 'primary',
    realizada: 'success',
    cancelada: 'danger'
};

function Dados({ consultas, ExcluirConsulta, Cadastro }) {
    const [modalShow, setShowModal] = useState(false);
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [consultaExcluir, setConsultaExcluir] = useState(null);
    const [editandoConsulta, setEditandoConsulta] = useState(null);

    const confirmarExclusao = (consulta) => {
        setConsultaExcluir(consulta);
        setShowModal(true);
    };

    const excluirConsulta = async () => {
        if (!consultaExcluir) return;
        try {
            await ExcluirConsulta(consultaExcluir.con_id);
        } catch { alert("Não foi possível excluir a consulta."); }
        finally {
            setShowModal(false);
            setConsultaExcluir(null);
        }
    };

    const formatarData = (data) => {
        if (!data) return '—';
        return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    const formatarHora = (hora) => hora ? hora.slice(0, 5) : '—';

    const renderCorpoTabela = () => {
        if (!consultas || consultas.length === 0) {
            return (
                <tr>
                    <td colSpan="6">
                        <Alert variant="info" className="m-0">Nenhuma consulta encontrada.</Alert>
                    </td>
                </tr>
            );
        }

        return consultas.map(c => (
            <tr key={c.con_id}>
                <td className="fw-semibold">{c.pa_nome}</td>
                <td>{c.med_nome}<br /><small className="text-muted">{c.med_especialidade}</small></td>
                <td>{formatarData(c.con_data)} {formatarHora(c.con_hora)}</td>
                <td>{c.con_tipo || '—'}</td>
                <td><Badge bg={STATUS_BADGE[c.con_status] || 'secondary'}>{c.con_status}</Badge></td>
                <td style={{ width: '120px' }}>
                    <Button size="sm" variant="warning" className="me-1" onClick={() => { setEditandoConsulta(c); setModalShowEditar(true); }}>
                        <BsPencilSquare />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => confirmarExclusao(c)}>
                        <BsTrash />
                    </Button>
                </td>
            </tr>
        ));
    };

    return (
        <>
            <Table responsive="lg" hover className="mb-0">
                <thead style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                    <tr>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Paciente</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Médico</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Data / Hora</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Tipo</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Status</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>{renderCorpoTabela()}</tbody>
            </Table>

            <Modal show={modalShow} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>⚠️ Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {consultaExcluir && (
                        <p>
                            Tem certeza que deseja excluir a consulta:<br />
                            Paciente: <strong>{consultaExcluir.pa_nome}</strong><br />
                            Médico: <strong>{consultaExcluir.med_nome}</strong><br />
                            Data: <strong>{formatarData(consultaExcluir.con_data)} às {formatarHora(consultaExcluir.con_hora)}</strong>
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={excluirConsulta}>Confirmar Exclusão</Button>
                </Modal.Footer>
            </Modal>

            <ModalEditar
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)}
                editandoConsulta={editandoConsulta}
                Cadastro={() => { setModalShowEditar(false); Cadastro(); }}
            />
        </>
    );
}

export default Dados;