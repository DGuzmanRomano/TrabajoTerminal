import axios from 'axios';

export const fetchQuizzes = async () => {
    try {
        const response = await axios.get('http://34.125.198.90:3001/api/quizzes');
        console.log("Fetched Quizzes:", response.data);
        return response.data; // Assuming the response data is the list of quizzes
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        throw error;
    }
};
