import React from 'react';
import { Dropdown } from 'react-bootstrap';

const ExamplesDropdownButton = ({ title, items, onItemClick }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {items.map((item, index) => (
                    <Dropdown.Item key={item.id_example} onClick={() => onItemClick(item.example_code)}>
                        {item.example_title}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default ExamplesDropdownButton;
