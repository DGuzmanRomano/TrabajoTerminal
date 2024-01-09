import axios from 'axios';

export const fetchQuizzes = async (userId, userRole) => {
    try {
        const response = await axios.get(`/api/api/quizzes`, {
            params: {
                userId: userId,
                userRole: userRole
            }
        });
        console.log("Fetched Quizzes:", response.data);
        return response.data; 
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        throw error;
    }
};


