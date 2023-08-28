import React, { useState } from 'react';
import './Toolbar.css';
import axios from 'axios';


const Toolbar = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
      setDropdownOpen(prev => !prev);
  };

  const handleLectureClick = (lectureId) => {
      props.onLectureSelect(lectureId);
  };


  return (
    <div>
        {/* Header */}
        <header className="toolbar-header">
        Laboratorio Web para GoLang
        </header>

        {/* Toolbar */}
        <div className="toolbar">

        <button onClick={props.onExecute}>Execute</button>

            <button>Button 2</button>

            {/* Dropdown button */}
            <div className="dropdown">
                <button onClick={toggleDropdown}>Dropdown</button>
                {dropdownOpen && (
                    <div className="dropdown-menu">
                        <a href="#" onClick={() => handleLectureClick(1)}>Option 1</a>
                        <a href="#" onClick={() => handleLectureClick(2)}>Option 2</a>
                        <a href="#" onClick={() => handleLectureClick(3)}>Option 3</a>
                    </div>
                )}
            </div>

            <button>Button 4</button>
            <button>Button 5</button>
        </div>
    </div>
);
}

export default Toolbar;