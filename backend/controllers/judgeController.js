const Submission = require('../models/submission');
const Problem = require('../models/problem');
const Testcase = require('../models/testcase');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Submit and judge a solution
const submitSolution = async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    const userId = req.user._id || req.user.id;

    console.log('=== NEW SUBMISSION ===');
    console.log('User ID:', userId);
    console.log('User:', req.user.name || req.user.email);
    console.log('Problem ID:', problemId);
    console.log('Language:', language);
    console.log('Code length:', code?.length || 0);

    // Validate input
    if (!problemId || !language || !code) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Problem ID, language, and code are required'
      });
    }

    if (!['python', 'cpp', 'java'].includes(language)) {
      console.log('Validation failed: Invalid language');
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Must be python, cpp, or java'
      });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      console.log('Problem not found:', problemId);
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    console.log('Problem found:', problem.title);

    // Get testcases for this problem
    const testcaseDoc = await Testcase.findOne({ problemId, userId });
    if (!testcaseDoc || !testcaseDoc.testcases || testcaseDoc.testcases.length === 0) {
      console.log('No testcases found for problem:', problemId, 'user:', userId);
      return res.status(404).json({
        success: false,
        message: 'No testcases found. Please generate testcases first.'
      });
    }
    console.log('Found', testcaseDoc.testcases.length, 'testcases');

    // Create submission record
    const submission = new Submission({
      problemId,
      userId,
      language,
      code,
      status: 'Pending',
      totalTests: testcaseDoc.testcases.length
    });

    await submission.save();
    console.log('Submission created with ID:', submission._id);

    // Run tests asynchronously (don't wait for completion)
    console.log('Starting background judging process...');
    runTests(submission._id, code, language, testcaseDoc.testcases)
      .catch(err => {
        console.error('Error in runTests background job:', err);
      });

    return res.status(201).json({
      success: true,
      message: 'Submission received. Judging in progress...',
      data: {
        submissionId: submission._id,
        status: 'Pending'
      }
    });

  } catch (error) {
    console.error('Submit solution error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error submitting solution: ' + error.message
    });
  }
};

