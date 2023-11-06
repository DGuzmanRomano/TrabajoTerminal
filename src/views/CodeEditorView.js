// components/CodeEditorView.js

import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-monokai';

const CodeEditorView = ({ code, setCode }) => {
    return (
        <AceEditor
            mode="golang"
            theme="monokai"
            name="codeEditor"
            onChange={newCode => setCode(newCode)}
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
    );
};

export default CodeEditorView;
