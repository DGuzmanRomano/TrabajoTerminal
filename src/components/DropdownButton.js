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
        <div className={`dropdown ${dropdownOpen ? 'show' : ''}`} ref={dropdownRef}>
            <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleDropdown}>
                {title}
            </button>
            <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                {items.map((item, index) => (
                    <a key={index} href="#" className="dropdown-item" onClick={(e) => {
                        e.preventDefault();
                        onItemClick(index);
                    }}>
                        {item}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default DropdownButton;
