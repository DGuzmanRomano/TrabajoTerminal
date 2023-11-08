import React from 'react';
import Editor from '@monaco-editor/react';
import './Quiz.css';
import useQuizController from '../controllers/useQuizController'; 

const Quiz = ({ quizId }) => {
    const {
        state: {
            data,
            activeQuestionIndex,
            showFeedback,
            score,
            userResponses, // make sure to get userResponses from the state
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

    // Render the feedback section
const renderFeedback = () => (
    <div className="feedback-section">
        <h3>Quiz Results:</h3>
        <div className="feedback-list">
            {data.map((question, index) => {

                const userAnswer = userResponses[question.id]?.option_text || "No answer provided";
                const correctOption = question.options.find(o => o.is_correct);
                const correctAnswer = correctOption ? correctOption.option_text : "No correct answer";
                const questionFeedback = question.feedback || "No feedback provided";
                

                const userResponse = userResponses[question.id];
                const userAnswerText = userResponse ? (userResponse.option_text || userResponse) : "No answer provided";
                const isCorrect = question.options.some((o) => (o.option_text === userAnswerText && o.is_correct));


                const backgroundColor = isCorrect ? 'green' : 'red';




                return (

                    <div key={question.id} className="feedback-item" style={{ backgroundColor: backgroundColor }}>
                        <p>Question {index + 1}: {question.question_text}</p>
                        {question.code_snippet && (
                            <Editor 
                                width="100%"
                                height="150px"
                                language="go" 
                                theme="vs-dark"
                                value={question.code_snippet}
                                options={{
                                    readOnly: true,
                                    selectOnLineNumbers: true,
                                    roundedSelection: false,
                                    cursorStyle: 'line',
                                    automaticLayout: true, 
                                }}
                            />
                        )}
                        <p>User answer: {userAnswer}</p>
                        <p>Correct answer: {correctAnswer}</p>
                        <p>Feedback: {questionFeedback}</p>
                    </div>
                );
            })}
        </div>
        <p>Your Score: {score}</p>
    </div>
);


    return (
        <div className="quiz-container">
            {!showFeedback ? (
                <>
               
                    <div className="question-section">
                        <h4>Question {activeQuestionIndex + 1}</h4>
                        <p>{data[activeQuestionIndex].question_text}</p>
                      
                      
                        <div className="monaco-editor-container" style={{ height: '150px', width: '100%' }}>
                        <Editor 
                        width="100%"
                        height="150px"
                        language="go"
                        theme="vs-dark"
                        value={data[activeQuestionIndex].code_snippet}
                        options={{
                            readOnly: true,
                            selectOnLineNumbers: true,
                            roundedSelection: false,
                            cursorStyle: 'line',
                            automaticLayout: true, // the size of the editor will grow to fit the container
                        }}
                        />
                    </div>


                    </div>



                    {data[activeQuestionIndex].question_type !== "text_answer" ? (
                        <div className="options-grid">
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
                        ) : (
                        <input 
                            type="text"
                            className="text-answer-input"
                            placeholder="Type your answer here"
                            onChange={(e) => handleTextChange(data[activeQuestionIndex].id, e.target.value)}
                        />
                        )}


                        <div className="btn-groupq">
                                {activeQuestionIndex > 0 && (
                                <button className="prev-button btn-dir" onClick={handlePrevClick}>Previous</button>
                                )}
                                <div className="next-button">
                                {activeQuestionIndex < data.length - 1 ? (
                                    <button className="btn-dir" onClick={handleNextClick}>Next</button>
                                ) : (
                        <button className="submit-all-button btn-dir" onClick={handleSubmitAll}>Submit All</button>
                        )}
                    </div>
                    </div>
                </>
            ) : renderFeedback()}
        </div>
    );
};

export default Quiz;
