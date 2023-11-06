// GoTutorial.js
import React from 'react';
import '../styles/GoTutorial.css';
import useLecture from '../controllers/useLecture'; // Assuming the hook is in the same directory

const LectureView = ({ lectureId }) => {
    const { content, error } = useLecture(lectureId);

    // You might want to handle the error state here as well

    return (
        <div className="lecture-view-container card go-tutorial">
          <div className="card-body">
            <div dangerouslySetInnerHTML={{ __html: content }} className="text-muted" />
          </div>
        </div>
      );
}

export default LectureView;
