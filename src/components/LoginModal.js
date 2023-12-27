import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const LoginModal = ({ isOpen, onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <Modal show={isOpen} backdrop="static">
            <Modal.Header>
                <Modal.Title>Inicio de Sesión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Correo:</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
