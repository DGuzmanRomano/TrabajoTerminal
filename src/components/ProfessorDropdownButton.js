import React from 'react';
import { Dropdown } from 'react-bootstrap';

const ProfessorDropdownButton = ({ title, onAction }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-professor">
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item onClick={() => onAction('action1')}>Action 1</Dropdown.Item>

                <Dropdown.Item onClick={() => onAction('action2')}>Action 2</Dropdown.Item>
                {/* ... other actions */}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfessorDropdownButton;