// Run tests on submitted code
async function runTests(submissionId, code, language, testcases) {
  let tempDir = null;
  
  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      console.error('Submission not found:', submissionId);
      return;
    }

    console.log(`Starting tests for submission ${submissionId}, language: ${language}, testcases: ${testcases.length}`);

    const testResults = [];
    let passedTests = 0;
    let totalExecutionTime = 0;
    let overallStatus = 'Accepted';

    // Create temp directory for this submission
    tempDir = path.join(__dirname, '../temp', submissionId.toString());
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Prepare code file
      let fileName, compileCmd, runCmd;

      if (language === 'python') {
        fileName = 'solution.py';
        await fs.writeFile(path.join(tempDir, fileName), code);
        runCmd = (inputFile) => `cd "${tempDir}" && python3 solution.py < "${inputFile}"`;
      } else if (language === 'cpp') {
        fileName = 'solution.cpp';
        await fs.writeFile(path.join(tempDir, fileName), code);
        compileCmd = `cd "${tempDir}" && g++ -std=c++17 -O2 solution.cpp -o solution`;
        runCmd = (inputFile) => `cd "${tempDir}" && ./solution < "${inputFile}"`;
      } else if (language === 'java') {
        fileName = 'Solution.java';
        // Ensure class name is Solution
        const modifiedCode = code.replace(/public\s+class\s+\w+/g, 'public class Solution');
        await fs.writeFile(path.join(tempDir, fileName), modifiedCode);
        compileCmd = `cd "${tempDir}" && javac Solution.java`;
        runCmd = (inputFile) => `cd "${tempDir}" && java Solution < "${inputFile}"`;
      }

      console.log(`Executing with language: ${language}, file: ${fileName}`);

      // Compile if needed
      if (compileCmd) {
        console.log('Compiling...');
        try {
          const { stdout, stderr } = await execPromise(compileCmd, { timeout: 10000 });
          console.log('Compilation successful');
          if (stderr) console.log('Compile warnings:', stderr);
        } catch (compileError) {
          console.error('Compilation failed:', compileError.message);
          submission.status = 'Compilation Error';
          submission.testResults = [{
            testcaseNumber: 0,
            status: 'Compilation Error',
            error: compileError.stderr || compileError.stdout || compileError.message
          }];
          await submission.save();
          await cleanupTempDir(tempDir);
          return;
        }
      }

      // Run each test case
      console.log(`Running ${testcases.length} test cases...`);
      for (let i = 0; i < testcases.length; i++) {
        const testcase = testcases[i];
        const inputFile = path.join(tempDir, `input_${i}.txt`);
        await fs.writeFile(inputFile, testcase.input);

        const testResult = {
          testcaseNumber: i + 1,
          input: testcase.input,
          expectedOutput: testcase.output.trim()
        };

        try {
          const startTime = Date.now();
          const { stdout, stderr } = await execPromise(runCmd(inputFile), {
            timeout: 5000,  // 5 second timeout per test
            maxBuffer: 1024 * 1024  // 1MB buffer
          });
          const executionTime = Date.now() - startTime;

          testResult.actualOutput = stdout.trim();
          testResult.executionTime = executionTime;
          totalExecutionTime += executionTime;

          // Compare output
          if (testResult.actualOutput === testResult.expectedOutput) {
            testResult.status = 'Passed';
            passedTests++;
            console.log(`Test ${i + 1}: Passed (${executionTime}ms)`);
          } else {
            testResult.status = 'Failed';
            overallStatus = 'Wrong Answer';
            console.log(`Test ${i + 1}: Failed - Expected: "${testResult.expectedOutput}", Got: "${testResult.actualOutput}"`);
          }

          if (stderr) {
            testResult.error = stderr;
            console.log(`Test ${i + 1}: stderr:`, stderr);
          }

        } catch (runError) {
          testResult.executionTime = 5000;
          
          if (runError.killed || runError.signal === 'SIGTERM') {
            testResult.status = 'TLE';
            testResult.error = 'Time Limit Exceeded';
            overallStatus = 'Time Limit Exceeded';
            console.log(`Test ${i + 1}: TLE`);
          } else {
            testResult.status = 'Error';
            testResult.error = runError.stderr || runError.stdout || runError.message;
            overallStatus = 'Runtime Error';
            console.error(`Test ${i + 1}: Runtime Error:`, runError.message);
          }
        }

        testResults.push(testResult);
      }

      // Update submission with results
      submission.status = overallStatus;
      submission.testResults = testResults;
      submission.passedTests = passedTests;
      submission.totalExecutionTime = totalExecutionTime;
      await submission.save();

      console.log(`Judging complete: ${overallStatus}, Passed: ${passedTests}/${testcases.length}`);

    } catch (innerError) {
      console.error('Error in test execution phase:', innerError);
      submission.status = 'Runtime Error';
      submission.testResults = [{
        testcaseNumber: 0,
        status: 'Error',
        error: innerError.message || 'Internal judging error'
      }];
      await submission.save();
    } finally {
      // Cleanup temp directory
      if (tempDir) {
        await cleanupTempDir(tempDir);
      }
    }

  } catch (error) {
    console.error('Fatal error in runTests:', error);
    try {
      const submission = await Submission.findById(submissionId);
      if (submission) {
        submission.status = 'Runtime Error';
        submission.testResults = [{
          testcaseNumber: 0,
          status: 'Error',
          error: error.message || 'System error during judging'
        }];
        await submission.save();
      }
    } catch (updateError) {
      console.error('Error updating submission after fatal error:', updateError);
    } finally {
      if (tempDir) {
        await cleanupTempDir(tempDir);
      }
    }
  }
}

// Helper function to cleanup temp directory
async function cleanupTempDir(tempDir) {
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (cleanupError) {
    console.error('Error cleaning up temp directory:', cleanupError);
  }
}

// Get submission status
const getSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user._id || req.user.id;

    const submission = await Submission.findOne({ _id: submissionId, userId })
      .populate('problemId', 'title');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: submission
    });

  } catch (error) {
    console.error('Get submission status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching submission status: ' + error.message
    });
  }
};

// Get all submissions for a problem
const getProblemSubmissions = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id || req.user.id;

    const submissions = await Submission.find({ problemId, userId })
      .sort({ submittedAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: submissions
    });

  } catch (error) {
    console.error('Get problem submissions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching submissions: ' + error.message
    });
  }
};

// Get all user submissions
const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ userId })
      .populate('problemId', 'title difficulty rating')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Submission.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      data: {
        submissions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalSubmissions: total
        }
      }
    });

  } catch (error) {
    console.error('Get user submissions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching submissions: ' + error.message
    });
  }
};

module.exports = {
  submitSolution,
  getSubmissionStatus,
  getProblemSubmissions,
  getUserSubmissions
};
