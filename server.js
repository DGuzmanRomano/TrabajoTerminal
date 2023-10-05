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

// Add an endpoint to fetch quiz by its ID
app.get('/quiz/:id', (req, res) => {
    const quizId = req.params.id;

    // Fetch the quiz question first
    const query = 'SELECT * FROM questions WHERE id = ?';
    db.query(query, [quizId], (err, quizResults) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }

        // If quiz question found, fetch its options
        if (quizResults.length > 0) {
            const optionsQuery = 'SELECT option_text, is_correct FROM options WHERE question_id = ?';
            db.query(optionsQuery, [quizId], (err, optionsResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error.');
                }

                // Add the options to the quiz question data and send
                quizResults[0].options = optionsResults;
                res.json(quizResults[0]);
            });
        } else {
            res.status(404).send('Quiz not found.');
        }
    });
});



app.get('/quiz/random/:id', (req, res) => {
    const topicId = req.params.id;

    // This SQL selects a random question for the given topic.
    const query = `SELECT * FROM questions WHERE topic = ? ORDER BY RAND() LIMIT 1`;
    db.query(query, [topicId], (err, quizResults) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }

        // If a quiz question is found, fetch its options
        if (quizResults.length > 0) {
            const selectedQuizId = quizResults[0].id;
            const optionsQuery = 'SELECT option_text, is_correct FROM options WHERE question_id = ?';
            db.query(optionsQuery, [selectedQuizId], (err, optionsResults) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Database error.');
                }

                // Add the options to the quiz question data and send the response
                quizResults[0].options = optionsResults;
                res.json(quizResults[0]);
            });
        } else {
            res.status(404).send('Quiz not found.');
        }
    });
});



app.post('/quiz/validate', (req, res) => {
    const quizId = req.body.quizId;
    const userAnswer = req.body.answer;

    const query = 'SELECT * FROM options WHERE question_id = ? AND is_correct = 1';
    db.query(query, [quizId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }

        const correctAnswer = results[0].option_text; // Adjust this if the correct answer is stored differently.
        if (userAnswer === correctAnswer) {
            res.json({ message: 'Correct!' });
        } else {
            res.json({ message: 'Incorrect. Please try again.' });
        }
    });
});
