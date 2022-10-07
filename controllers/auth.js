const Student = require('../models/student');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  const student = new Student(req.body);
  student.save((err, student) => {
    if (err) {
      return res.status(400).json({
        error: 'Not able to add student in the database.',
      });
    }
    res.json({
      name: student.name,
      lastname: student.lastname,
      email: student.email,
      id: student._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  Student.findOne({ email }, (err, student) => {
    if (err || !student) {
      return res.status(400).json({
        error: "Student's email doesnot exist",
      });
    }

    if (!student.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password donot match',
      });
    }
    // create token
    const token = jwt.sign({ _id: student._id }, process.env.SECRET);
    // put token in cookie
    res.cookie('token', token, { expire: new Date() + 9999 });
    // send response to frontend
    const { _id, name, email, role } = student;
    return res.json({
      token,
      student: {
        _id,
        name,
        email,
        role,
      },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Successfully signed out!' });
};

// protected routes
// exports.isSignedIn = expressJwt({
//   secret: process.env.SECRET,
//   userProperty: 'auth',
// });

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) return res.status(403).json({ error: 'Access denied' });
  next();
};

// exports.isAdmin = (req, res, next) => {
//   if (req.profile.role === 0)
//     return res
//       .status(403)
//       .json({ error: 'No Admin permissions found, access denied!' });
//   next();
// };
