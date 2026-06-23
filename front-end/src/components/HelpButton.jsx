import { useState } from "react";
import { Offcanvas, Button, Accordion } from "react-bootstrap";
import { BsQuestionCircleFill } from "react-icons/bs";

function HelpButton({ titulo, topicos }) {
    const [show, setShow] = useState(false);

    return (
        <>
            <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShow(true)}
                className="d-flex align-items-center gap-1"
                title="Ajuda"
                style={{ borderRadius: '6px' }}
            >
                <BsQuestionCircleFill /> Ajuda
            </Button>

            <Offcanvas show={show} onHide={() => setShow(false)} placement="end" style={{ width: '380px' }}>
                <Offcanvas.Header closeButton style={{ background: '#1a1a2e', color: 'white' }}>
                    <Offcanvas.Title>
                        <BsQuestionCircleFill className="me-2" />
                        {titulo}
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                    <Accordion defaultActiveKey="0" flush>
                        {topicos.map((topico, index) => (
                            <Accordion.Item key={index} eventKey={String(index)}>
                                <Accordion.Header>{topico.titulo}</Accordion.Header>
                                <Accordion.Body style={{ fontSize: '0.9rem', color: '#555' }}>
                                    {Array.isArray(topico.conteudo) ? (
                                        <ol className="ps-3">
                                            {topico.conteudo.map((item, i) => (
                                                <li key={i} className="mb-1">{item}</li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <p className="mb-0">{topico.conteudo}</p>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}

export default HelpButton;