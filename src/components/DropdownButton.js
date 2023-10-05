import React, { useState, useRef, useEffect } from 'react';

const DropdownButton = ({ title, items, onItemClick }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        // Cleanup on component unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button onClick={toggleDropdown}>{title}</button>
            {dropdownOpen && (
                <div className="dropdown-menu">
                    {items.map((item, index) => (
                        <a key={index} href="#" onClick={() => onItemClick(index)}>
                            {item}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownButton;
