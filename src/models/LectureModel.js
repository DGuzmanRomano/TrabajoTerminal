// LectureModel.js
class LectureModel {




    static getLectureById(db, lectureId) {
      return new Promise((resolve, reject) => {
        const query = 'SELECT text FROM lectures WHERE id = ?';
        db.query(query, [lectureId], (err, results) => {
          if (err) {
            return reject(err);
          }
          resolve(results.length > 0 ? results[0].text : null);
        });
      });
    }







  }
  module.exports = LectureModel;
  