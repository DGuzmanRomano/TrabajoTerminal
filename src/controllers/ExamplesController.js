import axios from 'axios';

export const fetchExamples = async () => {
    try {
        const response = await axios.get('http://localhost:3001/api/examples');
        console.log("Fetched Examples:", response.data);
        return response.data; 
    } catch (error) {
        console.error("Error fetching examples:", error);
        throw error;
    }
};

export const fetchExampleById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/examples/${id}`);
        console.log("Fetched Example Details:", response.data);
        return response.data; 
    } catch (error) {
        console.error("Error fetching example details:", error);
        throw error;
    }
};
