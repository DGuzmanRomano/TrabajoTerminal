// useLecture.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useLecture = (lectureId) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (lectureId) {
            axios.get(`/api/lecture/${lectureId}`)
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
