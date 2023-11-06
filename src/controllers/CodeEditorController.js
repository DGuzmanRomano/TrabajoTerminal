import React from 'react';
import CodeEditorView from '../views/CodeEditorView';

const CodeEditorController = ({ onExecute, code, setCode }) => {
 
    return <CodeEditorView code={code} setCode={setCode} />;

};

export default CodeEditorController;
