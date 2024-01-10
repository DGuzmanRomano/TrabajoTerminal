import { useState, useCallback, useEffect } from 'react';
import { fetchQuizData, submitQuizAnswers } from '../models/QuizModel'
import axios from 'axios';

const useQuizController = (quizId, user) => {
  
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState({});
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  const [data, setData] = useState([]);

 
  const handleOptionClick = (questionId, option) => {
    setUserResponses(prevResponses => ({
        ...prevResponses,
        [questionId]: { option_text: option.option_text }, 
    }));
};


  const handleTextChange = (questionId, text) => {
    setUserResponses(prevResponses => ({
        ...prevResponses,
        [questionId]: text, 
    }));
};



 
  const handleNextClick = useCallback(() => {
    setActiveQuestionIndex((prevIndex) => prevIndex + 1);
  }, []);

  
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
            studentId 
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

    if (quizId) { 
      loadData();
    }
  }, [quizId]); 




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
