import React from 'react';
import '../styles/OutputPanel.css';  

const OutputPanel = ({ output }) => {
  return (
    <div className="output-panel container-fluid mt-3">
      <p>Execution Output</p>
      <pre>{output}</pre>
    </div>
  );
}

export default OutputPanel;
