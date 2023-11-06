import React, { useState } from 'react';
import './App.css';
import Toolbar from './views/ToolbarView';
import './styles/OutputPanel.css';
import LectureView from './views/LectureView';
import OutputPanel from './views/OutputPanelView';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import CodeEditorController from './controllers/CodeEditorController';

function App() {
    const [code, setCode] = useState('');
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [output, setOutput] = useState('');

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
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            setOutput(result.output);
        } catch (error) {
            console.error('Error executing code:', error);
            setOutput(error.message);
        }
    };

    return (
        <div className="App">
           <Toolbar onLectureSelect={setSelectedLecture} onExecute={() => handleExecute(code)} />
    
           <div className="content container-fluid">
                <div className="row h-100">
                    <div className="col-md-6">
                        <CodeEditorController onExecute={handleExecute} code={code} setCode={setCode} />
                    </div>
                    <div className="col-md-6">
                        <LectureView lectureId={selectedLecture} /> 
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
