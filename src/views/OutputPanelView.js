import React from 'react';
import '../styles/OutputPanel.css';  


// OutputPanel component (React)
const OutputPanel = ({ output }) => {
  return (
    <div className="output-panel">
      <div className="output-header">Output</div>
      <div className="output-content">
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default OutputPanel;
