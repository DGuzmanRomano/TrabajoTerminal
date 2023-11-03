const express = require('express');
const QuizController = require('./QuizController');

const router = express.Router();
const quizController = new QuizController();

// Route to get a quiz by ID
router.get('/quiz/:id', quizController.getQuiz.bind(quizController));

// Route to submit quiz answers
router.post('/quiz/submit', quizController.submitQuiz.bind(quizController));

module.exports = router;
