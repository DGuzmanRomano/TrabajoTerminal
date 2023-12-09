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
    let isValid = true;
    let validationErrors = [];

    // Validate each question-answer pair
    questions.forEach(({ question, answer }, index) => {
        if (!question.trim()) {
            validationErrors[index] = { ...validationErrors[index], question: 'Question is required.' };
            isValid = false;
        }

        if (!answer.trim()) {
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

    try {
        const response = await fetch('http://localhost:3001/add-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questions }) // Ensure this is an array of question-answer pairs
        });

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
                                {questionValidation[index] && <div className="text-danger">{questionValidation[index]}</div>}
                            </div>
                            <div>
                                <p>Answer {index + 1}:</p>
                                <textarea value={q.answer} onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)} />
                                {answerValidation[index] && <div className="text-danger">{answerValidation[index]}</div>}
                            </div>
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
