// Modal.js
import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button onClick={onClose} className="close-modal-btn">Close</button>
                <div>{content}</div>
            </div>
        </div>
    );
};

export default Modal;

