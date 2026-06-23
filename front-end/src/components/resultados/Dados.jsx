import { Table, Modal, Button, Alert } from "react-bootstrap";
import { BsTrash, BsFileEarmarkText, BsDownload } from "react-icons/bs";
import { useState } from "react";
import ResultadoExameService from "../../services/ResultadoExameService.js";
const API = import.meta.env.VITE_API_URL;

function Dados({ resultados, Cadastro }) {
    const [modalShow, setShowModal] = useState(false);
    const [resultadoExcluir, setResultadoExcluir] = useState(null);

    const confirmarExclusao = (resultado) => {
        setResultadoExcluir(resultado);
        setShowModal(true);
    };

    const excluirResultado = async () => {
        if (!resultadoExcluir) return;
        try {
            await ResultadoExameService.excluir(resultadoExcluir.res_id);
            if (Cadastro) Cadastro();
        } catch { alert("Não foi possível excluir o resultado."); }
        finally {
            setShowModal(false);
            setResultadoExcluir(null);
        }
    };

    const formatarData = (data) => {
        if (!data) return '—';
        return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };

    const renderCorpoTabela = () => {
        if (!resultados || resultados.length === 0) {
            return (
                <tr>
                    <td colSpan="6">
                        <Alert variant="info" className="m-0">Nenhum resultado encontrado.</Alert>
                    </td>
                </tr>
            );
        }

        return resultados.map(r => (
            <tr key={r.res_id}>
                <td className="fw-semibold">{r.pa_nome}</td>
                <td>{r.pa_cpf}</td>
                <td>{r.te_nome}</td>
                <td>{formatarData(r.res_data)}</td>
                <td>
                    {r.res_resultado
                        ? <span className="text-muted" style={{ fontSize: '0.85rem' }}>{r.res_resultado.slice(0, 60)}{r.res_resultado.length > 60 ? '...' : ''}</span>
                        : '—'
                    }
                </td>
                <td>
                    {r.res_arquivo ? (
                        <a
                            href={`${API}${r.res_arquivo}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-primary me-1"
                            title="Ver arquivo"
                        >
                            <BsFileEarmarkText />
                        </a>
                    ) : null}
                    <Button size="sm" variant="danger" onClick={() => confirmarExclusao(r)}>
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
                        <th style={{ fontWeight: 600, color: '#495057' }}>Exame</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Data</th>
                        <th style={{ fontWeight: 600, color: '#495057' }}>Resultado</th>
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
                    {resultadoExcluir && (
                        <p>
                            Tem certeza que deseja excluir o resultado:<br />
                            Paciente: <strong>{resultadoExcluir.pa_nome}</strong><br />
                            Exame: <strong>{resultadoExcluir.te_nome}</strong><br />
                            Data: <strong>{formatarData(resultadoExcluir.res_data)}</strong>
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={excluirResultado}>Confirmar Exclusão</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Dados;