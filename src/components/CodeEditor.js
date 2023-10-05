import React from 'react';
import AceEditor from 'react-ace';
import './CodeEditor.css';  

import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditor = (props) => {
  return (
    <div className="card h-100">
      <div className="card-body">
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
          style={{ width: '100%' }} // Assuming toolbar and header are 100px combined
        />
      </div>
    </div>
  );
}

export default CodeEditor;
