
import React, { useState, useContext } from 'react';
import UserContext from '../components/UserContext';

const QuestionView = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const { user } = useContext(UserContext);

    const [showSuccess, setShowSuccess] = useState(false);
    const [questionValidation, setQuestionValidation] = useState('');
    const [answerValidation, setAnswerValidation] = useState('');

    const handleQuestionSubmit = async () => {
        setQuestionValidation('');
        setAnswerValidation('');

        let isValid = true;

        if (!question.trim()) {
            setQuestionValidation('Question is required.');
            isValid = false;
        }

        if (!answer.trim()) {
            setAnswerValidation('Answer is required.');
            isValid = false;
        }

        if (!isValid) {
            return; // Stop the function if validation fails
        }

        const questionData = {
            question_text: question,
            option_text: answer,
            authorId: user.id
        };

        try {
            const response = await fetch('http://34.125.198.90:3001/add-question', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit question');
            }

            const result = await response.json();
            console.log(result.message);
            setQuestion('');
            setAnswer('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Error submitting question:', error);
            setShowSuccess(false);
        }
    };

    return (
        <div className="question-view-container card go-tutorial">
            <div className="card-body">
                {showSuccess && (
                    <div className="alert alert-success" role="alert">
                        Question submitted successfully!
                    </div>
                )}
                <div>
                    <p>Question:</p>
                    <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
                    {questionValidation && <div className="text-danger">{questionValidation}</div>}
                </div>
                <div>
                    <p>Answer:</p>
                    <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
                    {answerValidation && <div className="text-danger">{answerValidation}</div>}
                </div>
                <button onClick={handleQuestionSubmit}>Submit Question</button>
            </div>
        </div>
    );
};

export default QuestionView;
