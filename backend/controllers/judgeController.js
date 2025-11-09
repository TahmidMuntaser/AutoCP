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

// Helper function to add log to submission
function addLog(submission, message, type = 'info') {
  if (!submission.logs) {
    submission.logs = [];
  }
  // Create a plain object that mongoose will convert to a subdocument
  submission.logs.push({
    timestamp: new Date(),
    message: String(message),
    logType: String(type)  // Changed from 'type' to 'logType' to avoid Mongoose keyword conflict
  });
  // Mark the logs array as modified so Mongoose knows to save it
  submission.markModified('logs');
  console.log(message); // Also log to console
}

// Run tests on submitted code
async function runTests(submissionId, code, language, testcases) {
  let tempDir = null;
  
  try {
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      console.error('Submission not found:', submissionId);
      return;
    }

    addLog(submission, `🚀 Starting judging process for ${language} submission`, 'info');
    addLog(submission, `📋 Total test cases: ${testcases.length}`, 'info');
    await submission.save();

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
        runCmd = (inputFile) => `python3 -u solution.py < "${inputFile}"`;
      } else if (language === 'cpp') {
        fileName = 'solution.cpp';
        await fs.writeFile(path.join(tempDir, fileName), code);
        compileCmd = `g++ -std=c++17 -O2 solution.cpp -o solution`;
        runCmd = (inputFile) => `./solution < "${inputFile}"`;
      } else if (language === 'java') {
        fileName = 'Solution.java';
        // Ensure class name is Solution
        const modifiedCode = code.replace(/public\s+class\s+\w+/g, 'public class Solution');
        await fs.writeFile(path.join(tempDir, fileName), modifiedCode);
        compileCmd = `javac Solution.java`;
        runCmd = (inputFile) => `./solution < "${inputFile}"`;
      }

      addLog(submission, `📝 Language: ${language}, File: ${fileName}`, 'info');
      await submission.save();

      // Compile if needed
      if (compileCmd) {
        addLog(submission, `🔨 Compiling ${language} code...`, 'info');
        submission.status = 'Compiling';
        await submission.save();
        
        try {
          const { stdout, stderr } = await execPromise(compileCmd, { timeout: 10000, cwd: tempDir });
          addLog(submission, `✅ Compilation successful!`, 'success');
          if (stderr) {
            addLog(submission, `⚠️  Compiler warnings: ${stderr}`, 'warning');
          }
          await submission.save();
        } catch (compileError) {
          const errorMsg = compileError.stderr || compileError.stdout || compileError.message;
          addLog(submission, `❌ Compilation failed!`, 'error');
          addLog(submission, errorMsg, 'error');
          submission.status = 'Compilation Error';
          submission.testResults = [{
            testcaseNumber: 0,
            status: 'Compilation Error',
            error: errorMsg
          }];
          await submission.save();
          await cleanupTempDir(tempDir);
          return;
        }
      }

      // Update status to show tests are running
      addLog(submission, `\n🚀 Running ${testcases.length} test cases...`, 'info');
      submission.status = 'Running';
      await submission.save();

      // Run each test case
      for (let i = 0; i < testcases.length; i++) {
        addLog(submission, `\n📝 Test Case ${i + 1}/${testcases.length}:`, 'info');
        await submission.save();
        
        const testcase = testcases[i];
        
        // Log the input being tested
        addLog(submission, `   Input (${testcase.input.length} chars): "${testcase.input}"`, 'info');
        
        const inputFileName = `input_${i}.txt`;
        const inputFile = path.join(tempDir, inputFileName);
        await fs.writeFile(inputFile, testcase.input);

        const testResult = {
          testcaseNumber: i + 1,
          input: testcase.input,
          expectedOutput: testcase.output.trim()
        };

        try {
          const startTime = Date.now();
          const { stdout, stderr } = await execPromise(runCmd(inputFileName), {
            timeout: 5000,  // 5 second timeout per test
            maxBuffer: 1024 * 1024,  // 1MB buffer
            cwd: tempDir
          });
          const executionTime = Date.now() - startTime;

          testResult.actualOutput = stdout.trim();
          testResult.executionTime = executionTime;
          totalExecutionTime += executionTime;

          // Normalize outputs for comparison (trim lines and remove trailing whitespace)
          const normalizeOutput = (str) => {
            return str
              .split('\n')
              .map(line => line.trimEnd())  // Only trim end to preserve leading spaces
              .filter(line => line.length > 0)  // Remove empty lines
              .join('\n')
              .trim();
          };

          const normalizedActual = normalizeOutput(testResult.actualOutput);
          const normalizedExpected = normalizeOutput(testResult.expectedOutput);

          // Log normalized outputs for debugging
          addLog(submission, `   Raw Expected: "${testResult.expectedOutput}"`, 'info');
          addLog(submission, `   Raw Actual:   "${testResult.actualOutput}"`, 'info');
          addLog(submission, `   Normalized Expected: "${normalizedExpected}"`, 'info');
          addLog(submission, `   Normalized Actual:   "${normalizedActual}"`, 'info');

          // Compare output
          if (normalizedActual === normalizedExpected) {
            testResult.status = 'Passed';
            passedTests++;
            addLog(submission, `✅ Test ${i + 1}: Passed (${executionTime}ms)`, 'success');
          } else {
            testResult.status = 'Failed';
            if (overallStatus === 'Accepted') {
              overallStatus = 'Wrong Answer';
            }
            addLog(submission, `❌ Test ${i + 1}: Failed (output mismatch)`, 'error');
            
            // Add detailed difference explanation with character-by-character comparison
            if (testResult.actualOutput.length === 0) {
              testResult.error = 'No output produced. Your program might not be printing anything or crashed before producing output.';
              addLog(submission, `   Error: No output produced`, 'error');
            } else if (normalizedActual.length === 0 && normalizedExpected.length > 0) {
              testResult.error = 'Output is empty after normalization. Check if your program prints only whitespace.';
              addLog(submission, `   Error: Empty output after removing whitespace`, 'error');
            } else if (normalizedActual.length !== normalizedExpected.length) {
              testResult.error = `Output length mismatch. Expected ${normalizedExpected.length} characters but got ${normalizedActual.length} characters. Check for extra or missing characters.`;
              addLog(submission, `   Error: Length mismatch (Expected: ${normalizedExpected.length}, Got: ${normalizedActual.length})`, 'error');
              
              // Show first few characters of each
              const preview = 50;
              if (normalizedExpected.length > 0) {
                addLog(submission, `   Expected starts with: "${normalizedExpected.substring(0, preview)}${normalizedExpected.length > preview ? '...' : ''}"`, 'error');
              }
              if (normalizedActual.length > 0) {
                addLog(submission, `   Your output starts with: "${normalizedActual.substring(0, preview)}${normalizedActual.length > preview ? '...' : ''}"`, 'error');
              }
            } else {
              // Find first difference
              let diffPos = -1;
              for (let j = 0; j < normalizedExpected.length; j++) {
                if (normalizedActual[j] !== normalizedExpected[j]) {
                  diffPos = j;
                  break;
                }
              }
              if (diffPos >= 0) {
                const contextStart = Math.max(0, diffPos - 10);
                const contextEnd = Math.min(normalizedExpected.length, diffPos + 10);
                testResult.error = `First difference at position ${diffPos}.\nExpected character: '${normalizedExpected[diffPos]}' (ASCII: ${normalizedExpected.charCodeAt(diffPos)})\nYour character: '${normalizedActual[diffPos]}' (ASCII: ${normalizedActual.charCodeAt(diffPos)})\nContext: ...${normalizedExpected.substring(contextStart, contextEnd)}...`;
                addLog(submission, `   Error: First difference at position ${diffPos}`, 'error');
                addLog(submission, `   Expected: '${normalizedExpected[diffPos]}' (ASCII ${normalizedExpected.charCodeAt(diffPos)})`, 'error');
                addLog(submission, `   Got:      '${normalizedActual[diffPos]}' (ASCII ${normalizedActual.charCodeAt(diffPos)})`, 'error');
              } else {
                testResult.error = 'Output differs in whitespace or formatting (strings are same length but differ in content).';
                addLog(submission, `   Error: Output differs but exact position not found`, 'error');
              }
            }
          }

          if (stderr) {
            testResult.error = stderr;
            addLog(submission, `⚠️  Test ${i + 1} stderr: ${stderr}`, 'warning');
          }

        } catch (runError) {
          testResult.executionTime = 5000;
          
          if (runError.killed || runError.signal === 'SIGTERM') {
            testResult.status = 'TLE';
            testResult.error = 'Time Limit Exceeded';
            if (overallStatus === 'Accepted') {
              overallStatus = 'Time Limit Exceeded';
            }
            addLog(submission, `⏱️  Test ${i + 1}: Time Limit Exceeded`, 'error');
          } else {
            testResult.status = 'Error';
            const errorDetails = runError.stderr || runError.stdout || runError.message;
            testResult.error = errorDetails;
            if (overallStatus === 'Accepted') {
              overallStatus = 'Runtime Error';
            }
            addLog(submission, `💥 Test ${i + 1}: Runtime Error`, 'error');
            
            // Log the actual error details
            if (runError.stderr) {
              addLog(submission, `   Error Output (stderr):`, 'error');
              addLog(submission, runError.stderr, 'error');
            }
            if (runError.stdout) {
              addLog(submission, `   Program Output (stdout):`, 'error');
              addLog(submission, runError.stdout, 'error');
            }
            if (runError.message && !runError.stderr && !runError.stdout) {
              addLog(submission, `   Error: ${runError.message}`, 'error');
            }
            
            // Log the input that caused the error
            addLog(submission, `   Input that caused error: "${testcase.input}"`, 'error');
          }
        }

        testResults.push(testResult);
        
        // 🔥 UPDATE SUBMISSION AFTER EACH TEST CASE (Real-time updates!)
        submission.testResults = testResults;
        submission.passedTests = passedTests;
        submission.totalExecutionTime = totalExecutionTime;
        submission.status = 'Running'; // Keep status as Running until all tests complete
        await submission.save();
      }

      // Update submission with final results
      addLog(submission, `\n🎯 Judging complete!`, 'success');
      addLog(submission, `📊 Final Verdict: ${overallStatus}`, overallStatus === 'Accepted' ? 'success' : 'error');
      addLog(submission, `✓ Passed: ${passedTests}/${testcases.length} test cases`, 'info');
      addLog(submission, `⏱️  Total execution time: ${totalExecutionTime}ms`, 'info');
      
      submission.status = overallStatus;
      submission.testResults = testResults;
      submission.passedTests = passedTests;
      submission.totalExecutionTime = totalExecutionTime;
      await submission.save();

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
