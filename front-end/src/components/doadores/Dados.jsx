import { Table, Modal, Button, Alert } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useState } from "react";
import ModalEditar from "./ModalEditar.jsx";

function Dados({ doadores, ExcluirDoador, Cadastro }) {
    const [modalShow, setShowModal] = useState(false);
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [doadorExcluir, setDoadorExcluir] = useState(null);
    const [editandoDoador, setEditandoDoador] = useState(null);

    const confirmarExclusao = (doador) => {
        setDoadorExcluir(doador);
        setShowModal(true);
    };

    const excluir = async () => {
        if (!doadorExcluir) return;
        try {
            await ExcluirDoador(doadorExcluir.do_id);
        } catch (error) {
            console.error("Erro ao excluir doador:", error);
            alert("Não foi possível excluir doador.");
        } finally {
            setShowModal(false);
            setDoadorExcluir(null);
        }
    };

    const atualizar = (dataDoador) => {
        setEditandoDoador(dataDoador);
        setModalShowEditar(true);
    };

    const handleEditarDoador = () => {
        setModalShowEditar(false);
        Cadastro();
    };

    const formatarValor = (valor) => {
        if (!valor) return 'R$ 0,00';
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const renderCorpoTabela = () => {
        if (!doadores || doadores.length === 0) {
            return (
                <tr>
                    <td colSpan="5">
                        <Alert variant="info" className="m-0">
                            Nenhum doador encontrado. Tente limpar os filtros ou cadastre um novo.
                        </Alert>
                    </td>
                </tr>
            );
        }

        return doadores.map(doador => (
            <tr key={doador.do_id}>
                <td>{doador.do_nome}</td>
                <td>{doador.do_email}</td>
                <td>{doador.do_telefone}</td>
                <td>{doador.do_endereco}</td>

                <td>
                    <Button variant="warning" onClick={() => atualizar(doador)}>
                        <BsPencilSquare />
                    </Button>
                    <Button className="m-1" variant="danger" onClick={() => confirmarExclusao(doador)}>
                        <BsTrash />
                    </Button>
                </td>
            </tr>
        ));
    };

    return (
        <>
            <Table responsive="lg" striped bordered hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Endereço</th>
                        <th>Ações</th>
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
                    {doadorExcluir && (
                        <p>
                            Tem certeza que deseja excluir o doador:<br />
                            Nome: <strong>{doadorExcluir.do_nome}</strong><br />
                            E-mail: <strong>{doadorExcluir.do_email}</strong><br />
                            Telefone: <strong>{doadorExcluir.do_telefone}</strong><br />
                            Endereço: <strong>{doadorExcluir.do_endereco}</strong><br />
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={excluir}>Confirmar Exclusão</Button>
                </Modal.Footer>
            </Modal>

            <ModalEditar
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)}
                editandoDoador={editandoDoador}
                Cadastro={handleEditarDoador}
            />
        </>
    );
}

export default Dados;