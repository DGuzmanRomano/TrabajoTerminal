import React, { useState } from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/theme-monokai';

const Quiz = () => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (index) => {
        setSelectedOption(index);
    };

    const renderOptions = (options) => {
        return options.map((option, index) => (
            <button
                key={index}
                className={`quiz-option-button ${selectedOption === index ? 'selected' : ''}`}
                onClick={() => handleOptionClick(index)}
            >
                {option}
            </button>
        ));
    };
    

    return (
        <div className="quiz-container">
            <p>What happens when you call report()?</p>
            <AceEditor
                mode="golang"
                theme="monokai"
                value={' fmt.Print("Write ", i, " as ")'}
                readOnly={true}
                height="150px"
                width="100%"
            />
            {renderOptions([
                'Two Strings are printed: "The current time is" and "The mood is"',
                'One String is printed: "The current time is 3pm"',
                'Three Strings are printed: "Beginning of report", "The current time is 3pm", "The mood is good"'
            ])}
        </div>
    );
};

export default Quiz;

