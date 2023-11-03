const mysql = require('mysql2/promise');

class QuizModel {
  constructor() {
    // Setup the database connection here
    this.db = mysql.createPool({
        host: 'localhost',
        user: 'd',
        password: 'qazwsx123456',
        database: 'tt'
    });
  }

  async getQuizById(quizId) {
    const query = `
      SELECT questions.*
      FROM questions
      INNER JOIN quiz_question ON questions.id = quiz_question.question_id
      WHERE quiz_question.quiz_id = ?;
    `;

    try {
      const [quizResults] = await this.db.query(query, [quizId]);
      return quizResults;
    } catch (error) {
      throw error;
    }
  }

  async getOptionsForQuestion(questionId) {
    const optionsQuery = 'SELECT option_text, is_correct FROM options WHERE question_id = ?';
    try {
      const [optionsResults] = await this.db.query(optionsQuery, [questionId]);
      return optionsResults;
    } catch (error) {
      throw error;
    }
  }

  async validateResponses(responses) {
    let correctCount = 0;
    let feedback = [];

    const checkAnswersPromises = responses.map(async (responseObj) => {
      const questionId = responseObj.questionId;
      const userAnswer = responseObj.answer;

      const query = 'SELECT option_text FROM options WHERE question_id = ? AND is_correct = 1';

      try {
        const [results] = await this.db.query(query, [questionId]);
        const correctOptionText = results[0]?.option_text;
        if (correctOptionText && userAnswer === correctOptionText) {
          correctCount++;
        }
        feedback.push({
          questionId: questionId,
          correctOption: correctOptionText,
          userOption: userAnswer
        });
      } catch (error) {
        throw error;
      }
    });

    await Promise.all(checkAnswersPromises);
    return { correctCount, feedback };
  }
}

module.exports = QuizModel;
