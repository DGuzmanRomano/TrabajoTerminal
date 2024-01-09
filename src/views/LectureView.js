import React, { useState, useContext, useEffect } from 'react';
import '../styles/GoTutorial.css';
import useLecture from '../controllers/useLecture'; 
import UserContext from '../components/UserContext';
import MonacoEditor from '@monaco-editor/react';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import { Toast } from 'react-bootstrap';

import '../styles/RightPanel.css';  

const LectureView = ({ lectureId, content }) => {
    const { content: fetchedContent, error } = useLecture(lectureId);
    const [lectureTitle, setLectureTitle] = useState('');
    const [lectureText, setLectureText] = useState('');
    const { user } = useContext(UserContext);

    const [showSuccess, setShowSuccess] = useState(false);
    const [titleValidation, setTitleValidation] = useState('');
    const [textValidation, setTextValidation] = useState('');
    
    const [showToast, setShowToast] = useState(false);
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [questionValidation, setQuestionValidation] = useState('');
    const [answerValidation, setAnswerValidation] = useState('');
    const [quizName, setQuizName] = useState('');
    const [lecturesList, setLecturesList] = useState([]);




    const fetchLectures = async () => {
        try {
            const response = await fetch('/api/api/lectures');
            if (!response.ok) throw new Error('Failed to fetch lectures');
            const lectures = await response.json();
            setLecturesList(lectures);
        } catch (error) {
            console.error('Error fetching lectures:', error);
        }
    };
    

    useEffect(() => {
        fetchLectures();
    }, []);
    

    const handleCodeSnippetChange = (questionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].codeSnippet = value;
        setQuestions(newQuestions);
    };
    
    const handleFeedbackChange = (questionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].feedback = value;
        setQuestions(newQuestions);
    };
    
   

    useEffect(() => {
        // If the user logs out and the `user` becomes null, reset the state.
        if (!user) {
            setLectureTitle('');
            setLectureText('');
            setQuestions([{
                question: '', 
                type: 'text',
                codeSnippet: '',
                options: ['', '', '', ''],
                correctOption: 0,
                feedback: ''
            }]);
            // Reset any other state variables or perform cleanup here
        }
    }, [user]); 


    const [questions, setQuestions] = useState([{
        question: '', 
        type: 'text', // 'text', 'true_false', or 'multiple_choice'
        codeSnippet: '', // For the code snippet
        options: ['', '', '', ''], // Four options for multiple-choice
        correctOption: 0, // Index of the correct option
        feedback: '' // For the feedback or explanation
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
          const response = await fetch('/api/add-lecture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(lectureData)
          });
  
          if (!response.ok) {
              throw new Error('Failed to submit lecture');
          }
  
          const result = await response.json();
          console.log(result.message); 
          setLectureTitle('');
          setLectureText('');
          setShowSuccess(true); 
          setTimeout(() => setShowSuccess(false), 3000);


      } catch (error) {
          console.error('Error submitting lecture:', error);
         
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
    setQuestions([
        ...questions,
        {
            question: '', 
            type: 'text', // Default to 'text'
            answer: '', // For text and true/false questions
            options: ['', '', '', ''], // Four options for multiple-choice
            correctOption: 0 // Index of the correct option for multiple-choice
        }
    ]);
};




const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
};



const handleCorrectOptionChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctOption = optionIndex;
    setQuestions(newQuestions);
};


