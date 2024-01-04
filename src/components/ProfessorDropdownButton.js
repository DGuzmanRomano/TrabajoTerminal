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
                <Dropdown.Item onClick={() => onAction('action3')}>Action 3</Dropdown.Item>
                <Dropdown.Item onClick={() => onAction('action4')}>Action 4</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ProfessorDropdownButton;
