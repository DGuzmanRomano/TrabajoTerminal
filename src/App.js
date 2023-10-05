import React, { useState } from 'react';
import './App.css';
import SplitPane from 'react-split-pane';
import Toolbar from './components/Toolbar';  
import CodeEditor from './components/CodeEditor';
import GoTutorial from './components/GoTutorial';
import OutputPanel from './components/OutputPanel'; 

import 'bootstrap/dist/css/bootstrap.min.css';

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
           <div><Toolbar onLectureSelect={setSelectedLecture} onExecute={handleExecute} /></div> 

         

            <div className="content">

            <SplitPane split="vertical" minSize={50} defaultSize="50%">
                
            <div><CodeEditor value={code} onChange={setCode} /></div>
      
            <div> <GoTutorial lectureId={selectedLecture} /></div>
                </SplitPane>
            </div>
            
            <div> <OutputPanel output={output} />  </div>
           
        </div>
    );
}

export default App;
