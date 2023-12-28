import axios from 'axios';

export const fetchQuizzes = async (userId, userRole) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/quizzes`, {
            params: {
                userId: userId,
                userRole: userRole
            }
        });
        console.log("Fetched Quizzes:", response.data);
        return response.data; // Assuming the response data is the list of quizzes
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        throw error;
    }
};
