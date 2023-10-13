import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-monokai';

const Quiz = ({ quizId }) => {


    const [score, setScore] = useState(null);
    const [data, setData] = useState(null);
    const [userResponses, setUserResponses] = useState([]);

    const handleSubmitAll = () => {
        // Here, send the userResponses to the server for validation
        axios.post('http://localhost:3001/quiz/validateAll', {
            responses: userResponses
        })
        .then(response => {
            // Set the score state variable with the result from the server
            setScore(response.data.correctCount);
        })
        .catch(error => {
            console.error('Error validating answers:', error);
        });
    };
    

    const handleOptionClick = (questionIndex, selectedOptionText) => {
        const newResponses = [...userResponses];
        newResponses[questionIndex] = selectedOptionText;
        setUserResponses(newResponses);
    };
    
    const handleTextChange = (questionIndex, text) => {
        const newResponses = [...userResponses];
        newResponses[questionIndex] = text;
        setUserResponses(newResponses);
    };

    

    
useEffect(() => {
    if(quizId) {
        axios.get(`http://localhost:3001/quiz/all/${quizId}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching quizzes:', error);
            });
    }
}, [quizId]);




    return (
        <div className="container mt-3">
            {data ? (
                <div id="quizCarousel" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        {data.map((quizItem, index) => (
                            <div className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <p>{quizItem.question_text}</p>
                                <AceEditor
                                    mode="golang"
                                    theme="monokai"
                                    value={quizItem.code_snippet}
                                    readOnly={true}
                                    height="150px"
                                    width="100%"
                                />
                                
                                {quizItem.type === "multiple_choice" && quizItem.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={`btn btn-block mt-3`}
                                        onClick={() => handleOptionClick(index, option.option_text)} 

                                    >
                                        {option.option_text}
                                    </button>
                                ))}
                                
                                {quizItem.type === "true_false" && ['True', 'False'].map((option, idx) => (
                                    <button
                                        key={idx}
                                        className={`btn btn-block mt-3`}
                                        onClick={() => handleOptionClick(index, option.option_text)} 

                                    >
                                        {option}
                                    </button>
                                ))}
                                
                                {quizItem.type === "text_answer" && (
                                    <input 
                                        type="text"
                                        className="form-control mt-3"
                                        placeholder="Type your answer here"
                                       
                                       
                                    />
                                )}
    
                            </div>
                        ))}

<div className="carousel-item">
    _____________________________<button onClick={handleSubmitAll} className="btn btn-success">Submit All</button>
    <div className="score">
    {score !== null ? `Your score is: ${score}/${data.length}` : ""}
</div>

</div>


                    </div>
                    <a className="carousel-control-prev" href="#quizCarousel" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#quizCarousel" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
    
};

export default Quiz;