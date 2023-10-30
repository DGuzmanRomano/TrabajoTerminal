const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const { exec } = require('child_process');


const app = express();
const PORT = 3001;
const codeController = require('./src/controllers/CodeController');
const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'd',
    password: 'qazwsx123456',
    database: 'tt'
});

db.connect((err) => {
    if(err) throw err;
    console.log('Connected to the MySQL database.');
});


// To handle POST request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes (For development purposes only, adjust for production)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.post('/execute', codeController.executeCode);

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
    const topicId = req.params.id;

    // Modify the query to select feedback column as well
    const query = `SELECT * FROM questions WHERE topic = ?`;
    db.query(query, [topicId], (err, quizResults) => {
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



app.post('/quiz/validateAll', (req, res) => {
    const responses = req.body.responses;
    let correctCount = 0;
    let feedback = [];

    const checkAnswers = responses.map((responseObj) => {
        return new Promise((resolve, reject) => {
            const questionId = responseObj.questionId;
            const userAnswer = responseObj.answer;

            const query = 'SELECT option_text FROM options WHERE question_id = ? AND is_correct = 1';

            db.query(query, [questionId], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    const correctOptionText = results[0].option_text;
                    if (correctOptionText && userAnswer === correctOptionText) {
                        correctCount++;
                    }
                    feedback.push({
                        questionId: questionId,
                        correctOption: correctOptionText,
                        userOption: userAnswer
                    });
                    resolve();
                }
            });
        });
    });

    Promise.all(checkAnswers).then(() => {
        res.json({ correctCount, feedback });
    }).catch(err => {
        console.error(err);
        res.status(500).send('Database error.');
    });
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
