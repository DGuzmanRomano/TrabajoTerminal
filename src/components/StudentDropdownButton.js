// StudentDropdownButton.js
import React from 'react';

const StudentDropdownButton = ({ title }) => {
    return (
        <div className="btn-group">
            <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {title}
            </button>
            <ul className="dropdown-menu">
                {/* Add dropdown items specific to the student */}
                <li><button className="dropdown-item" type="button">Action 1</button></li>
                <li><button className="dropdown-item" type="button">Action 2</button></li>
                {/* ... other actions */}
            </ul>
        </div>
    );
};

export default StudentDropdownButton;
