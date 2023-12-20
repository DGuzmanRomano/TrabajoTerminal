import React, { useState } from 'react';

import './Modal.css'; 

const QuizModal = ({ isOpen, onClose, content, title }) => {
    if (!isOpen) return null;

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-xl modal-custom-size">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">{title}</h5> {}
                        <button type="button" className="closeb" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizModal;
