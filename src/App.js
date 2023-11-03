import React, { useState } from 'react';
import './App.css';
import Toolbar from './components/Toolbar';
import CodeEditor from './components/CodeEditor';
import LectureView from './views/LectureView';
import OutputPanel from './components/OutputPanel';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { executeCode } from './controllers/CodeExecutionController'; // This would be your new controller

function App() {
    const [code, setCode] = useState('');
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [output, setOutput] = useState('');

    const handleExecute = async () => {
        try {
            const response = await executeCode(code);
            setOutput(response.output);
        } catch (error) {
            console.error('Error executing code:', error);
            setOutput(error.message);
        }
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
                        <LectureView lectureId={selectedLecture} /> {/* Updated component name */}
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
