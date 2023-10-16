const express = require('express');
const router = express.Router();

const {
  getStudent,
  getStudentByID,
  updateStudent,
} = require('../controllers/student');
const { isAuthenticated, isSignedIn } = require('../controllers/auth');

router.param('studentID', getStudentByID);
router.get('/student/:studentID', isSignedIn, isAuthenticated, getStudent);
router.put('/student/:studentID', isSignedIn, isAuthenticated, updateStudent);

module.exports = router;
