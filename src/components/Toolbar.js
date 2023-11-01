import React, { useState, useEffect } from 'react';
import './Toolbar.css'
import DropdownButton from './DropdownButton';
import TopicsDropdownButton from './TopicsDropdownButton';
import Modal from './Modal'; 
import Quiz from './Quiz';
import axios from 'axios';

const Toolbar = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedOptionName, setSelectedOptionName] = useState("");
    const [topics, setTopics] = useState([]);
    const [quizzes, setQuizzes] = useState([]);



    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/topics');
                console.log("Fetched Topics:", response.data); // Log this
                setTopics(response.data);
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
    
        fetchTopics();
    }, []);


    const handleLectureClick = (lectureId) => {
        props.onLectureSelect(lectureId +1);
    };

    

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/quizzes');
                console.log("Fetched Quizzes:", response.data);
                setQuizzes(response.data);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };
        
        fetchQuizzes();
    }, []);

      
    

    const handleOptionClick = (quizId, quizName) => {
        setSelectedQuizId(quizId);
        setSelectedOptionName(quizName);
        setIsModalOpen(true);
    };

    
    return (
        <div>
            {/* Header */}
           
            {/* Toolbar */}
            <div className="btn-toolbar p-3 justify-content-between" role="toolbar">
                <div className="left-buttons">
                    <div className="btn-group mr-2" role="group">
                        <button type="button" className="btn btn-primary" onClick={props.onExecute}>Execute</button>
                        <button type="button" className="btn btn-secondary">Button 2</button>
                    </div>
                    <div className="btn-group mr-2" role="group">
                        <TopicsDropdownButton
                            title="Topics"
                            items={topics}
                            onItemClick={handleLectureClick}
                        />
                    </div>
                    <div className="btn-group" role="group">
                    <DropdownButton 
                        title="Quiz"
                        items={quizzes} 
                        onItemClick={(quiz) => handleOptionClick(quiz.quiz_id, quiz.quiz_name)}
                    />



                    </div>
                </div>

                {/* Login and Signup Buttons */}
                <div className="right-buttons">
                    <button className="btn btn-outline-primary mr-2" onClick={() => {
                        // handle login logic here
                    }}>Login</button>
                    <button className="btn btn-primary" onClick={() => {
                        // handle signup logic here
                    }}>Sign Up</button>
                </div>
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} title={selectedOptionName} onClose={() => setIsModalOpen(false)} content={<Quiz quizId={selectedQuizId} />} />
        </div>
    );
};

export default Toolbar;