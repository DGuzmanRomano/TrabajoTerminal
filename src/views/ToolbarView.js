import React, { useState, useEffect } from 'react';
import '../styles/Toolbar.css'
import DropdownButton from '../components/DropdownButton';
import TopicsDropdownButton from '../components/TopicsDropdownButton';
import ExamplesDropdownButton from '../components/ExamplesDropdownButton';
import Modal from '../components/Modal';
import Quiz from '../components/Quiz';
import { fetchTopics } from '../controllers/TopicsController'; 
import { fetchExamples } from '../controllers/ExamplesController'; 
import { fetchExampleById } from '../controllers/ExamplesController'; 
import { fetchQuizzes } from '../controllers/QuizzesController'; 
import ExampleView from  '../views/ExampleView'

const Toolbar = (props) => {

    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [selectedOptionName, setSelectedOptionName] = useState("");
    const [topics, setTopics] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [examples, setExamples] = useState([]);
    const [selectedExample, setSelectedExample] = useState(null);



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
        fetchExamples()
        .then(data => {
            setExamples(data);
        })
        .catch(error => {
            console.error("Error fetching topics:", error);
        });
}, []); 
    


    const handleLectureClick = (lectureId) => {
        props.onLectureSelect(lectureId +1);
    };

    const handleExampleClick = (example) => {
        console.log("Clicked example:", example); // Ensure this logs the expected ID
        fetchExampleById(example.id_example)
            .then(data => {
                console.log("Data fetched for example:", data); // What is logged here?
                setSelectedExample(data);
                setIsExampleModalOpen(true);
            })
            .catch(error => {
                console.error("Error fetching example details:", error);
            });
    };

    
    

    const handleOptionClick = (quizId, quizName) => {
        setSelectedQuizId(quizId);
        setSelectedOptionName(quizName);
        setIsQuizModalOpen(true); 
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
                            items={examples}
                            onItemClick={handleExampleClick }
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
                    <DropdownButton 
                        title="Cuestionario"
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
             
        <Modal
            isOpen={isQuizModalOpen}
            title={selectedOptionName}
            onClose={() => setIsQuizModalOpen(false)}
            content={<Quiz quizId={selectedQuizId} />}
        />
        <Modal
            isOpen={isExampleModalOpen}
            title={selectedExample?.title}
            onClose={() => setIsExampleModalOpen(false)}
        >
            <ExampleView example={selectedExample} />
        </Modal>
    </div>
);
};

export default Toolbar;


