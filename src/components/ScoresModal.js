import React from 'react';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Editor from '@monaco-editor/react';





const ScoresModal = ({ isOpen, onClose, quizzes, onQuizSelect, quizFeedback }) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Calificaciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {quizzes.map(quiz => (
                    <div key={quiz.quiz_id}>
                        <Button variant="outline-primary" onClick={() => onQuizSelect(quiz.quiz_id)}>
                            {quiz.quiz_name}: Score {quiz.quiz_score}
                        </Button>
                    </div>
                ))}
                {quizFeedback && quizFeedback.map((feedback, index) => (
                  <div key={index} className="feedback-item" style={{ backgroundColor: feedback.is_correct ? 'green' : 'red' }}>
                        <p>Pregunta {index + 1}: {feedback.question_text}</p>
                        {feedback.code_snippet && (
                            <Editor
                                width="100%"
                                height="150px"
                                language="go"
                                theme="vs-dark"
                                value={feedback.code_snippet}
                                options={{
                                    readOnly: true,
                                    selectOnLineNumbers: true,
                                    roundedSelection: false,
                                    cursorStyle: 'line',
                                    automaticLayout: true,
                                }}
                            />
                        )}
                        <p>Su respuesta: {feedback.user_answer}</p>
                        <p>Respuesta correcta: {feedback.correct_answer}</p>
                        <p>Explicación: {feedback.feedback || "No hay explicación proporcionada."}</p>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};



export default ScoresModal;

