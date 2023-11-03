// LectureController.js
const LectureModel = require('../models/LectureModel');

exports.getLecture = (req, res) => {
  const lectureId = req.params.id;
  LectureModel.getLectureById(db, lectureId)
    .then(lecture => {
      if (lecture) {
        res.json(lecture);
      } else {
        res.status(404).send('Lecture not found.');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Database error.');
    });
};
