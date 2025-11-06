const Problem = require('../models/problem');
const { generateProblem } = require('../services/ai');

// @desc    Generate a new problem using Gemini AI
// @route   POST /api/generate-problem
// @access  Private
const generateNewProblem = async (req, res) => {
  try {
    const { topics, rating, suggestion } = req.body;

    // Validation
    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one topic'
      });
    }

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a difficulty rating'
      });
    }

    // Generate problem using Gemini AI
    const generatedProblemData = await generateProblem({
      topics,
      rating,
      suggestion: suggestion || ''
    });

    // Save problem to database
    const problem = new Problem({
      userId: req.user._id,
      title: generatedProblemData.title,
      description: generatedProblemData.description,
      topics,
      rating,
      suggestion: suggestion || '',
      examples: generatedProblemData.examples,
      constraints: generatedProblemData.constraints,
      hints: generatedProblemData.hints || [],
      tags: generatedProblemData.tags || [],
      difficulty: generatedProblemData.difficulty || rating,
      timeComplexity: generatedProblemData.timeComplexity,
      spaceComplexity: generatedProblemData.spaceComplexity,
      testCaseCount: generatedProblemData.testCaseCount || '5',
      approach: generatedProblemData.approach || '',
      keyInsights: generatedProblemData.keyInsights || [],
      isFavorited: false,
      generatedAt: new Date()
    });

    await problem.save();

    res.status(201).json({
      success: true,
      message: 'Problem generated successfully',
      data: problem
    });

  } catch (error) {
    console.error('Generate problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate problem',
      error: error.message
    });
  }
};

// @desc    Get user's problem history
// @route   GET /api/generate-problem/history
// @access  Private
const getProblemHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const problems = await Problem.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Problem.countDocuments({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: problems,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    console.error('Get problem history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem history',
      error: error.message
    });
  }
};

// @desc    Get user's favorite problems
// @route   GET /api/generate-problem/favorites
// @access  Private
const getFavoriteProblems = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const problems = await Problem.find({ 
      userId: req.user._id,
      isFavorited: true 
    })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Problem.countDocuments({ 
      userId: req.user._id,
      isFavorited: true 
    });

    res.status(200).json({
      success: true,
      data: problems,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });

  } catch (error) {
    console.error('Get favorite problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorite problems',
      error: error.message
    });
  }
};

// @desc    Toggle favorite status of a problem
// @route   PUT /api/generate-problem/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    problem.isFavorited = !problem.isFavorited;
    await problem.save();

    res.status(200).json({
      success: true,
      message: problem.isFavorited ? 'Added to favorites' : 'Removed from favorites',
      data: problem
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update favorite status',
      error: error.message
    });
  }
};

// @desc    Get a single problem by ID
// @route   GET /api/generate-problem/:id
// @access  Private
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.status(200).json({
      success: true,
      data: problem
    });

  } catch (error) {
    console.error('Get problem by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem',
      error: error.message
    });
  }
};

// @desc    Delete a problem
// @route   DELETE /api/generate-problem/:id
// @access  Private
const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully'
    });

  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete problem',
      error: error.message
    });
  }
};

module.exports = {
  generateNewProblem,
  getProblemHistory,
  getFavoriteProblems,
  toggleFavorite,
  getProblemById,
  deleteProblem
};
