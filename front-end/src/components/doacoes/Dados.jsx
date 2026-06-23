import { Table, Modal, Button, Alert } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useState } from "react";
import ModalEditar from "./ModalEditar.jsx";

function Dados({ doacoes, ExcluirDoacao, Cadastro }) {
    const [modalShow, setShowModal] = useState(false);
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [doacaoExcluir, setDoacaoExcluir] = useState(null);
    const [editandoDoacao, setEditandoDoacao] = useState(null);

    const confirmarExclusao = (doacao) => {
        setDoacaoExcluir(doacao);
        setShowModal(true);
    };

    const excluirDoacao = async () => {
        if (!doacaoExcluir) return;
        try {
            await ExcluirDoacao(doacaoExcluir.doa_id);
        } catch (error) {
            console.error("Erro ao excluir doação:", error);
            alert("Não foi possível excluir a doação.");
        } finally {
            setShowModal(false);
            setDoacaoExcluir(null);
        }
    };

    const atualizar = (doacao) => {
        setEditandoDoacao(doacao);
        setModalShowEditar(true);
    };

    const handleEditarDoacao = () => {
        setModalShowEditar(false);
        Cadastro();
    };

    const formatarData = (data) => {
        if (!data) return '—';
        return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    const formatarValor = (valor) => {
        if (!valor) return 'R$ 0,00';
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const renderCorpoTabela = () => {
        if (!doacoes || doacoes.length === 0) {
            return (
                <tr>
                    <td colSpan="5">
                        <Alert variant="info" className="m-0">
                            Nenhuma doação encontrada. Cadastre uma nova.
                        </Alert>
                    </td>
                </tr>
            );
        }

        return doacoes.map(doacao => (
            <tr key={doacao.doa_id}>
                <td className="fw-semibold">{doacao.do_nome}</td>
                <td>{doacao.do_email || '—'}</td>
                <td>{formatarValor(doacao.doa_valor)}</td>
                <td>{formatarData(doacao.doa_data)}</td>
                <td className="text-muted">{doacao.doa_observacao || '—'}</td>
                <td style={{ width: '120px' }}>
                    <Button size="sm" variant="warning" className="me-1" onClick={() => atualizar(doacao)}>
                        <BsPencilSquare />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => confirmarExclusao(doacao)}>
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
                        <th style={{ fontWeight: 600, color: '#495057' }}>Doador</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>E-mail</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Valor</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Data</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Observação</th>
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
                    {doacaoExcluir && (
                        <p>
                            Tem certeza que deseja excluir a doação:<br />
                            Doador: <strong>{doacaoExcluir.do_nome}</strong><br />
                            Valor: <strong>{formatarValor(doacaoExcluir.doa_valor)}</strong><br />
                            Data: <strong>{formatarData(doacaoExcluir.doa_data)}</strong>
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={excluirDoacao}>Confirmar Exclusão</Button>
                </Modal.Footer>
            </Modal>

            <ModalEditar
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)}
                editandoDoacao={editandoDoacao}
                Cadastro={handleEditarDoacao}
            />
        </>
    );
}

export default Dados;