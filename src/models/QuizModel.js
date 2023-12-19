import axios from 'axios';

const fetchQuizData = async (quizId) => {
    console.log(`Fetching data for quizId: ${quizId}`);
    try {
        const response = await axios.get(`http://localhost:3001/quiz/all/${quizId}`);
        console.log('Quiz data received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        throw error;
    }
};

const submitQuizAnswers = async (userResponses) => {
    try {
        const response = await axios.post('http://localhost:3001/quiz/validateAll', {
            responses: userResponses
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting quiz answers:', error);
        throw error;
    }
};

export { fetchQuizData, submitQuizAnswers };
