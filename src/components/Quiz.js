import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-monokai';

const Quiz = ({ quizId }) => {

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [data, setData] = useState(null);
    const [userAnswer, setUserAnswer] = useState(""); 
    const [selectedOption, setSelectedOption] = useState(null);


const handleSubmit = () => {
    setIsSubmitDisabled(true);

    let answer;
    if (data.type === 'text_answer') {
        answer = userAnswer;
    } else {
        // Assuming the selected option sends the actual string of the option.
        answer = data.options[selectedOption].option_text;
    }

    console.log("Selected answer:", answer);  // Debugging line

    axios.post('http://localhost:3001/quiz/validate', {
        quizId: data.id,
        answer: answer
    })
    .then(response => {
        setFeedback(response.data.message);
        setIsSubmitDisabled(false);
    })
    .catch(error => {
        console.error('Error validating answer:', error);
        setIsSubmitDisabled(false);
    });
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
        <div className="container mt-3">
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
                            className={`btn btn-block mt-3 ${selectedOption === index ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => handleOptionClick(index)}
                        >
                            {option.option_text}
                        </button>
                    ))}
                    {data.type === "true_false" && ['True', 'False'].map((option, index) => (
                        <button
                            key={index}
                            className={`btn btn-block mt-3 ${selectedOption === index ? 'btn-danger' : 'btn-primary'}`}
                            onClick={() => handleOptionClick(index)}
                        >
                            {option}
                        </button>
                    ))}
                    {data.type === "text_answer" && (
                        <input 
                            type="text"
                            className="form-control mt-3"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type your answer here"
                        />
                    )}
                    <button onClick={handleSubmit} disabled={isSubmitDisabled} className="btn btn-success mt-3">Submit</button>
                    <p className="mt-3">{feedback}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Quiz;