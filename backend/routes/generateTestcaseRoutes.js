const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  generateNewTestcases,
  getTestcases,
  deleteTestcases,
  regenerateTestcases
} = require('../controllers/generateTestcaseController');

// All routes require authentication
router.use(authMiddleware);

// Generate testcases for a problem
router.post('/generate/:problemId', generateNewTestcases);

// Get testcases for a problem
router.get('/:problemId', getTestcases);

// Delete testcases for a problem
router.delete('/:problemId', deleteTestcases);

// Regenerate testcases for a problem
router.put('/regenerate/:problemId', regenerateTestcases);

module.exports = router;
