import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-monokai';

const Quiz = ({ quizId }) => {

    const [feedback, setFeedback] = useState(null);
    const [data, setData] = useState(null);
    const [userAnswer, setUserAnswer] = useState(""); 
    const [selectedOption, setSelectedOption] = useState(null);

    const handleSubmit = () => {
        const handleSubmit = () => {
            axios.post('http://localhost:3001/quiz/validate', {
                quizId: data.id,
                answer: data.type === "text_answer" ? userAnswer : selectedOption
            })
            .then(response => {
                setFeedback(response.data.message);
            })
            .catch(error => {
                console.error('Error validating answer:', error);
            });
        };
        
    };

    useEffect(() => {
        if(quizId) {
            axios.get(`http://localhost:3001/quiz/random/${quizId}`)
                .then(response => {
                    setData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching quiz:', error);
                });
        }
    }, [quizId]);

    const handleOptionClick = (index) => {
        setSelectedOption(index);
    };

    return (
        <div className="quiz-container">
            {data ? (
                <>
                    <p>{data.question_text}</p>
                    <AceEditor
                        mode="golang"
                        theme="monokai"
                        value={data.code_snippet}
                        readOnly={true}
                        height="150px"
                        width="100%"
                    />
                    {data.type === "multiple_choice" && data.options.map((option, index) => (
                        <button
                            key={index}
                            className={`quiz-option-button ${selectedOption === index ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(index)}
                        >
                            {option.option_text}
                        </button>
                    ))}
    
                    {data.type === "true_false" && ['True', 'False'].map((option, index) => (
                        <button
                            key={index}
                            className={`quiz-option-button ${selectedOption === index ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(index)}
                        >
                            {option}
                        </button>
                    ))}
    
                    {data.type === "text_answer" && (
                        <>
                            <input 
                                type="text" 
                                value={userAnswer} 
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Type your answer here"
                            />
                        </>
                    )}
    
                    <button onClick={handleSubmit}>Submit</button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
    
}

export default Quiz;
