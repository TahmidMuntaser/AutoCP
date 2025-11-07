const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  generateNewSolution,
  getSolution,
  deleteSolution
} = require('../controllers/generateSolutionController');

// All routes require authentication
router.use(authMiddleware);

// Generate new solution for a problem
router.post('/:problemId', generateNewSolution);

// Get solution for a problem
router.get('/:problemId', getSolution);

// Delete solution
router.delete('/:problemId', deleteSolution);

module.exports = router;
