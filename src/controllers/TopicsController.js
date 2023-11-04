
import axios from 'axios';

export const fetchTopics = async () => {
    try {
        const response = await axios.get('http://localhost:3001/api/topics');
        console.log("Fetched Topics:", response.data);
        return response.data; // Assuming the response data is the list of topics
    } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
    }
};
