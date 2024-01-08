// useLecture.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useLecture = (lectureId) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (lectureId) {
            axios.get(`http://34.125.183.229:3001/lecture/${lectureId}`)
                .then(response => {
                    setContent(response.data);
                })
                .catch(error => {
                    console.error('Error fetching lecture:', error);
                    setError(error);
                });
        }
    }, [lectureId]);

    return { content, error };
}

export default useLecture;
