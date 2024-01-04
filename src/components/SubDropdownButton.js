import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import '../styles/Dropdown.css'

const SubDropdownItem = ({ item, onAction }) => {
    const [showSubmenu, setShowSubmenu] = useState(false);

    const handleMouseEnter = () => {
        if (item.subItems) setShowSubmenu(true);
    };

    const handleMouseLeave = () => {
        setShowSubmenu(false);
    };

    return (
        <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Dropdown.Item onClick={() => onAction(item.action)}>
                {item.label}
            </Dropdown.Item>
            {item.subItems && (
                <div className="submenu">
                    {item.subItems.map((subItem, index) => (
                        <Dropdown.Item key={index} onClick={() => onAction(subItem.action)}>
                            {subItem.label}
                        </Dropdown.Item>
                    ))}
                </div>
            )}
        </div>
    );
};
export default SubDropdownItem;