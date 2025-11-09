const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  // Reference to the problem
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  
  // User who submitted
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Submission details
  language: {
    type: String,
    required: true,
    enum: ['python', 'cpp', 'java']
  },
  
  code: {
    type: String,
    required: true
  },
  
  // Verdict
  status: {
    type: String,
    required: true,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded', 'Compilation Error', 'Pending', 'Compiling', 'Running'],
    default: 'Pending'
  },
  
  // Real-time logs (like terminal output)
  logs: {
    type: [{
      timestamp: { type: Date, default: Date.now },
      message: { type: String },
      logType: { type: String }  // 'info', 'success', 'error', 'warning'
    }],
    default: []
  },
  
  // Test results
  testResults: [{
    testcaseNumber: Number,
    status: String,  // 'Passed', 'Failed', 'Error', 'TLE'
    input: String,
    expectedOutput: String,
    actualOutput: String,
    executionTime: Number,  // in milliseconds
    error: String
  }],
  
  // Statistics
  passedTests: {
    type: Number,
    default: 0
  },
  
  totalTests: {
    type: Number,
    default: 0
  },
  
  totalExecutionTime: {
    type: Number,
    default: 0  // in milliseconds
  },
  
  // Metadata
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
submissionSchema.index({ userId: 1, submittedAt: -1 });
submissionSchema.index({ problemId: 1, userId: 1 });
submissionSchema.index({ status: 1 });

// Clear any cached model to prevent schema conflicts
if (mongoose.models.Submission) {
  delete mongoose.models.Submission;
}

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
