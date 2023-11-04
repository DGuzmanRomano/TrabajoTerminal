import React, { useState, useEffect } from 'react';
import '../styles/Toolbar.css'
import DropdownButton from '../components/DropdownButton';
import TopicsDropdownButton from '../components/TopicsDropdownButton';
import Modal from '../components/Modal';
import Quiz from '../components/Quiz';
import { fetchTopics } from '../controllers/TopicsController'; // Import the controller function
import { fetchQuizzes } from '../controllers/QuizzesController'; // Import the controller function

const Toolbar = (props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedOptionName, setSelectedOptionName] = useState("");
    const [topics, setTopics] = useState([]);
    const [quizzes, setQuizzes] = useState([]);



    useEffect(() => {
        fetchTopics()
            .then(data => {
                console.log('Topics:', data);
                setTopics(data);
            })
            .catch(error => {
                console.error("Error fetching topics:", error);
            });
    }, []);
    

    useEffect(() => {
        fetchQuizzes()
            .then(setQuizzes)
            .catch(error => {
                console.error("Error fetching quizzes:", error);
            });
    }, []);
      




    const handleLectureClick = (lectureId) => {
        props.onLectureSelect(lectureId +1);
    };

    

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