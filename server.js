const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2')
const codeExecutionRoute = require('./CodeExecution.js'); 


const app = express();


app.use(cors()); // Use CORS
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'd',
    password: 'qazwsx123456',
    database: 'tt'
});

/*
const db = mysql.createConnection({
    host: 'localhost',
    user: 'rdguzmanromano',
    password: '123456',
    database: 'tt'
});*/

db.connect((err) => {
    if(err) throw err;
    console.log('Connected to the MySQL database.');
});




app.post('/execute', codeExecutionRoute.executeCode);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});



app.get('/lecture/:id', (req, res) => {
    const lectureId = req.params.id;

    const query = 'SELECT text FROM lectures WHERE id = ?';
    db.query(query, [lectureId], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }

        if (results.length > 0) {
            res.json(results[0].text);
        } else {
            res.status(404).send('Lecture not found.');
        }
    });
});


app.get('/quiz/all/:id', (req, res) => {
    const quizId  = req.params.id;

    const query = `SELECT questions.*
    FROM questions
    INNER JOIN quiz_question ON questions.id = quiz_question.question_id
    WHERE quiz_question.quiz_id = ?;`;
    db.query(query, [quizId ], (err, quizResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }

        const allQuizzes = [];
        let completedQueries = 0;

        quizResults.forEach(quiz => {
            const optionsQuery = 'SELECT option_text, is_correct FROM options WHERE question_id = ?';
            db.query(optionsQuery, [quiz.id], (err, optionsResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error.');
                }
                quiz.options = optionsResults;
                allQuizzes.push(quiz);
                completedQueries++;

                if (completedQueries === quizResults.length) {
                    res.json(allQuizzes);
                }
            });
        });
    });
});


app.post('/quiz/validateAll', async (req, res) => {
   
});






app.get('/api/quiz', (req, res) => {
    const query = `
      SELECT q.*, o.option_text, o.is_correct
      FROM questions q
      JOIN options o ON q.id = o.question_id
    `;
    db.query(query, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
  


  app.get('/api/topics', (req, res) => {
    const query = 'SELECT topic_name FROM topics';
    db.query(query, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        const topics = results.map(result => result.topic_name);
        res.json(topics);
    });
});


app.get('/api/quizzes', (req, res) => {
    const query = 'SELECT quiz_id, quiz_name FROM quizzes';
    db.query(query, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        res.json(results);
    });
});


app.get('/api/examples', (req, res) => {
    const query = 'SELECT title FROM examples';
    db.query(query, (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        const titles = results.map(result => result.title);
        res.json(titles);
    });
});



app.get('/api/examples/:id', (req, res) => {
    const query = 'SELECT * FROM examples WHERE id_example = ?';
    db.query(query, [req.params.id], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        res.json(results[0]);
    });
});
















app.post('/submit-quiz', async (req, res) => {
    const { quizId, userResponses } = req.body; // assuming your payload contains these

    try {
        const questions = await getQuestionsWithAnswers(quizId);
        const score = calculateScore(questions, userResponses);
        res.json({ score });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).send('Error submitting quiz');
    }
});

async function getQuestionsWithAnswers(quizId) {
    const [questions] = await db.promise().query(`
        SELECT q.id, q.question_text, q.question_type, q.code_snippet, q.feedback, 
               o.option_text, o.is_correct 
        FROM questions q
        JOIN options o ON q.id = o.question_id
        WHERE q.id = ? AND o.is_correct = 1
    `, [quizId]);

    return questions;
}

function calculateScore(questions, userResponses) {
    let score = 0;

    // We iterate over the user responses
    userResponses.forEach(userResponse => {
        // Find the question that matches the current user response
        const question = questions.find(q => q.id.toString() === userResponse.questionId);

        // If it's a multiple-choice question, compare option_text
        if (question && question.question_type === 'multiple_choice') {
            // Check if the answer is an object with option_text (for MCQs)
            if (userResponse.answer.option_text && userResponse.answer.option_text === question.option_text) {
                score++;
            }
        }
        // For text answers, just compare the answer strings
        else if (question && question.question_type === 'text_answer') {
            // Check if the answer is a string (for text answers)
            if (userResponse.answer === question.option_text) {
                score++;
            }
        }
    });

    return score;
}





app.get('/examples', (req, res) => {
    const query = "SELECT example_id, example_code, example_title, example_description FROM examples";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching examples from database');
            return;
        }
        res.json(results);
    });
});