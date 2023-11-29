import React, { useState, useEffect } from 'react';
import '../styles/Toolbar.css'

import TopicsDropdownButton from '../components/TopicsDropdownButton';
import QuizDropdownButton from '../components/QuizDropdownButton';
import Modal from '../components/Modal';
import Quiz from '../components/Quiz';
import { fetchTopics } from '../controllers/TopicsController'; 
import { fetchQuizzes } from '../controllers/QuizzesController'; 
import ExamplesDropdownButton from '../components/ExamplesDropdownButton'; // Import the new component

import logo from '../gopher.png';


const Toolbar = (props) => {

    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedOptionName, setSelectedOptionName] = useState("");
    const [topics, setTopics] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [exampleTitles, setExampleTitles] = useState([]);


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
        setIsQuizModalOpen(true); 
    };

    const handleExampleClick = (title) => {
        console.log("Selected example title:", title);
    };
    

    
    return (
        <div>
         
            <div className="btn-toolbar p-3 justify-content-between" role="toolbar">
                <div className="left-buttons">
                    <div className="btn-group mr-2" role="group">
                        <button type="button" className="btn btn-primary" onClick={props.onExecute}>Ejecutar</button>
                        <button type="button" className="btn btn-secondary">Archivo</button>
                    </div>
       
                    <div className="btn-group mr-2" role="group">
            <ExamplesDropdownButton // Add the new ExamplesDropdownButton here
                title="Examples"
                items={exampleTitles}
                onItemClick={handleExampleClick}
            />
        </div>


                    <div className="btn-group mr-2" role="group">
                        <TopicsDropdownButton
                            title="Lecciones"
                            items={topics}
                            onItemClick={handleLectureClick}
                        />
                    </div>



                    <div className="btn-group" role="group">
                    <QuizDropdownButton 
                        title="Cuestionario"
                        items={quizzes} 
                        onItemClick={(quiz) => handleOptionClick(quiz.quiz_id, quiz.quiz_name)}
                    />



                    </div>
                </div>
<div className="gopher" >   <img src={logo} alt="Logo" style={{ marginRight: 'auto' }} />  </div>
               

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
             
        <Modal
            isOpen={isQuizModalOpen}
            title={selectedOptionName}
            onClose={() => setIsQuizModalOpen(false)}
            content={<Quiz quizId={selectedQuizId} />}
        />
       
    </div>
);
};

export default Toolbar;


