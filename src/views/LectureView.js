import React, { useState, useContext } from 'react';

import '../styles/GoTutorial.css';
import useLecture from '../controllers/useLecture'; 
import UserContext from '../components/UserContext';

const LectureView = ({ lectureId, content }) => {
    const { content: fetchedContent, error } = useLecture(lectureId);
    const [lectureTitle, setLectureTitle] = useState('');
    const [lectureText, setLectureText] = useState('');
    const { user } = useContext(UserContext);

    const [showSuccess, setShowSuccess] = useState(false);
    const [titleValidation, setTitleValidation] = useState('');
    const [textValidation, setTextValidation] = useState('');
    

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [questionValidation, setQuestionValidation] = useState('');
    const [answerValidation, setAnswerValidation] = useState('');

    const [questions, setQuestions] = useState([{ 
        question: '', 
        type: 'text', // 'text' or 'true_false'
        answer: '', 
        correctAnswer: 'true' // Only used for 'true_false' type 
    }]);
    

    const handleLectureSubmit = async () => {


        setTitleValidation('');
        setTextValidation('');
    
        let isValid = true;
    
        if (!lectureTitle.trim()) {
            setTitleValidation('Lecture title is required.');
            isValid = false;
        }
    
        if (!lectureText.trim()) {
            setTextValidation('Lecture content is required.');
            isValid = false;
        }
    
        if (!isValid) {
            return; // Stop the function if validation fails
        }




      const lectureData = {
          title: lectureTitle,
          text: lectureText,
          authorId: user.id 
      };
  
      try {
          const response = await fetch('http://localhost:3001/add-lecture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(lectureData)
          });
  
          if (!response.ok) {
              throw new Error('Failed to submit lecture');
          }
  
          const result = await response.json();
          console.log(result.message); // Or handle this in the UI
          // Reset form or update UI as needed
          setLectureTitle('');
          setLectureText('');
          setShowSuccess(true); 
          setTimeout(() => setShowSuccess(false), 3000);


      } catch (error) {
          console.error('Error submitting lecture:', error);
          // Handle error in the UI
          setShowSuccess(false); 
      }
  };








  const handleQuestionChange = (index, key, value) => {
    const newQuestions = questions.map((q, i) => {
        if (i === index) {
            return { ...q, [key]: value };
        }
        return q;
    });
    setQuestions(newQuestions);
};

const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
};








const handleQuestionSubmit = async () => {
    console.log("Submitting questions:", questions);

    let isValid = true;
    let validationErrors = [];

    // Validate each question-answer pair
    questions.forEach(({ question, type, answer, correctAnswer }, index) => {
        if (!question.trim()) {
            validationErrors[index] = { ...validationErrors[index], question: 'Question is required.' };
            isValid = false;
        }

        if (type === 'text' && !answer.trim()) {
            validationErrors[index] = { ...validationErrors[index], answer: 'Answer is required.' };
            isValid = false;
        }
    });

    if (!isValid) {
        // Update state to display validation errors
        setQuestionValidation(validationErrors.map(error => error?.question || ''));
        setAnswerValidation(validationErrors.map(error => error?.answer || ''));
        return; // Stop the function if validation fails
    }




    const formattedQuestions = questions.map(q => {
        if (q.type === 'text') {
            return {
                question: q.question,
                type: q.type,
                answers: [{ text: q.answer, is_correct: 1 }]
            };
        } else {
            return {
                question: q.question,
                type: q.type,
                answers: [
                    { text: 'true', is_correct: q.correctAnswer === 'true' ? 1 : 0 },
                    { text: 'false', is_correct: q.correctAnswer === 'false' ? 1 : 0 }
                ]
            };
        }
    });










    try {
        const response = await fetch('http://localhost:3001/add-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questions: formattedQuestions })
        });

        console.log("Formatted questions being sent:", formattedQuestions); // Log the formatted questions

        
  console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error('Failed to submit questions');
        }

        const result = await response.json();
        console.log(result.message); // Or handle this in the UI

        // Reset form or update UI as needed
        setQuestions([{ question: '', answer: '' }]);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
        console.error('Error submitting questions:', error);
        // Handle error in the UI
        setShowSuccess(false);
    }
};








    if (content === 'createLecture') {
        return (
            <div className="lecture-view-container card go-tutorial">
                <div className="card-body">
                    {showSuccess && (
                        <div className="alert alert-success" role="alert">
                            Lecture submitted successfully!
                        </div>
                    )}
                    <div>
                        <p>Write a lecture title:</p>
                        <input type="text" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
                        {titleValidation && <div className="text-danger">{titleValidation}</div>}
                    </div>
                    <div>
                        <p>Lecture content:</p>
                        <textarea value={lectureText} onChange={(e) => setLectureText(e.target.value)} />
                        {textValidation && <div className="text-danger">{textValidation}</div>}
                    </div>
                    <button onClick={handleLectureSubmit}>Submit</button>
                </div>
            </div>
        );
        
    }

    else if (content === 'createQuestion') {
        return (
            <div className="question-view-container card go-tutorial">
                <div className="card-body">
                    {showSuccess && (
                        <div className="alert alert-success" role="alert">
                            Questions submitted successfully!
                        </div>
                    )}


        {questions.map((q, index) => (
            <div key={index}>
                <div>
                    <p>Question {index + 1}:</p>
                    <input type="text" value={q.question} onChange={(e) => handleQuestionChange(index, 'question', e.target.value)} />
                    <select value={q.type} onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}>
                        <option value="text">Text</option>
                        <option value="true_false">True / False</option>
                    </select>
                </div>
                {q.type === 'text' && (
                    <div>
                        <p>Answer:</p>
                        <textarea value={q.answer} onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)} />
                    </div>
                )}
                {q.type === 'true_false' && (
                    <div>
                        <p>Correct Answer:</p>
                        <label>
                            <input type="radio" value="true" checked={q.correctAnswer === 'true'} onChange={(e) => handleQuestionChange(index, 'correctAnswer', 'true')} />
                            True
                        </label>
                        <label>
                            <input type="radio" value="false" checked={q.correctAnswer === 'false'} onChange={(e) => handleQuestionChange(index, 'correctAnswer', 'false')} />
                            False
                        </label>
                    </div>
                )}
            </div>
        ))}




                    <button onClick={handleAddQuestion}>Add Question</button>
                    <button onClick={handleQuestionSubmit}>Submit Questions</button>
                </div>
            </div>
        );
    }



    else {
    return (
      <div className="lecture-view-container card go-tutorial">
        <div className="card-body">

        {content ? 
            <div className="text-muted">{content}</div> : // Manually set content
            <div dangerouslySetInnerHTML={{ __html: fetchedContent }} className="text-muted" /> // Fetched content
          }

        </div>
      </div>
    );

  }
};

export default LectureView;
