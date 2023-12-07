import React, { useState } from 'react';
import './App.css';
import Toolbar from './views/ToolbarView';
import './styles/OutputPanel.css';
import LectureView from './views/LectureView';
import OutputPanel from './views/OutputPanelView';
import CodeEditorController from './controllers/CodeEditorController';

import UserContext from './components/UserContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';






function App() {
    const [code, setCode] = useState('');
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [output, setOutput] = useState('');
    const [user, setUser] = useState(null);
    const [lectureContent, setLectureContent] = useState('');


    const handleExecute = async (codeToExecute) => {
        const requestBody = { content: codeToExecute };
        try {
            const response = await fetch('http://localhost:3001/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });
    
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.details || `HTTP error! status: ${response.status}`);
            }
    
            setOutput(result.output);
        } catch (error) {
            console.error('Error executing code:', error);
            setOutput(error.message);
        }
    };

    
    const handleProfessorAction = (actionType) => {
        if (actionType === 'action1') {
            // Handle action 1
            setLectureContent('createLecture');


        } else if (actionType === 'action2') {
            // Handle action 2
            // ...additional logic for action 2
        }
        // Add more cases for other actions as needed
    };
    

    const handleLectureSelection = (lectureId) => {
        setSelectedLecture(lectureId);
        setLectureContent(''); // Reset the content when a lecture is selected
    };
    


    return (
        <UserContext.Provider value={{ user, setUser }}>
            <div className="App">
            <Toolbar 
                user={user} 
                onLectureSelect={handleLectureSelection} // Pass this new function to Toolbar
                onExecute={() => handleExecute(code)} 
                onProfessorAction={handleProfessorAction}
            />
                
                <div className="content container-fluid">
                    <div className="row h-100">
                        <div className="col-md-6">
                            <CodeEditorController onExecute={handleExecute} code={code} setCode={setCode} />
                        </div>
                        <div className="col-md-6">
                        <LectureView lectureId={selectedLecture} content={lectureContent} /> {/* Pass content to LectureView */}
                        </div>
                    </div>
                </div>

                <div className="output-container">
                    <OutputPanel output={output} />
                </div>
            </div>
        </UserContext.Provider>
    );
}

export default App;