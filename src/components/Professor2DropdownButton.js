import React from 'react';
import { Dropdown } from 'react-bootstrap';

const Professor2DropdownButton = ({ title, onAction }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-professor2">
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => onAction('action5')}>Crear Lección</Dropdown.Item>
                
                <Dropdown.Item onClick={() => onAction('action6')}>Modificar Lección</Dropdown.Item>
                <Dropdown.Item onClick={() => onAction('action7')}>Eliminar Lección</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default Professor2DropdownButton;
