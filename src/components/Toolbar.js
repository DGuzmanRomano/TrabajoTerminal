import React, { useState } from 'react';
import './Toolbar.css';
import DropdownButton from './DropdownButton';
import Modal from './Modal'; 
import Quiz from './Quiz';
import axios from 'axios';

const Toolbar = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    const handleLectureClick = (lectureId) => {
        props.onLectureSelect(lectureId +1);
    };

    const handleOptionClick = (index) => {
     
        setSelectedQuizId(index + 1); 
        setIsModalOpen(true);
    };
    
    return (
        <div>
            {/* Header */}
            <header className="toolbar-header">
                Laboratorio Web para GoLang
            </header>

            {/* Toolbar */}
            <div className="toolbar">

                <button  className="button" onClick={props.onExecute}>Execute</button>
                <button>Button 2</button>

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
               
                <DropdownButton 
                    title="Quiz"
                    items={['Option 1', 'Option 2', 'Option 3']}
                    onItemClick={handleOptionClick}
                />
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={<Quiz quizId={selectedQuizId} />} />
        </div>
    );
};

export default Toolbar;