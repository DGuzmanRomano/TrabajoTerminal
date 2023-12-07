// ProfessorDropdownButton.js
import React from 'react';
import { Dropdown } from 'react-bootstrap';

const StudentDropdownButton = ({ title }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-professor">
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#action1">Action 1</Dropdown.Item>
                <Dropdown.Item href="#action2">Action 2</Dropdown.Item>
                {/* ... other actions */}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default StudentDropdownButton;

// StudentDropdownButton.js would be similar with its own items




