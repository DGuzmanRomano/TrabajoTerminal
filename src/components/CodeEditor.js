import React from 'react';
import AceEditor from 'react-ace';
import './CodeEditor.css';  

import 'ace-builds/src-noconflict/mode-golang'; // mode for golang
import 'ace-builds/src-noconflict/theme-monokai'; // theme

const CodeEditor = (props) => {
  return (
    <AceEditor
      mode="golang"
      theme="monokai"
      onChange={props.onChange}
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={props.value}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
      style={{ width: '100%', height: 'calc(100vh - 240px)' }} // Assuming toolbar and header are 100px combined
    />
  );
}

export default CodeEditor;
