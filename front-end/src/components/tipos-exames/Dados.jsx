import { Table, Modal, Button, Alert, Badge } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useState } from "react";
import ModalEditar from "./ModalEditar.jsx";

function Dados({ tiposExames, ExcluirTipoExame, Cadastro }) {
    const [modalShow, setShowModal] = useState(false);
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [tipoExameExcluir, setTipoExameExcluir] = useState(null);
    const [editandoTipoExame, setEditandoTipoExame] = useState(null);

    const confirmarExclusao = (tipoExame) => {
        setTipoExameExcluir(tipoExame);
        setShowModal(true);
    };

    const excluirTipoExame = async () => {
        if (!tipoExameExcluir) return;
        try {
            await ExcluirTipoExame(tipoExameExcluir.te_id);
        } catch (error) {
            console.error("Erro ao excluir tipo de exame:", error);
            alert("Não foi possível excluir o tipo de exame.");
        } finally {
            setShowModal(false);
            setTipoExameExcluir(null);
        }
    };

    const atualizar = (dataTipoExame) => {
        setEditandoTipoExame(dataTipoExame);
        setModalShowEditar(true);
    };

    const handleEditarTipoExame = () => {
        setModalShowEditar(false);
        Cadastro();
    };

    const renderStatus = (status) => (
        <Badge bg={status == 1 ? 'success' : 'secondary'}>
            {status == 1 ? 'Ativo' : 'Inativo'}
        </Badge>
    );

    const renderCorpoTabela = () => {
        if (!tiposExames || tiposExames.length === 0) {
            return (
                <tr>
                    <td colSpan="4">
                        <Alert variant="info" className="m-0">
                            Nenhum tipo de exame encontrado. Cadastre um novo.
                        </Alert>
                    </td>
                </tr>
            );
        }

        return tiposExames.map(tipoExame => (
            <tr key={tipoExame.te_id}>
                <td className="fw-semibold">{tipoExame.te_nome}</td>
                <td className="text-muted">{tipoExame.te_descricao || '—'}</td>
                <td>{renderStatus(tipoExame.te_status)}</td>
                <td style={{ width: '120px' }}>
                    <Button size="sm" variant="warning" className="me-1" onClick={() => atualizar(tipoExame)}>
                        <BsPencilSquare />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => confirmarExclusao(tipoExame)}>
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
                        <th style={{ fontWeight: 600, color: '#495057' }}>Descrição</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Status</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCorpoTabela()}
                </tbody>
            </Table>

            <Modal show={modalShow} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>⚠️ Confirmar Exclusão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {tipoExameExcluir && (
                        <p>
                            Tem certeza que deseja excluir:<br />
                            Nome: <strong>{tipoExameExcluir.te_nome}</strong><br />
                            Descrição: <strong>{tipoExameExcluir.te_descricao || '—'}</strong><br />
                            Status: <strong>{tipoExameExcluir.te_status == 1 ? 'Ativo' : 'Inativo'}</strong>
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={excluirTipoExame}>Confirmar Exclusão</Button>
                </Modal.Footer>
            </Modal>

            <ModalEditar
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)}
                editandoTipoExame={editandoTipoExame}
                Cadastro={handleEditarTipoExame}
            />
        </>
    );
}

export default Dados;