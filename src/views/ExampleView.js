import React from 'react';

const ExampleView = ({ example }) => {
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      alert('Code copied to clipboard!'); // Or use a more sophisticated notification
    }, (err) => {
      alert('Failed to copy code: ', err);
    });
  };

  return (
    <div>
      <h2>{example.title}</h2>
      <pre>{example.code_example}</pre>
      <button onClick={() => copyToClipboard(example.code_example)}>Copiar</button>
      <p>{example.description}</p>
    </div>
  );
};

export default ExampleView;
