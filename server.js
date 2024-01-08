const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2')
const codeExecutionRoute = require('./CodeExecution.js'); 
const https = require('https');

const app = express();


app.use(cors()); // Use CORS
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


/*

const db = mysql.createConnection({
    host: '34.125.183.229',
    user: 'd',
    password: 'qazwsx123456',
    database: 'tt'
});
*/

const db = mysql.createPool({
    host: '34.125.183.229',
    user: 'root',
    password: '123456',
    database: 'tt',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});

app.get('/api/lectures', (req, res) => {
    const query = 'SELECT lecture_id, lecture_title FROM lectures';
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        res.json(results); 
    });
});


app.post('/execute', codeExecutionRoute.executeCode);



app.get('/api/user-lectures', (req, res) => {
    const userId = req.query.userId;
    const userRole = req.query.userRole;

    let query;
    if (userRole === 'professor') {
        query = 'SELECT DISTINCT lecture_id, lecture_title FROM lectures WHERE author_id = 1 OR author_id = ?';
    } else if (userRole === 'student') {
        query = `
            (
                SELECT DISTINCT lecture_id, lecture_title
                FROM lectures
                WHERE author_id = 1
            )
            UNION
            (
                SELECT DISTINCT l.lecture_id, l.lecture_title
                FROM lectures l
                JOIN students s ON l.author_id = s.professor_id
                WHERE s.student_id = ?
            )
            ORDER BY lecture_title
        `;
    }
    
    
    
    else {
        return res.status(400).send('Invalid user role.');
    }

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        res.json(results);
    });
});





app.get('/lecture/:id', (req, res) => {
    const lectureId = req.params.id;

    const query = 'SELECT lecture_text FROM lectures WHERE lecture_id = ?';
    db.query(query, [lectureId], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }

        if (results.length > 0) {
            res.json(results[0].lecture_text);
        } else {
            res.status(404).send('Lecture not found.');
        }
    });
});



app.delete('/delete-lecture/:lectureId', (req, res) => {
    const { lectureId } = req.params;
    db.query('DELETE FROM lectures WHERE lecture_id = ?', [lectureId], (err, result) => {
        if (err) {
            res.status(500).send({ message: 'Error deleting lecture' });
        } else {
            res.send({ message: 'Lecture deleted successfully' });
        }
    });
});


////////////////////////////////////////////////////



app.get('/quiz/all/:id', (req, res) => {
    const quizId = req.params.id;

    const query = 'SELECT * FROM questions WHERE quiz_id = ?;';
    db.query(query, [quizId], (err, quizResults) => {
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
  



  app.get('/api/quizzes', (req, res) => {
    const userId = req.query.userId;
    const userRole = req.query.userRole;
    let query;

    if (userRole === 'professor') {
        query = `
            SELECT DISTINCT quiz_id, quiz_name FROM quizzes
            WHERE author_id = 1 OR author_id = ?
        `;
    } else if (userRole === 'student') {
        query = `
            (
                SELECT DISTINCT quiz_id, quiz_name
                FROM quizzes
                WHERE author_id = 1
            )
            UNION
            (
                SELECT DISTINCT q.quiz_id, q.quiz_name
                FROM quizzes q
                JOIN students s ON q.author_id = s.professor_id
                WHERE s.student_id = ?
            )
           
        `;
    } else {
        return res.status(400).send('Invalid user role.');
    }

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error.');
        }
        res.json(results);
    });
});





app.post('/submit-quiz', async (req, res) => {
    const { quizId, userResponses, studentId } = req.body;

    try {
        const questions = await getQuestionsWithAnswers(quizId);

        // Fetch total number of questions for this quiz
        const totalQuestionsQuery = 'SELECT COUNT(*) AS total FROM questions WHERE quiz_id = ?';
        const [totalQuestionsResult] = await db.promise().query(totalQuestionsQuery, [quizId]);
        const totalQuestions = totalQuestionsResult[0].total;

        const score = calculateScore(questions, userResponses, totalQuestions);


        // Insert responses if the user is a student
        if (studentId) {
            await Promise.all(userResponses.map(response => {
                const { questionId, answer } = response;
                const responseQuery = `
                    INSERT INTO quiz_responses (question_id, question_answer, quiz_id, student_id)
                    VALUES (?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                    question_answer = VALUES(question_answer), quiz_id = VALUES(quiz_id)`;
                return db.promise().query(responseQuery, [questionId, typeof answer === 'object' ? answer.option_text : answer, quizId, studentId]);
            }));






            // Insert/update quiz status and score
            const quizStatusQuery = 'INSERT INTO quiz_status (student_id, quiz_id, quiz_status, quiz_score) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quiz_status = ?, quiz_score = ?';
            await db.promise().query(quizStatusQuery, [studentId, quizId, 1, score, 1, score]);
        }

        res.json({ score });
        
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).send('Error submitting quiz');
    }
});





async function getQuestionsWithAnswers(quizId) {
    const queryString = `
        SELECT q.id, q.question_text, q.question_type, q.code_snippet, q.feedback, 
               o.option_text, o.is_correct 
        FROM questions q
        JOIN options o ON q.id = o.question_id
        WHERE q.quiz_id = ? AND o.is_correct = 1
    `;
    const [questions] = await db.promise().query(queryString, [quizId]);
    console.log("Questions fetched from DB:", questions);
    return questions;
}



