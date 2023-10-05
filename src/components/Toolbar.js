import React, { useState } from 'react';

import DropdownButton from './DropdownButton';
import Modal from './Modal'; 
import Quiz from './Quiz';
import axios from 'axios';

const Toolbar = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedOptionName, setSelectedOptionName] = useState("");


    const handleLectureClick = (lectureId) => {
        props.onLectureSelect(lectureId +1);
    };

    const handleOptionClick = (index, itemName) => {
        setSelectedQuizId(index + 1);
        setSelectedOptionName(itemName);
        setIsModalOpen(true);
    };
    
    return (
        <div>
            {/* Header */}
            <header className="bg-info p-3 text-white text-center">
                Laboratorio Web para GoLang
            </header>

            {/* Toolbar */}
            <div className="btn-toolbar p-3" role="toolbar">
                <div className="btn-group mr-2" role="group">
                    <button type="button" className="btn btn-primary" onClick={props.onExecute}>Execute</button>
                    <button type="button" className="btn btn-secondary">Button 2</button>
                </div>
                <div className="btn-group mr-2" role="group">
                    <DropdownButton
                        title="Lecciones"
                        items={[
                            'Variables y operadores',
                            'Control de flujo',
                            'Arreglos y cadenas',
                            'Estructuras y funciones',
                            'Recursividad'
                        ]}
                        onItemClick={handleLectureClick}
                    />
                </div>
                <div className="btn-group" role="group">
                    <DropdownButton 
                        title="Quiz"
                        items={['Option 1', 'Option 2', 'Option 3']}
                        onItemClick={(index, itemName) => handleOptionClick(index, itemName)}
                    />
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} title={selectedOptionName} onClose={() => setIsModalOpen(false)} content={<Quiz quizId={selectedQuizId} />} />
        </div>
    );
};

export default Toolbar;