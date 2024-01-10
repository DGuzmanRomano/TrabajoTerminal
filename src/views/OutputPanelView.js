import React from 'react';
import '../styles/OutputPanel.css';  

const OutputPanel = ({ output }) => {
  return (
    <div className="output-panel">
      <div className="output-header">Salida del programa</div>
      <div className="output-content">
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default OutputPanel;