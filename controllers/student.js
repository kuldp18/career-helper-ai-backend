const Student = require('../models/student');

exports.getStudentByID = (req, res, next, id) => {
  Student.findById(id).exec((err, student) => {
    if (err || !student) {
      return res.status(400).json({
        error: 'No user was found in DB.',
      });
    }
    req.profile = student;
    next();
  });
};

exports.getStudent = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encrypted_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateStudent = (req, res) => {
  Student.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, student) => {
      if (err) {
        return res.status(400).json({
          error: 'You are not authorized to update.',
        });
      }
      student.salt = undefined;
      student.encrypted_password = undefined;
      res.json(student);
    }
  );
};
