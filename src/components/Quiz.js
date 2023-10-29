import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-monokai';

const Quiz = ({ quizId }) => {


    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);



    const [score, setScore] = useState(null);
    const [data, setData] = useState(null);
    const [userResponses, setUserResponses] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [quizData, setQuizData] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    
    const handleNextClick = () => {
        if (activeQuestionIndex < data.length - 1) {
            setActiveQuestionIndex(prevIndex => prevIndex + 1);
        }
    };
    
    const handlePrevClick = () => {
        if (activeQuestionIndex > 0) {
            setActiveQuestionIndex(prevIndex => prevIndex - 1);
        }
    };
    

    const handleSubmitAll = () => {
        // Here, send the userResponses to the server for validation
        axios.post('http://localhost:3001/quiz/validateAll', {
            responses: userResponses
        })
        .then(response => {
            setScore(response.data.correctCount);
            setCorrectAnswers(response.data.correctAnswers); // Assuming your backend sends this
            setShowFeedback(true);
        })
        .catch(error => {
            console.error('Error validating answers:', error);
        });
    };
    

    const handleOptionClick = (questionId, selectedOptionText) => {
        const newResponses = [...userResponses];
        const existingResponse = newResponses.find(resp => resp.questionId === questionId);
        if (existingResponse) {
            existingResponse.answer = selectedOptionText;
        } else {
            newResponses.push({ questionId, answer: selectedOptionText });
        }
        setUserResponses(newResponses);
    };
    
    
    const handleTextChange = (questionId, textValue) => {
        const newResponses = [...userResponses];
        const existingResponseIndex = newResponses.findIndex(resp => resp.questionId === questionId);
        if (existingResponseIndex > -1) {
            newResponses[existingResponseIndex].answer = textValue;
        } else {
            newResponses.push({ questionId, answer: textValue });
        }
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
            <div style={{ padding: '0 50px' }}> 
                {/* Increased padding to push content inwards */}
                
                <div>
                    <p>{data[activeQuestionIndex].question_text}</p>
                    <AceEditor
                        mode="golang"
                        theme="monokai"
                        value={data[activeQuestionIndex].code_snippet}
                        readOnly={true}
                        height="150px"
                        width="100%"
                    />

                    {data[activeQuestionIndex].type === "multiple_choice" && data[activeQuestionIndex].options.map((option, idx) => (
                        <button
                            key={idx}
                            className={`btn btn-block mt-3`}
                            onClick={() => handleOptionClick(data[activeQuestionIndex].id, option.option_text)}
                        >
                            {option.option_text}
                        </button>
                    ))}

                    {data[activeQuestionIndex].type === "true_false" && data[activeQuestionIndex].options.map((option, idx) => (
                        <button
                            key={idx}
                            className={`btn btn-block mt-3`}
                            onClick={() => handleOptionClick(data[activeQuestionIndex].id, option.option_text)}
                        >
                            {option.option_text}
                        </button>
                    ))}

                    {data[activeQuestionIndex].type === "text_answer" && (
                        <input 
                            type="text"
                            className="form-control mt-3"
                            placeholder="Type your answer here"
                            onChange={(e) => handleTextChange(data[activeQuestionIndex].id, e.target.value)}
                        />
                    )}
                </div>

                {activeQuestionIndex > 0 && (
                    <button className="btn btn-primary" onClick={handlePrevClick}>Previous</button>
                )}
                {activeQuestionIndex < data.length - 1 ? (
                    <button className="btn btn-primary" onClick={handleNextClick}>Next</button>
                ) : (
                    <div>
                        <button onClick={handleSubmitAll} className="btn btn-success">Submit All</button>
                        <div className="score">
                            {score !== null ? `Your score is: ${score}/${data.length}` : ""}
                        </div>
                    </div>
                )}

                {showFeedback && 
                    <div className="feedback-section">
                        <h3>Feedback:</h3>
                        {data.map((question, idx) => {
                            const userResponse = userResponses.find(resp => resp.questionId === question.id);
                            const correctAnswer = question.options.find(opt => opt.is_correct);
                            return (
                                <div key={idx}>
                                    <p>Question {idx + 1}: {question.question_text}</p>
                                    <p>Option selected: {userResponse && userResponse.answer}</p>
                                    <p>Correct Answer: {correctAnswer && correctAnswer.option_text}</p>
                                    <p>Explanation: {question.feedback}</p>
                                </div>
                            );
                        })}
                    </div>
                }
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Quiz;