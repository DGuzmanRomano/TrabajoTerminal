// components/CodeEditorView.js

import React from 'react';
import AceEditor from 'react-ace';
import '../styles/CodeEditor.css'

import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditorView = ({ code, setCode }) => {
    return (
        <div className="code-editor-container">
        <AceEditor
            mode="golang"
            theme="monokai"
            name="codeEditor"
            onChange={setCode}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={code}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
            }}
        />
         </div>
    );
};

export default CodeEditorView;
