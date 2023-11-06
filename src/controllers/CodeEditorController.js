// controllers/CodeEditorController.js

import React from 'react';
import CodeEditorView from '../views/CodeEditorView';

const CodeEditorController = ({ onExecute, code, setCode }) => {
    // handle additional logic if necessary, e.g., local state updates

    return <CodeEditorView code={code} setCode={setCode} />;

};

export default CodeEditorController;
