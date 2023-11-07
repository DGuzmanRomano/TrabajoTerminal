import React from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-monokai';
import './Quiz.css';
import useQuizController from '../controllers/useQuizController'; // Import the custom hook


const Quiz = ({ quizId }) => {
    const {
        state: {
            data,
            activeQuestionIndex,
            showFeedback,
            score,
        },
        actions: {
            handleNextClick,
            handlePrevClick,
            handleSubmitAll,
            handleOptionClick,
            handleTextChange,
        },
    } = useQuizController(quizId);
    


    if (!data || data.length === 0) {
        return <p>No questions found for the selected quiz.</p>;
    }

    return (
        <div className="quiz-container">
            {!showFeedback ? (
                <>
                    <div className="question-section">
                        <h4>Question {activeQuestionIndex + 1}</h4>
                        <p>{data[activeQuestionIndex].question_text}</p>
                        <AceEditor
                            mode="golang"
                            theme="monokai"
                            value={data[activeQuestionIndex].code_snippet || ''}
                            readOnly={true}
                            height="150px"
                            width="100%"
                        />
                    </div>

                    <div className="options-section">
                        {data[activeQuestionIndex].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(data[activeQuestionIndex].id, option)}
                                className="option-button"
                            >
                                {option.option_text}
                            </button>
                        ))}
                    </div>

                    {data[activeQuestionIndex].question_type === "text_answer" && (
                        <input 
                            type="text"
                            className="text-answer-input"
                            placeholder="Type your answer here"
                            onChange={(e) => handleTextChange(data[activeQuestionIndex].id, e.target.value)}
                        />
                    )}

                    <div className="navigation-buttons">
                        {activeQuestionIndex > 0 && (
                            <button onClick={handlePrevClick}>Previous</button>
                        )}
                        {activeQuestionIndex < data.length - 1 ? (
                            <button onClick={handleNextClick}>Next</button>
                        ) : (
                            <button onClick={handleSubmitAll}>Submit All</button>
                        )}
                    </div>
                </>
            ) : (
                <div className="feedback-section">
                    <h3>Quiz Results:</h3>
                    <p>You answered {score} out of {data.length} questions correctly!</p>
                    {data.map((question, index) => (
                        <div key={index} className={`feedback ${question.isCorrect ? 'correct' : 'incorrect'}`}>
                            <p>{question.question_text}</p>
                            {/* You may want to display the selected option and whether it was correct or not */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quiz;
