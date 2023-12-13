const db = require('./server.js');

const authenticate = (email, password, callback) => {
    const query = `
    SELECT student_id AS id_user, student_name AS user_name, 'student' AS user_role 
    FROM students 
    WHERE student_email = ? AND student_password = ?
    UNION
    SELECT professor_id AS id_user, professor_name AS user_name, 'professor' AS user_role 
    FROM professors 
    WHERE professor_email = ? AND professor_password = ?
`;

db.query(query, [email, password, email, password], (err, results, fields) => {
    if (err) {
        return callback(err, null);
    }

    if (results.length > 0) {
        const user = results[0];
        return callback(null, user);
    } else {
        return callback(null, null);
    }
});
};

module.exports = {
authenticate
};
