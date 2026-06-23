import { Table, Modal, Button, Alert } from "react-bootstrap";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { useState } from "react";
import ModalEditar from "./ModalEditar.jsx";

function Dados({ pacientes, ExcluirPaciente, Cadastro }) {
    const [modalShow, setShowModal] = useState(false);
    const [modalShowEditar, setModalShowEditar] = useState(false);
    const [pacienteExcluir, setPacienteExcluir] = useState(null);
    const [editandoPaciente, setEditandoPaciente] = useState(null);

    const confirmarExclusao = (paciente) => {
        setPacienteExcluir(paciente);
        setShowModal(true);
    };

    const excluirPaciente = async () => {
        if (!pacienteExcluir) return;
        try {
            await ExcluirPaciente(pacienteExcluir.pa_id);
        } catch (error) {
            console.error("Erro ao excluir paciente:", error);
            alert("Não foi possível excluir o paciente.");
        } finally {
            setShowModal(false);
            setPacienteExcluir(null);
        }
    };

    const formatarData = (dataPaciente) => {
        if (!dataPaciente) return '';
        return new Date(dataPaciente).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    const formatarCPF = (cpf) => {
        if (!cpf) return '';
        return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatarTelefone = (telefone) => {
        if (!telefone) return '';
        const numeros = telefone.replace(/\D/g, '');
        if (numeros.length === 11) {
            return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    };

    const atualizar = (dataPaciente) => {
        setEditandoPaciente(dataPaciente);
        setModalShowEditar(true);
    };

    const handleEditarPaciente = () => {
        setModalShowEditar(false);
        Cadastro();
    };

    const renderCorpoTabela = () => {
        if (!pacientes || pacientes.length === 0) {
            return (
                <tr>
                    <td colSpan="7">
                        <Alert variant="info" className="m-0">
                            Nenhum paciente encontrado. Tente limpar os filtros ou cadastre um novo.
                        </Alert>
                    </td>
                </tr>
            );
        }

        return pacientes.map(paciente => (
            <tr key={paciente.pa_id}>
                <td>{paciente.pa_nome}</td>
                <td>{formatarCPF(paciente.pa_cpf)}</td>
                <td>{formatarData(paciente.pa_data_nascimento)}</td>
                <td>{formatarTelefone(paciente.pa_telefone)}</td>
                <td>{paciente.pa_email || '—'}</td>
                <td>{paciente.pa_endereco}</td>
                <td>
                    <Button variant="warning" onClick={() => atualizar(paciente)}>
                        <BsPencilSquare />
                    </Button>
                    <Button className="m-1" variant="danger" onClick={() => confirmarExclusao(paciente)}>
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
                        <th>Paciente</th>
                        <th>CPF</th>
                        <th>Data de Nascimento</th>
                        <th>Telefone</th>
                        <th>E-mail</th>
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
                    {pacienteExcluir && (
                        <p>
                            Tem certeza que deseja excluir o paciente:<br />
                            Paciente: <strong>{pacienteExcluir.pa_nome}</strong><br />
                            CPF: <strong>{formatarCPF(pacienteExcluir.pa_cpf)}</strong><br />
                            Data de Nascimento: <strong>{formatarData(pacienteExcluir.pa_data_nascimento)}</strong><br />
                            Telefone: <strong>{formatarTelefone(pacienteExcluir.pa_telefone)}</strong><br />
                            E-mail: <strong>{pacienteExcluir.pa_email || '—'}</strong><br />
                            Endereço: <strong>{pacienteExcluir.pa_endereco}</strong>
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={excluirPaciente}>Confirmar Exclusão</Button>
                </Modal.Footer>
            </Modal>

            <ModalEditar
                show={modalShowEditar}
                onHide={() => setModalShowEditar(false)}
                editandoPaciente={editandoPaciente}
                Cadastro={handleEditarPaciente}
            />
        </>
    );
}

export default Dados;