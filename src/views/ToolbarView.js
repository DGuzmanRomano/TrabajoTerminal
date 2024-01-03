import React, { useState, useEffect, useContext } from 'react';
import '../styles/Toolbar.css'

import TopicsDropdownButton from '../components/TopicsDropdownButton';
import QuizDropdownButton from '../components/QuizDropdownButton';
import QuizModal from '../components/QuizModal';
import Quiz from '../components/Quiz';
import { fetchQuizzes } from '../controllers/QuizzesController'; 
import ExamplesDropdownButton from '../components/ExamplesDropdownButton';
import ExampleModal from '../components/ExampleModal'; 
import LoginModal from '../components/LoginModal';

import ScoresModal from '../components/ScoresModal';
import ProfessorDropdownButton from '../components/ProfessorDropdownButton'; 
import StudentDropdownButton from '../components/StudentDropdownButton'; 


import UserContext from '../components/UserContext';

import logo from '../gopher.png';


const Toolbar = (props) => {

    const [selectedLectureId, setSelectedLectureId] = useState(null);

    const [lectureData, setLectureData] = useState([]);

    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedOptionName, setSelectedOptionName] = useState("");
    const [topics, setTopics] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [exampleTitles, setExampleTitles] = useState([]);
    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
    const [currentExampleCode, setCurrentExampleCode] = useState("");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const { user, setUser } = useContext(UserContext);

    const [isScoresModalOpen, setIsScoresModalOpen] = useState(false);


    const [userQuizzes, setUserQuizzes] = useState([]);


    const fetchUserQuizzes = async () => {
        if (user && user.role === 'student') {
            try {
                const response = await fetch(`http://localhost:3001/user-quizzes/${user.id}`);
                const quizzes = await response.json();
                setUserQuizzes(quizzes); // Set the quizzes in state
            } catch (error) {
                console.error('Error fetching user quizzes:', error);
            }
        }
    };
    


    useEffect(() => {
        if (isScoresModalOpen && user && user.role === 'student') {
            fetchUserQuizzes();
        }
    }, [isScoresModalOpen, user]);
    
    const handleQuizSelection = (quizId) => {
       
        fetchQuizFeedback(quizId);
        console.log(`Quiz selected: ${quizId}`);
        // For example, open a modal with the feedback details
    };

    
    

    const handleStudentDropdownAction = (action) => {
        if (action === 'action1') {
            setIsScoresModalOpen(true); 
        }
     
    };


useEffect(() => {
    if (user) {
        const endpoint = `http://localhost:3001/api/user-lectures?userId=${user.id}&userRole=${user.role}`;
        fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            setLectureData(data);
        })
        .catch(error => {
            console.error("Error fetching lectures:", error);
        });
    }
}, [user]);



useEffect(() => {
    if (user) {
        fetchQuizzes(user.id, user.role)
            .then(setQuizzes)
            .catch(error => {
                console.error("Error fetching quizzes:", error);
            });
    }
}, [user]); 


    
useEffect(() => {
    fetch('http://localhost:3001/examples') 
        .then(response => response.json())
        .then(data => {
            setExampleTitles(data);
        })
        .catch(error => {
            console.error("Error fetching examples:", error);
        });
}, []);




const handleLectureClick = (lectureId, lectureTitle) => {
    setSelectedLectureId(lectureId);
    
};


const [quizFeedback, setQuizFeedback] = useState(null);

const fetchQuizFeedback = async (quizId) => {
    try {
        const response = await fetch(`http://localhost:3001/quiz-feedback/${user.id}/${quizId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const feedbackDetails = await response.json();
        setQuizFeedback(feedbackDetails); // Update the state with the fetched feedback
    } catch (error) {
        console.error('Error fetching quiz feedback:', error);
        // Handle errors or show a message to the user
    }
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

    const handleLogout = () => {
         localStorage.removeItem('user');
        setUser(null); 
    };



    const professorControls = user && user.role === 'professor' && (
        <>
            <span className="navbar-text welcome-message">
                Bienvenido, profesor {user.name}
            </span>
            <ProfessorDropdownButton
                title="Menú de profesor"
                onAction={props.onProfessorAction} 
            />
        </>
    );

    // Welcome message and dropdown for students
    const studentControls = user && user.role === 'student' && (
        <>
            <span className="navbar-text welcome-message">
                Bienvenido,  {user.name}
            </span>
            <StudentDropdownButton
                title="Menú de estudiante"
                onActionSelect={handleStudentDropdownAction}
                
            />
        </>
    );



    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                props.onFileSelect(content); // Pass the file content to the parent component
            };
            reader.readAsText(file);
        }
    };
    

    const handleSaveFile = () => {
        const blob = new Blob([props.code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'codigo.go'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };




    
    return (
        <div>
         
            <div className="btn-toolbar p-3 justify-content-between" role="toolbar">
                <div className="left-buttons">
                    <div className="btn-group mr-2" role="group">
                        <button type="button" className="btn btn-primary" onClick={props.onExecute}>Ejecutar</button>


                        <button type="button" className="btn btn-secondary" onClick={() => document.getElementById('fileInput').click()}>Abrir</button>
                        <input type="file" id="fileInput" accept=".go" style={{ display: 'none' }} onChange={handleFileChange} />


                        <button type="button" className="btn btn-secondary" onClick={handleSaveFile}>Guardar</button>
                    </div>
       
                    <div className="btn-group mr-2" role="group">
                    <ExamplesDropdownButton
                        title="Ejemplos"
                        items={exampleTitles}
                        onItemClick={handleExampleClick} 
                    />

                    <TopicsDropdownButton
                        title="Lecciones"
                        items={lectureData.map(lecture => lecture.lecture_title)}
                        itemIds={lectureData.map(lecture => lecture.lecture_id)}
                        onItemClick={props.onLectureSelect}
                    />


                    <QuizDropdownButton 
                        title="Cuestionario"
                        items={quizzes} 
                        onItemClick={(quiz) => handleOptionClick(quiz.quiz_id, quiz.quiz_name)}
                    />


                </div>

               


                </div>
                  

               

                {/* Login Button */}
                <div className="right-buttons">
                {professorControls || studentControls} {/* Render based on the role */}
                {user ? (
                    // Render Logout button when user is logged in
                    <button className="btn btn-outline-primary mr-2" onClick={handleLogout}>
                        Salir
                    </button>
                ) : (
                    // Render Login button when no user is logged in
                    <button className="btn btn-outline-primary mr-2" onClick={() => setIsLoginModalOpen(true)}>
                        Ingresar
                    </button>
                )}
            </div>

           </div>

            {/* Modal */}
             <ExampleModal
                isOpen={isExampleModalOpen}
                content={currentExampleCode}
                onClose={() => setIsExampleModalOpen(false)}
            />

           

        <QuizModal
            isOpen={isQuizModalOpen}
            title={selectedOptionName}
            onClose={() => setIsQuizModalOpen(false)}
            content={<Quiz quizId={selectedQuizId} />}
        />
       
       <ScoresModal
            isOpen={isScoresModalOpen}
            onClose={() => setIsScoresModalOpen(false)}
            scores={10} // You might want to calculate or fetch this
            quizzes={userQuizzes}
            onQuizSelect={handleQuizSelection}
            quizFeedback={quizFeedback} // Pass the feedback details to the modal
        />


    </div>
);
};

export default Toolbar;