import React, { useState, useEffect } from 'react';
import './App.css';
import Toolbar from './views/ToolbarView';
import './styles/OutputPanel.css';
import LectureView from './views/LectureView';
import OutputPanel from './views/OutputPanelView';
import CodeEditorController from './controllers/CodeEditorController';
import LoginModal from './components/LoginModal'; 
import UserContext from './components/UserContext';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';






function App() {
    const [code, setCode] = useState('');
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [output, setOutput] = useState('');
    const [user, setUser] = useState(null);
    const [lectureContent, setLectureContent] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);





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



    
    useEffect(() => {
        setShowLoginModal(!user);
    }, [user]);



    const handleProfessorAction = (actionType) => {
        if (actionType === 'action1') {
            // Handle action 1
            setLectureContent('createLecture');


        } else if (actionType === 'action2') {
            
            setLectureContent('createQuestion');
        }
        // Add more cases for other actions as needed
    };
    

    const handleLectureSelection = (lectureId) => {
        setSelectedLecture(lectureId);
        setLectureContent(''); // Reset content state if needed
    };
    
    
const handleFileSelect = (fileContent) => {
    setCode(fileContent); // Update the code state with the file content
};




const handleLogin = (email, password) => {
    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`User: ${data.name}, Role: ${data.role}`);
            setShowLoginModal(false); // Corrected this line
            setUser({ id: data.id, name: data.name, role: data.role });
        } else {
            // Handle login failure
            console.error('Login failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
    });
};




return (
    <UserContext.Provider value={{ user, setUser }}>
        <div className="App">
            <Toolbar 
                user={user} 
                onLectureSelect={handleLectureSelection} 
                onExecute={() => handleExecute(code)} 
                onProfessorAction={handleProfessorAction}
                onFileSelect={handleFileSelect}
                code={code}
            />
            
            <div className="content container-fluid">
                <div className="row h-100">
                    <div className="col-md-6">
                        <CodeEditorController onExecute={handleExecute} code={code} setCode={setCode} />
                    </div>
                    <div className="col-md-6">
                        <LectureView lectureId={selectedLecture} content={lectureContent} />
                    </div>
                </div>
            </div>

            <div className="output-container">
                <OutputPanel output={output} />
            </div>

            <LoginModal 
                isOpen={showLoginModal} 
                onClose={() => setShowLoginModal(false)} 
                onLogin={handleLogin} 
            />
        </div>
    </UserContext.Provider>
);
}

export default App;