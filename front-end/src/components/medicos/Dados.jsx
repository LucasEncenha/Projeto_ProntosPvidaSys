import { Table, Modal, Button, Alert } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useState } from "react";
import ModalEditar from "./ModalEditar.jsx";

function Dados({ medicos, ExcluirMedico, Cadastro }) {
    const [modalShow, setShowModal] = useState(false);
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [medicoExcluir, setMedicoExcluir] = useState(null);
    const [editandoMedico, setEditandoMedico] = useState(null);

    const confirmarExclusao = (medico) => {
        setMedicoExcluir(medico);
        setShowModal(true);
    };

    const excluirMedico = async () => {
        if (!medicoExcluir) return;
        try {
            await ExcluirMedico(medicoExcluir.med_id);
        } catch (error) {
            alert("Não foi possível excluir o médico.");
        } finally {
            setShowModal(false);
            setMedicoExcluir(null);
        }
    };

    const renderCorpoTabela = () => {
        if (!medicos || medicos.length === 0) {
            return (
                <tr>
                    <td colSpan="4">
                        <Alert variant="info" className="m-0">Nenhum médico encontrado. Cadastre um novo.</Alert>
                    </td>
                </tr>
            );
        }

        return medicos.map(medico => (
            <tr key={medico.med_id}>
                <td className="fw-semibold">{medico.med_nome}</td>
                <td>{medico.med_crm}</td>
                <td>{medico.med_especialidade}</td>
                <td style={{ width: '120px' }}>
                    <Button size="sm" variant="warning" className="me-1" onClick={() => { setEditandoMedico(medico); setModalShowEditar(true); }}>
                        <BsPencilSquare />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => confirmarExclusao(medico)}>
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
                        <th style={{ fontWeight: 600, color: '#495057' }}>Nome</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>CRM</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Especialidade</th>
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
                    {medicoExcluir && (
                        <p>
                            Tem certeza que deseja excluir o médico:<br />
                            Nome: <strong>{medicoExcluir.med_nome}</strong><br />
                            CRM: <strong>{medicoExcluir.med_crm}</strong><br />
                            Especialidade: <strong>{medicoExcluir.med_especialidade}</strong>
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={excluirMedico}>Confirmar Exclusão</Button>
                </Modal.Footer>
            </Modal>

            <ModalEditar
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)}
                editandoMedico={editandoMedico}
                Cadastro={() => { setModalShowEditar(false); Cadastro(); }}
            />
        </>
    );
}

export default Dados;