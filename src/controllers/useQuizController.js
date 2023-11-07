import { useState, useCallback, useEffect } from 'react';
import { fetchQuizData, submitQuizAnswers } from '../models/QuizModel'


const useQuizController = (quizId) => {
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

  // Submit all answers
  const handleSubmitAll = useCallback(async () => {
    // Submit the user responses and get the result
    const result = await submitQuizAnswers(userResponses);
    // Set the score based on the response from the server
    setScore(result.score);
    setShowFeedback(true);
  }, [userResponses]);



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
