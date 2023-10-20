import React, { useState, useEffect } from 'react';
import { Quiz } from 'react-quiz-component';
import axios from 'axios';

const formatData = (data) => {
    // You might need to adjust this according to the actual structure of 'data'
    const formatted = {
      quizTitle: "Programming Quiz",
      quizSynopsis: "Test your programming knowledge.",
      questions: data.map(entry => ({
        question: entry.question_text,
        questionType: "text",
        answerSelectionType: entry.type === 'multiple_choice' ? 'multiple' : 'single',
        answers: [entry.option_text], // Adjust this to handle multiple options per question
        correctAnswer: entry.is_correct === 1 ? "1" : "0" // Adjust as needed
      }))
    };
    return formatted;
  }
  

const MyQuizComponent = () => {
    const [quizData, setQuizData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/api/quiz').then(response => {
            const formattedData = formatData(response.data);
            setQuizData(formattedData);
        });
    }, []);

    if (!quizData) return "Loading...";

    return <Quiz quiz={quizData} />;
}

export default MyQuizComponent;
