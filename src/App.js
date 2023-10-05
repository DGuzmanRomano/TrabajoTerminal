import React, { useState } from 'react';
import './App.css';
import Toolbar from './components/Toolbar';  
import CodeEditor from './components/CodeEditor';
import GoTutorial from './components/GoTutorial';
import OutputPanel from './components/OutputPanel'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import axios from 'axios';

function App() {
    const [code, setCode] = useState('');
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [output, setOutput] = useState('');  // New state for storing execution output

    const handleExecute = () => {
        axios.post('http://localhost:3001/execute', { content: code })
            .then(response => {
                if (response.data.error) {
                    setOutput(response.data.error);

                } 
                else {
                setOutput(response.data.output);
                }
            })

            .catch(error => {
                console.error('Error executing code:', error);
            
                if (error.response && error.response.data && error.response.data.details) {
                    setOutput(error.response.data.details);
                } else {
                    console.error('Unexpected error:', error.message);
                }
            });
            
    };

    return (
        <div className="App">
            <Toolbar onLectureSelect={setSelectedLecture} onExecute={handleExecute} />
    
            <div className="content container-fluid">
                <div className="row">
                    <div className="col-md-6 h-100">
                        <CodeEditor value={code} onChange={setCode} />
                    </div>
                    <div className="col-md-6 h-100">
                        <GoTutorial lectureId={selectedLecture} />
                    </div>
                </div>
            </div>
    
            <div className="output-container">
                <OutputPanel output={output} />
            </div>
        </div>
    );
}

export default App;