const handleDeleteLecture = async (lectureId) => {
    try {
        const response = await fetch(`/api/delete-lecture/${lectureId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete lecture');
        fetchLectures(); // Refresh the list after deletion
    } catch (error) {
        console.error('Error deleting lecture:', error);
    }
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
        let answers = [];
        
        switch (q.type) {
            case 'text':
                answers.push({ text: q.answer, is_correct: 1 });
                break;
            case 'true_false':
                answers = [
                    { text: 'true', is_correct: q.correctAnswer === 'true' ? 1 : 0 },
                    { text: 'false', is_correct: q.correctAnswer === 'false' ? 1 : 0 }
                ];
                break;
            case 'multiple_choice':
                answers = q.options.map((option, index) => ({
                    text: option,
                    is_correct: index === q.correctOption ? 1 : 0
                }));
                break;
            default:
                console.log("Unhandled question type:", q.type);
        }

        return {
            question: q.question,
            type: q.type,
            codeSnippet: q.codeSnippet,
            feedback: q.feedback,
            answers: answers
        };
    });





    

    const quizData = {
        quizName: quizName,
        professorId: user.id, 
        questions: formattedQuestions
    };
    

    try {
        const response = await fetch('/api/add-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit questions');
        }

        const result = await response.json();
        console.log(result.message); // Or handle this in the UI

        // Reset form or update UI as needed
        setQuestions([{
            question: '', 
            type: 'text',
            answer: '',
            options: ['', '', '', ''],
            correctOption: 0,
            codeSnippet: '',
            feedback: ''
        }]);
        setQuizName(''); // Reset the quiz name
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
        console.error('Error submitting questions:', error);
        setShowSuccess(false);
    }
};



if (!user) {
    content=""
    return (
        <div className="lecture-view-container card go-tutorial">
        <div className="card-body">

        {content ? 
            <div className="text-muted">{content}</div> : 
            <div className="card-body" dangerouslySetInnerHTML={{ __html: fetchedContent }}></div> 
          
          }

        </div>
      </div>
    );
}

if (content === 'createLecture') {
    return (
        <div className="lecture-view-container card go-tutorial">
            <div className="card-body">
                {showSuccess && (
                    <div className="alert alert-success" role="alert">
                        Leccion añadida exitosamente!
                    </div>
                )}
                <div>
                    <p>Escribe el titulo de la Lección:</p>
                    <input type="text" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
                    {titleValidation && <div className="text-danger">{titleValidation}</div>}
                </div>
                <div>
                    <p>Contenido:</p>
                    <ReactQuill value={lectureText} onChange={setLectureText} />
                    {textValidation && <div className="text-danger">{textValidation}</div>}
                </div>
                <button onClick={handleLectureSubmit}>Enviar</button>
            </div>
        </div>
    );
}

    else if (content === 'createQuestion') {
        return (
            <div className="lecture-view-container card go-tutorial">
                {showToast && (
                                <Toast onClose={() => setShowToast(false)} delay={3000} autohide>
                                    <Toast.Header>
                                        <strong className="mr-auto">Success</strong>
                                    </Toast.Header>
                                    <Toast.Body>Cuestionario añadido exitosamente!</Toast.Body>
                                </Toast>
                            )}



                <div className="card-body">
                    {showSuccess && (
                        <div className="alert alert-success" role="alert">
                            Cuestionario añadido exitosamente!
                        </div>
                    )}

        <div>
            <p>Nombre del cuestionario:</p>
            <input type="text" value={quizName} onChange={(e) => setQuizName(e.target.value)} />
        </div>

        {questions.map((q, index) => (
            <div key={index}>
                <div>
                    <p>Pregunta {index + 1}:</p>
                    <input type="text" value={q.question} onChange={(e) => handleQuestionChange(index, 'question', e.target.value)} />
                    <select value={q.type} onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}>
                        <option value="text">Texto</option>
                        <option value="true_false">Verdadero / Falso</option>
                        <option value="multiple_choice">Opción múltiple</option> {/* Add this line */}
                    </select>
                </div>

                <div>

                <p>Código:</p>
                <MonacoEditor
                    height="200px"
                    
                    language="go"
                    theme="vs-dark"
                    value={q.codeSnippet}
                    onChange={(value) => handleCodeSnippetChange(index, value)}
                    className="monaco-editor-container" 
                />
            </div>

                {q.type === 'text' && (
                    <div>
                        <p>Respuesta:</p>
                        <textarea value={q.answer} onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)} />
                    </div>
                )}
                {q.type === 'true_false' && (
                    <div>
                        <p>Respuesta Correcta:</p>
                        <label>
                            <input type="radio" value="true" checked={q.correctAnswer === 'true'} onChange={(e) => handleQuestionChange(index, 'correctAnswer', 'true')} />
                            Verdadero
                        </label>
                        <label>
                            <input type="radio" value="false" checked={q.correctAnswer === 'false'} onChange={(e) => handleQuestionChange(index, 'correctAnswer', 'false')} />
                            Falso
                        </label>
                    </div>
                )}

                    {q.type === 'multiple_choice' && (
                        <div>
                            {q.options.map((option, optionIndex) => (
                                <div key={optionIndex}>
                                    <input 
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                    />
                                </div>
                            ))}
                            <p>Seleccione la opción correcta:</p>
                            {q.options.map((option, optionIndex) => (
                                <label key={optionIndex}>
                                    <input 
                                        type="radio" 
                                        name={`correctOption-${index}`} 
                                        checked={q.correctOption === optionIndex}
                                        onChange={() => handleCorrectOptionChange(index, optionIndex)}
                                    />
                                    Opción {optionIndex + 1}
                                </label>
                            ))}
                        </div>
                    )}

                <div>
                    <p>Retroalimentación:</p>
                    <textarea 
                        value={q.feedback} 
                        onChange={(e) => handleFeedbackChange(index, e.target.value)} 
                    />
                </div>

            </div>
        ))}




                    <button onClick={handleAddQuestion}>Añadir otra pregunta</button>
                    <button onClick={handleQuestionSubmit}>Enviar Cuestionario</button>
                </div>
            </div>
        );
    }


    else if (content === 'deleteLecture') {
        return (
            <div className="lecture-view-container card go-tutorial">
                <div className="card-body">
                    <ul>
                        {lecturesList.map(lecture => (
                            <li key={lecture.lecture_id}>
                                {lecture.lecture_title}
                                <button onClick={() => handleDeleteLecture(lecture.lecture_id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    
    else {
        return (
          <div className="lecture-view-container card go-tutorial">
            <div className="card-body">
              {content ? 
                <div className="text-muted">{content}</div> : 
                <div className="card-body" dangerouslySetInnerHTML={{ __html: fetchedContent }}></div> 
              }
            </div>
          </div>
        );
    }
    

  
};

export default LectureView;