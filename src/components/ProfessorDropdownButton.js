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
              
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfessorDropdownButton;
