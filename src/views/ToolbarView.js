import React, { useState, useEffect } from 'react';
import '../styles/Toolbar.css'

import TopicsDropdownButton from '../components/TopicsDropdownButton';
import QuizDropdownButton from '../components/QuizDropdownButton';
import QuizModal from '../components/QuizModal';
import Quiz from '../components/Quiz';
import { fetchTopics } from '../controllers/TopicsController'; 
import { fetchQuizzes } from '../controllers/QuizzesController'; 
import ExamplesDropdownButton from '../components/ExamplesDropdownButton'; // Import the new component
import ExampleModal from '../components/ExampleModal'; // Import your modal component
import LoginModal from '../components/LoginModal';

import logo from '../gopher.png';


const Toolbar = (props) => {

    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedOptionName, setSelectedOptionName] = useState("");
    const [topics, setTopics] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [exampleTitles, setExampleTitles] = useState([]);
    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
    const [currentExampleCode, setCurrentExampleCode] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);




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
      


    
useEffect(() => {
    fetch('http://localhost:3001/examples') // Replace with your server URL
        .then(response => response.json())
        .then(data => {
            setExampleTitles(data);
        })
        .catch(error => {
            console.error("Error fetching examples:", error);
        });
}, []);



const handleLogin = (email, password) => {
    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`User: ${data.name}, Role: ${data.role}`);
            setIsLoginModalOpen(false);
        } else {
            // Handle login failure
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
    });
};








    const handleLectureClick = (lectureId) => {
        props.onLectureSelect(lectureId +1);
    };


    const handleOptionClick = (quizId, quizName) => {
        setSelectedQuizId(quizId);
        setSelectedOptionName(quizName);
        setIsQuizModalOpen(true); 
    };

    const handleExampleClick = (exampleCode) => {
        setCurrentExampleCode(exampleCode); // Set the example code in state
        setIsExampleModalOpen(true); // Open the modal
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
                    <ExamplesDropdownButton
                        title="Ejemplos"
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
               

                {/* Login Button */}
                <div className="right-buttons">

                <button className="btn btn-outline-primary mr-2" onClick={() => {
                    console.log('Login button clicked');
                    setIsLoginModalOpen(true);
                    console.log('After clicking login:', isLoginModalOpen);
                }}>Login</button>
              


                </div>
            </div>

            {/* Modal */}
             <ExampleModal
                isOpen={isExampleModalOpen}
                content={currentExampleCode}
                onClose={() => setIsExampleModalOpen(false)}
            />

             <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onLogin={handleLogin}
            />


        <QuizModal
            isOpen={isQuizModalOpen}
            title={selectedOptionName}
            onClose={() => setIsQuizModalOpen(false)}
            content={<Quiz quizId={selectedQuizId} />}
        />
       
    </div>
);
};

export default Toolbar;


