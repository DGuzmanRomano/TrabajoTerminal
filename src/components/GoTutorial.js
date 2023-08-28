import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GoTutorial.css';


const GoTutorial = ({ lectureId }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        if(lectureId) {
            axios.get(`http://localhost:3001/lecture/${lectureId}`)
                .then(response => {
                    setContent(response.data);
                })
                .catch(error => {
                    console.error('Error fetching lecture:', error);
                });
        }
    }, [lectureId]);

    return (
        <div className="go-tutorial" dangerouslySetInnerHTML={{ __html: content }} />
    );
}

export default GoTutorial;