function calculateScore(questions, userResponses, totalQuestions) {
    let correctCount = 0;

    userResponses.forEach(userResponse => {
        const question = questions.find(q => q.id.toString() === userResponse.questionId.toString());

        if (!question) {
            console.log('Question not found, skipping...');
            return;
        }

        let userAnswer = userResponse.answer;
        if (typeof userAnswer === 'object' && userAnswer.option_text !== undefined) {
            userAnswer = userAnswer.option_text;
        }

        // Handle multiple choice and true/false questions
        if ((question.question_type === 'multiple_choice' || question.question_type === 'true_false') && 
            userAnswer === question.option_text) {
            correctCount++;
        }
        // Handle text answer questions
        else if (question.question_type === 'text_answer' && 
                 userAnswer.toLowerCase().trim() === question.option_text.toLowerCase().trim()) {
            correctCount++;
        }
    });

    let scorePercentage = (correctCount / totalQuestions) * 100;
    return Math.round(scorePercentage); // Round to nearest integer
}







app.get('/examples', (req, res) => {
    const query = "SELECT example_id, example_code, example_title FROM examples";
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching examples from database');
            return;
        }
        res.json(results);
    });
});






app.post('/login', (req, res) => {
    const { email, password } = req.body;

        const query = `
        SELECT student_id AS id_user, student_name AS user_name, 'student' AS user_role 
        FROM students 
        WHERE student_email = ? AND student_password = ?
        UNION
        SELECT professor_id AS id_user, professor_name AS user_name, 'professor' AS user_role 
        FROM professors 
        WHERE professor_email = ? AND professor_password = ?
    `;

    db.execute(query, [email, password, email, password], (err, results, fields) => {
        if (err) {
           
            console.error('Error during database query', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

      
        if (results.length > 0) {
            const user = results[0];
            return res.json({
                success: true,
                id: user.id_user,
                name: user.user_name,
                role: user.user_role
            });
        } else {
           
            return res.status(401).json({ success: false, message: 'Incorrect email or password' });
        }
    });
});







const addLecture = (req, res) => {
    const { title, text, authorId } = req.body; 

    const query = `
        INSERT INTO lectures (lecture_title, lecture_text, author_id)
        VALUES (?, ?, ?)
    `;

    db.execute(query, [title, text, authorId], (err, results) => {
        if (err) {
            console.error('Error adding lecture to the database:', err);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        res.json({ success: true, message: 'Lecture added successfully', lectureId: results.insertId });
    });
};

app.post('/add-lecture', addLecture);



///////////////////////////////////////////////////////////////



app.get('/user-quizzes/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const query = `
            SELECT qz.quiz_id, qz.quiz_name, qs.quiz_score
            FROM quizzes qz
            JOIN quiz_status qs ON qz.quiz_id = qs.quiz_id
            WHERE qs.student_id = ? AND qs.quiz_status = 1
        `;
        const [quizzes] = await db.promise().query(query, [userId]);
        res.json(quizzes);
    } catch (error) {
        console.error('Error fetching user quizzes:', error);
        res.status(500).send('Error fetching user quizzes');
    }
});


app.get('/quiz-responses/:userId/:quizId', async (req, res) => {
    const { userId, quizId } = req.params;

    try {
        const query = `
            SELECT qr.question_id, qr.question_answer
            FROM quiz_responses qr
            WHERE qr.student_id = ? AND qr.quiz_id = ?
        `;
        const [responses] = await db.promise().query(query, [userId, quizId]);
        res.json(responses);
    } catch (error) {
        console.error('Error fetching quiz responses:', error);
        res.status(500).send('Error fetching quiz responses');
    }
});



app.get('/quiz-feedback/:userId/:quizId', async (req, res) => {
    const { userId, quizId } = req.params;

    try {
        const query = `
            SELECT q.question_text, q.code_snippet, qr.question_answer AS user_answer, 
                   qo.option_text AS correct_answer, q.feedback, 
                   (qr.question_answer = qo.option_text) AS is_correct
            FROM quiz_responses qr
            JOIN questions q ON qr.question_id = q.id
            JOIN options qo ON q.id = qo.question_id AND qo.is_correct = 1
            WHERE qr.student_id = ? AND qr.quiz_id = ?
        `;
        const [feedbackDetails] = await db.promise().query(query, [userId, quizId]);
        res.json(feedbackDetails);
    } catch (error) {
        console.error('Error fetching quiz feedback:', error);
        res.status(500).send('Error fetching quiz feedback');
    }
});



























app.post('/add-question', async (req, res) => {
    const { quizName, professorId, questions } = req.body;

    try {
        // Insert the quiz and get its ID
        const [quizResult] = await db.promise().execute(
            'INSERT INTO quizzes (quiz_name, author_id) VALUES (?, ?)',
            [quizName, professorId]
        );
        const quizId = quizResult.insertId;

        // Insert questions and answers
        for (const { question, type, codeSnippet, feedback, answers } of questions) {
            const [questionResult] = await db.promise().execute(
                'INSERT INTO questions (question_text, question_type, code_snippet, feedback, quiz_id) VALUES (?, ?, ?, ?, ?)',
                [question, type, codeSnippet, feedback, quizId]
            );
            const questionId = questionResult.insertId;

            // Insert answers for each question
            for (const { text, is_correct } of answers) {
                await db.promise().execute(
                    'INSERT INTO options (option_text, question_id, is_correct) VALUES (?, ?, ?)',
                    [text, questionId, is_correct]
                );
            }
        }

        // Fetch students associated with the professor
        const [students] = await db.promise().execute(
            'SELECT student_id FROM students WHERE professor_id = ?',
            [professorId]
        );

        // Insert records into quiz_status for each student
        for (const student of students) {
            await db.promise().execute(
                'INSERT INTO quiz_status (quiz_id, student_id, quiz_status) VALUES (?, ?, ?)',
                [quizId, student.student_id, 0]
            );
        }

        res.json({ success: true, message: 'Quiz, questions, and answers submitted successfully' });
    } catch (error) {
        console.error('Error in /add-question endpoint:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});