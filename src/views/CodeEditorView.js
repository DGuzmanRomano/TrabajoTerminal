// components/CodeEditorView.js

import '../styles/CodeEditor.css'
import Editor from '@monaco-editor/react';

import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import '../styles/CodeEditor.css';


const CodeEditorView = ({ code, setCode }) => {
  // Options for the Monaco Editor
  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: true,
    theme: 'vs-dark', // Monaco's equivalent theme to Ace's monokai
    fontSize: 14,
    showPrintMargin: true, // Not directly available in Monaco, handled through options
    lineNumbersMinChars: true,
    renderLineHighlight: 'all',
    tabSize: 2,
    // Enable basic autocompletion, live autocompletion and snippets
    // These features require the respective providers to be configured in Monaco
    quickSuggestions: true,
    minimap: { enabled: false }, // To hide the minimap
    scrollBeyondLastLine: false, // To prevent scrolling beyond the last line
    fixedOverflowWidgets: true, // To fix widgets overflow behavior
  };

  // Handle editor change
  const handleEditorChange = (newValue, e) => {
    setCode(newValue);
  };

  return (
    <div className="code-editor-container">
      <Editor
        width="100%"
        //height="400px" // Set a fixed height or manage via CSS
        language="go"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CodeEditorView;
