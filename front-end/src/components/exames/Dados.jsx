import { Table, Modal, Button, Alert } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useState } from "react";
import ModalEditar from "./ModalEditar.jsx";

function Dados({ exames, ExcluirExame, Cadastro }) {
    const [modalShow, setShowModal] = useState(false);
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [exameExcluir, setExameExcluir] = useState(null);
    const [editandoExame, setEditandoExame] = useState(null);

    const confirmarExclusao = (exame) => {
        setExameExcluir(exame);
        setShowModal(true);
    };

    const excluirExame = async () => {
        if (!exameExcluir) return;
        try {
            await ExcluirExame(exameExcluir.ex_id);
        } catch (error) {
            console.error("Erro ao excluir exame:", error);
            alert("Não foi possível excluir o exame.");
        } finally {
            setShowModal(false);
            setExameExcluir(null);
        }
    };

    const formatarData = (data) => {
        if (!data) return '-';
        const d = new Date(data);
        d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
        return d.toLocaleDateString('pt-BR');
    };

    const atualizar = (exame) => {
        setEditandoExame(exame);
        setModalShowEditar(true);
    };

    const handleEditarExame = () => {
        setModalShowEditar(false);
        Cadastro();
    };

    const renderCorpoTabela = () => {
        if (!exames || exames.length === 0) {
            return (
                <tr>
                    <td colSpan="6">
                        <Alert variant="info" className="m-0">
                            Nenhum exame encontrado. Tente limpar os filtros ou cadastre um novo.
                        </Alert>
                    </td>
                </tr>
            );
        }

        return exames.map(exame => (
            <tr key={exame.ex_id}>
                <td className="fw-semibold">{exame.pa_nome}</td>
                <td>{exame.pa_cpf}</td>
                <td>{exame.te_nome}</td>
                <td>{formatarData(exame.ex_data)}</td>
                <td>{exame.ex_hora ? exame.ex_hora.slice(0, 5) : '—'}</td>
                <td>
                    <Button variant="warning" size="sm" className="me-1" onClick={() => atualizar(exame)}>
                        <BsPencilSquare />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => confirmarExclusao(exame)}>
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
                        <th style={{ fontWeight: 600, color: '#495057' }}>CPF</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Tipo de Exame</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Data</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Horário</th>
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
                    {exameExcluir && (
                        <p>
                            Tem certeza que deseja excluir o exame:<br />
                            Paciente: <strong>{exameExcluir.pa_nome}</strong><br />
                            Exame: <strong>{exameExcluir.te_nome}</strong><br />
                            Data: <strong>{formatarData(exameExcluir.ex_data)}</strong><br />
                            Horário: <strong>{exameExcluir.ex_hora ? exameExcluir.ex_hora.slice(0, 5) : '—'}</strong>
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={excluirExame}>Confirmar Exclusão</Button>
                </Modal.Footer>
            </Modal>

            <ModalEditar
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)}
                editandoExame={editandoExame}
                Cadastro={handleEditarExame}
            />
        </>
    );
}

export default Dados;