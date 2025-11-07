const Solution = require('../models/solution');
const Problem = require('../models/problem');
const { generateSolution } = require('../services/ai');

// @desc    Generate solution for a problem using Gemini AI
// @route   POST /api/generate-solution/:problemId
// @access  Private
const generateNewSolution = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Check if problem exists and belongs to user
    const problem = await Problem.findOne({
      _id: problemId,
      userId: req.user._id
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check if solution already exists
    const existingSolution = await Solution.findOne({
      problemId,
      userId: req.user._id
    });

    if (existingSolution) {
      return res.status(200).json({
        success: true,
        message: 'Solution already exists',
        data: existingSolution
      });
    }

    // Generate solution using Gemini AI
    const generatedSolutionData = await generateSolution({
      problemTitle: problem.title,
      problemDescription: problem.description,
      examples: problem.examples,
      constraints: problem.constraints,
      timeComplexity: problem.timeComplexity,
      spaceComplexity: problem.spaceComplexity,
      topics: problem.topics,
      rating: problem.rating
    });

    // Save solution to database
    const solution = new Solution({
      problemId,
      userId: req.user._id,
      algorithmExplanation: generatedSolutionData.algorithmExplanation,
      codes: generatedSolutionData.codes,
      timeComplexity: generatedSolutionData.timeComplexity,
      spaceComplexity: generatedSolutionData.spaceComplexity,
      keyPoints: generatedSolutionData.keyPoints || [],
      edgeCases: generatedSolutionData.edgeCases || [],
      generatedAt: new Date()
    });

    await solution.save();

    res.status(201).json({
      success: true,
      message: 'Solution generated successfully',
      data: solution
    });

  } catch (error) {
    console.error('Generate solution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate solution',
      error: error.message
    });
  }
};

// @desc    Get solution for a problem
// @route   GET /api/generate-solution/:problemId
// @access  Private
const getSolution = async (req, res) => {
  try {
    const { problemId } = req.params;

    const solution = await Solution.findOne({
      problemId,
      userId: req.user._id
    });

    if (!solution) {
      return res.status(404).json({
        success: false,
        message: 'Solution not found'
      });
    }

    res.status(200).json({
      success: true,
      data: solution
    });

  } catch (error) {
    console.error('Get solution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch solution',
      error: error.message
    });
  }
};

// @desc    Delete solution
// @route   DELETE /api/generate-solution/:problemId
// @access  Private
const deleteSolution = async (req, res) => {
  try {
    const { problemId } = req.params;

    const solution = await Solution.findOneAndDelete({
      problemId,
      userId: req.user._id
    });

    if (!solution) {
      return res.status(404).json({
        success: false,
        message: 'Solution not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Solution deleted successfully'
    });

  } catch (error) {
    console.error('Delete solution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete solution',
      error: error.message
    });
  }
};

module.exports = {
  generateNewSolution,
  getSolution,
  deleteSolution
};
