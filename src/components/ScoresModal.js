import React from 'react';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const ScoresModal = ({ isOpen, onClose, scores }) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Scores</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display scores here */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ScoresModal;

