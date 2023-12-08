import React, { useState, useContext } from 'react';

import '../styles/GoTutorial.css';
import useLecture from '../controllers/useLecture'; 
import UserContext from '../components/UserContext';

const LectureView = ({ lectureId, content }) => {
    const { content: fetchedContent, error } = useLecture(lectureId);
    const [lectureTitle, setLectureTitle] = useState('');
    const [lectureText, setLectureText] = useState('');
    const { user } = useContext(UserContext);

    const [showSuccess, setShowSuccess] = useState(false);
    const [titleValidation, setTitleValidation] = useState('');
    const [textValidation, setTextValidation] = useState('');
    


    const handleLectureSubmit = async () => {


        setTitleValidation('');
        setTextValidation('');
    
        let isValid = true;
    
        if (!lectureTitle.trim()) {
            setTitleValidation('Lecture title is required.');
            isValid = false;
        }
    
        if (!lectureText.trim()) {
            setTextValidation('Lecture content is required.');
            isValid = false;
        }
    
        if (!isValid) {
            return; // Stop the function if validation fails
        }




      const lectureData = {
          title: lectureTitle,
          text: lectureText,
          authorId: user.id 
      };
  
      try {
          const response = await fetch('http://localhost:3001/add-lecture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(lectureData)
          });
  
          if (!response.ok) {
              throw new Error('Failed to submit lecture');
          }
  
          const result = await response.json();
          console.log(result.message); // Or handle this in the UI
          // Reset form or update UI as needed
          setLectureTitle('');
          setLectureText('');
          setShowSuccess(true); 
          setTimeout(() => setShowSuccess(false), 3000);


      } catch (error) {
          console.error('Error submitting lecture:', error);
          // Handle error in the UI
          setShowSuccess(false); 
      }
  };




    if (content === 'createLecture') {
        return (
            <div className="lecture-view-container card go-tutorial">
                <div className="card-body">
                    {showSuccess && (
                        <div className="alert alert-success" role="alert">
                            Lecture submitted successfully!
                        </div>
                    )}
                    <div>
                        <p>Write a lecture title:</p>
                        <input type="text" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
                        {titleValidation && <div className="text-danger">{titleValidation}</div>}
                    </div>
                    <div>
                        <p>Lecture content:</p>
                        <textarea value={lectureText} onChange={(e) => setLectureText(e.target.value)} />
                        {textValidation && <div className="text-danger">{textValidation}</div>}
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

















