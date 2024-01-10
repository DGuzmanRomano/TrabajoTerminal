import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Editor from '@monaco-editor/react';

const ExampleModal = ({ isOpen, content, title, onClose }) => {
    const [showAlert, setShowAlert] = useState(false);

    const handleCopyToClipboard = () => {
        if (!navigator.clipboard) {
            console.error('Clipboard not available');
            return;
        }
    
        navigator.clipboard.writeText(content)
            .then(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
            });
    };
    

    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title || 'Código de Ejemplo'}</Modal.Title> {}
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary mb-2" onClick={handleCopyToClipboard}>
                        Copiar
                    </button>
                </div>
                {showAlert && (
                    <div className="alert alert-success" role="alert">
                        Copiado al portapapeles!
                    </div>
                )}
                <Editor
                    height="400px"
                    language="go"
                      theme="vs-dark"
                    defaultValue={content}
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        wrappingIndent: 'indent',
                    }}
                /> </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                </Modal.Footer>
            </Modal>
        );
    };

export default ExampleModal;
