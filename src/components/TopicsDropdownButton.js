import React from 'react';
import { Dropdown } from 'react-bootstrap';

const DropdownButton = ({ title, items, itemIds, onItemClick }) => {
    return (
        <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {items.map((item, index) => (
                    <Dropdown.Item key={index} onClick={() => onItemClick(itemIds[index], item)}>
                        {item}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};


export default DropdownButton;
