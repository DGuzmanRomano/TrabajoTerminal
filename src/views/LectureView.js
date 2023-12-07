import React from 'react';
import '../styles/GoTutorial.css';
import useLecture from '../controllers/useLecture'; 

const LectureView = ({ lectureId, content }) => {
  const { content: fetchedContent, error } = useLecture(lectureId);

 
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

export default LectureView;
