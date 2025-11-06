const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  generateNewProblem,
  getProblemHistory,
  getFavoriteProblems,
  toggleFavorite,
  getProblemById,
  deleteProblem
} = require('../controllers/generateProblemController');

// All routes require authentication
router.use(authMiddleware);

// Generate new problem
router.post('/', generateNewProblem);

// Get problem history
router.get('/history', getProblemHistory);

// Get favorite problems
router.get('/favorites', getFavoriteProblems);

// Get single problem by ID
router.get('/:id', getProblemById);

// Toggle favorite status
router.put('/:id/favorite', toggleFavorite);

// Delete problem
router.delete('/:id', deleteProblem);

module.exports = router;
