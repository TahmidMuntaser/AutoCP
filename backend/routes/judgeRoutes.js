const express = require('express');
const router = express.Router();
const {
  submitSolution,
  getSubmissionStatus,
  getProblemSubmissions,
  getUserSubmissions
} = require('../controllers/judgeController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Submit solution
router.post('/submit', submitSolution);

// Get submission status by ID
router.get('/submission/:submissionId', getSubmissionStatus);

// Get all submissions for a specific problem
router.get('/problem/:problemId/submissions', getProblemSubmissions);

// Get all user submissions
router.get('/submissions', getUserSubmissions);

module.exports = router;
