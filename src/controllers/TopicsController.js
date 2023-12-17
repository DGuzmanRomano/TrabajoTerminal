
import axios from 'axios';

export const fetchTopics = async () => {
    try {
        const response = await axios.get('http://34.125.198.90:3001/api/lectures');
        console.log("Fetched Topics:", response.data);
        return response.data; 
    } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
    }
};
