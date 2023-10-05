import React, { useState } from 'react';
import './Toolbar.css';
import DropdownButton from './DropdownButton';
import Modal from './Modal'; 
import Quiz from './Quiz';



const Toolbar = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleLectureClick = (lectureId) => {
        props.onLectureSelect(lectureId);
    };

    const handleOptionClick = (index) => {
        // Set the content based on the clicked option
        switch (index) {
            case 0:
                setModalContent('Content for Option 1');
                break;
            case 1:
                setModalContent('Content for Option 2');
                break;
            case 2:
                setModalContent('Content for Option 3');
                break;
            default:
                setModalContent('Unknown Option');
        }

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

                <button onClick={props.onExecute}>Execute</button>
                <button>Button 2</button>

                <DropdownButton
                    title="Dropdown"
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
                    title="Button 4"
                    items={['Item 1', 'Item 2', 'Item 3']}
                    onItemClick={(index) => console.log('Button 4 item clicked:', index)}
                />

                <DropdownButton
                    title="Button 5"
                    items={['Option 1', 'Option 2', 'Option 3']}
                    onItemClick={handleOptionClick} // <-- Change the handler here
                />


        </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} content={<Quiz />} />

        </div>
    );
};

export default Toolbar;