const QuizModel = require('./QuizModel');

class QuizController {
  constructor() {
    this.quizModel = new QuizModel();
  }

  async getQuiz(req, res) {
    try {
      const quizId = req.params.id; // Assuming the quiz ID is passed in the URL
      const quiz = await this.quizModel.getQuizById(quizId);

      // Assuming each question needs its options fetched as well
      for (const question of quiz) {
        question.options = await this.quizModel.getOptionsForQuestion(question.id);
      }

      res.json(quiz);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async submitQuiz(req, res) {
    try {
      const responses = req.body; // Assuming responses are sent in the request body
      const validationResults = await this.quizModel.validateResponses(responses);
      res.json(validationResults);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

module.exports = QuizController;
