// StudentDropdownButton.js
import React from 'react';
import { Dropdown } from 'react-bootstrap';

const StudentDropdownButton = ({ title, onActionSelect }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-student">
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => onActionSelect('action1')}>Ver Calificaciones</Dropdown.Item>
                {/* Add more items here if needed */}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default StudentDropdownButton;
