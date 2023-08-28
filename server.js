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
