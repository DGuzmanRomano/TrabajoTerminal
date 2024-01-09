import React from 'react';
import { Dropdown } from 'react-bootstrap';

const ProfessorDropdownButton = ({ title, onAction }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-professor">
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => onAction('action1')}>Crear Cuestionario</Dropdown.Item>
                <Dropdown.Item onClick={() => onAction('action2')}>Eliminar Cuestionario</Dropdown.Item>
                <Dropdown.Item onClick={() => onAction('action3')}>Modificar Cuestionario</Dropdown.Item>
                <Dropdown.Item onClick={() => onAction('action4')}>Ver calificaciones</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfessorDropdownButton;
