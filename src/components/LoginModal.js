import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password); // Pass 'email' instead of 'username'
    };

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Inicio de Sesión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Correo:</label> {/* Updated label */}
                        <input
                            type="email" // Changed 'text' to 'email' for proper validation
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Updated to setEmail
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Ingresar
                    </button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;
