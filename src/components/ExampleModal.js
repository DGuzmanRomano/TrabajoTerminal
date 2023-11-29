import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Editor from '@monaco-editor/react';

const ExampleModal = ({ isOpen, content, title, onClose }) => {
    const [showAlert, setShowAlert] = useState(false);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(content)
            .then(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000); // Hide the alert after 2 seconds
            })
            .catch((err) => {
                console.error('Could not copy text: ', err);
                // Optionally handle the error case, e.g., by showing a different alert
            });
    };

    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title || 'Example Code'}</Modal.Title> {/* Use the passed title */}
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary mb-2" onClick={handleCopyToClipboard}>
                        Copy to Clipboard
                    </button>
                </div>
                {showAlert && (
                    <div className="alert alert-success" role="alert">
                        Copied to clipboard!
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
                    <button className="btn btn-secondary" onClick={onClose}>Close</button>
                </Modal.Footer>
            </Modal>
        );
    };

export default ExampleModal;
