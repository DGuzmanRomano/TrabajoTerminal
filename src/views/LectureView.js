import React, { useState } from 'react';
import '../styles/GoTutorial.css';
import useLecture from '../controllers/useLecture'; 


const LectureView = ({ lectureId, content }) => {
    const { content: fetchedContent, error } = useLecture(lectureId);
    const [lectureTitle, setLectureTitle] = useState('');
    const [lectureText, setLectureText] = useState('');

    const handleLectureSubmit = () => {
        // Handle the submission logic here
        console.log('Lecture Title:', lectureTitle);
        console.log('Lecture Content:', lectureText);
        // Here you would typically make an API call to save the lecture
    };

    if (content === 'createLecture') {
        return (
            <div className="lecture-view-container card go-tutorial">
                <div className="card-body">
                    <div>
                        <p>Write a lecture title:</p>
                        <input type="text" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
                    </div>
                    <div>
                        <p>Lecture content:</p>
                        <textarea value={lectureText} onChange={(e) => setLectureText(e.target.value)} />
                    </div>
                    <button onClick={handleLectureSubmit}>Submit</button>
                </div>
            </div>
        );
    }
    else {
    return (
      <div className="lecture-view-container card go-tutorial">
        <div className="card-body">

        {content ? 
            <div className="text-muted">{content}</div> : // Manually set content
            <div dangerouslySetInnerHTML={{ __html: fetchedContent }} className="text-muted" /> // Fetched content
          }

        </div>
      </div>
    );

  }
};

export default LectureView;

















