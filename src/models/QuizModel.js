import axios from 'axios';

const fetchQuizData = async (quizId) => {
    console.log(`Fetching data for quizId: ${quizId}`);
    
    try {
        const response = await axios.get(`http://localhost:3001/quiz/all/${quizId}`);
        console.log('Quiz data received:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        // Handle error appropriately
        throw error; // Re-throw the error to be caught by the calling function
    }
};


const submitQuizAnswers = async (userResponses) => {
    const response = await axios.post('http://localhost:3001/quiz/validateAll', {
        responses: userResponses
    });
    return response.data;
};

export { fetchQuizData, submitQuizAnswers };
