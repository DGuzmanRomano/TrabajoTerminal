import React from 'react';
import '../styles/GoTutorial.css';
import useLecture from '../controllers/useLecture'; 

const LectureView = ({ lectureId }) => {
    const { content, error } = useLecture(lectureId);

 
    return (
        <div className="lecture-view-container card go-tutorial">
          <div className="card-body">
            <div dangerouslySetInnerHTML={{ __html: content }} className="text-muted" />
          </div>
        </div>
      );
}

export default LectureView;
