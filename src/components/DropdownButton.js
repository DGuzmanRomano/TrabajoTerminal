import React from 'react';
import { Dropdown } from 'react-bootstrap';

const DropdownButton = ({ title, items, onItemClick }) => {

    return (
        <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                {title}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {items.map((item, index) => (
                    <Dropdown.Item key={item.quiz_id} onClick={() => onItemClick(item)}>
                        {item.quiz_name}
                    </Dropdown.Item>

                
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default DropdownButton;
