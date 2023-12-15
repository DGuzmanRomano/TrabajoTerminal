import { useState, useCallback, useEffect } from 'react';
import { fetchQuizData, submitQuizAnswers } from '../models/QuizModel'
import axios from 'axios';

const useQuizController = (quizId, user) => {
  // State for the current index, user responses, and score could be managed here
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const [data, setData] = useState([]);

  // Handle when the user selects an option for a question
  const handleOptionClick = useCallback((questionId, optionId) => {
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: optionId,
    }));
  }, []);

  // Handle text change for text-based answers
  const handleTextChange = useCallback((questionId, text) => {
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: text,
    }));
  }, []);

  // Go to the next question
  const handleNextClick = useCallback(() => {
    setActiveQuestionIndex((prevIndex) => prevIndex + 1);
  }, []);

  // Go to the previous question
  const handlePrevClick = useCallback(() => {
    setActiveQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  }, []);






  const handleSubmitAll = useCallback(async () => {
    setShowFeedback(true);
    const studentId = user?.role === 'student' ? user.id : null;

    try {
        const userAnswers = Object.keys(userResponses).map(questionId => ({
            questionId: questionId,
            answer: userResponses[questionId]
        }));
        console.log("Submitting quiz with data:", { quizId, userResponses: userAnswers, studentId });
  
        const result = await axios.post(`http://localhost:3001/submit-quiz`, {
            quizId,
            userResponses: userAnswers,
            studentId // Include this line
        });

        setScore(result.data.score);
    } catch (error) {
        console.error('There was an issue submitting the quiz:', error);
    }
}, [quizId, userResponses, user]); 

  



  useEffect(() => {
    
    const loadData = async () => {
        console.log('Fetching data for quizId:', quizId);
        try {
            const quizData = await fetchQuizData(quizId);
            console.log('Quiz data received:', quizData);
            setData(quizData);
          } catch (error) {
            console.error('Error loading quiz data:', error);
       
      }
    };

    if (quizId) { // Only try to load data if a quizId is provided
      loadData();
    }
  }, [quizId]); // It will run only when the quizId changes




  return {
    state: {
      activeQuestionIndex,
      data,
      userResponses,
      score,
      showFeedback,
    },
    actions: {
      handleNextClick,
      handlePrevClick,
      handleSubmitAll,
      handleOptionClick,
      handleTextChange
   
    },
  };
};

export default useQuizController;
