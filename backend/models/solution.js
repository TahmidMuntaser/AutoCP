const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    enum: ['python', 'cpp', 'java']
  },
  code: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: false  // Made optional since we removed language-specific explanations
  }
}, { _id: false });

const solutionSchema = new mongoose.Schema({
  // Reference to the problem
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  
  // User who generated this solution
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Solution content
  algorithmExplanation: {
    type: String,
    required: true
  },
  
  codes: [codeSchema],
  
  // Complexity analysis
  timeComplexity: {
    type: String,
    required: true
  },
  
  spaceComplexity: {
    type: String,
    required: true
  },
  
  // Additional insights
  keyPoints: [{
    type: String
  }],
  
  edgeCases: [{
    type: String
  }],
  
  // Metadata
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
solutionSchema.index({ problemId: 1 });
solutionSchema.index({ userId: 1 });
solutionSchema.index({ problemId: 1, userId: 1 }, { unique: true });

const Solution = mongoose.model('Solution', solutionSchema);

module.exports = Solution;
