import { useState, useEffect, useRef } from 'react';
import { getProblemHistory } from '../../services/generateProblemApi';
import { submitSolution, getSubmissionStatus, getProblemSubmissions } from '../../services/judgeApi';
import { getTestcases } from '../../services/generateTestcaseApi';
import { 
  Code, Send, CheckCircle, XCircle, Clock, AlertCircle, Loader, 
  FileText, ListChecks, History, Play, RotateCcw, Copy, Check,
  ChevronRight, ChevronLeft, Terminal, Eye, EyeOff
} from 'lucide-react';
import { showToast } from '../Toast/CustomToast';

const JudgeProblems = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [polling, setPolling] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('problem'); // 'problem', 'submissions', 'testcases'
  const [testcases, setTestcases] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(true);
  const [copied, setCopied] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50); // Percentage for split pane
  const [showAllProblems, setShowAllProblems] = useState(false); // Hide by default on mobile
  const [isMobile, setIsMobile] = useState(false);
  const [submissionError, setSubmissionError] = useState(null); // Add error state
  const [judgingProgress, setJudgingProgress] = useState({
    currentTest: 0,
    totalTests: 0,
    status: 'idle', // 'idle', 'compiling', 'running', 'completed'
    testResults: [],
    logs: [] // Real-time logs from backend
  });
  const logsEndRef = useRef(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    if (logsEndRef.current && judgingProgress.logs.length > 0) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [judgingProgress.logs]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Show problems by default on desktop, hide on mobile
      if (window.innerWidth >= 768) {
        setShowAllProblems(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const codeTemplates = {
    python: `# Write your solution here
def solve():
    # Read input
    n = int(input())
    
    # Your code here
    
    # Print output
    print(result)

if __name__ == "__main__":
    solve()`,
    cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    // Read input
    int n;
    cin >> n;
    
    // Your code here
    
    // Print output
    cout << result << endl;
    
    return 0;
}`,
    java: `import java.util.*;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input
        int n = sc.nextInt();
        
        // Your code here
        
        // Print output
        System.out.println(result);
        
        sc.close();
    }
}`
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  useEffect(() => {
    if (selectedProblem) {
      setCode(codeTemplates[selectedLanguage]);
      fetchProblemSubmissions();
      fetchTestcases();
      setActiveTab('problem');
    }
  }, [selectedProblem]);

  useEffect(() => {
    if (selectedProblem && selectedLanguage) {
      setCode(codeTemplates[selectedLanguage]);
    }
  }, [selectedLanguage]);

  const fetchProblems = async () => {
    try {
      setLoadingProblems(true);
      const response = await getProblemHistory(1, 100);
      console.log('Fetched problems:', response);
      if (response.success && response.data) {
        setProblems(response.data);
        console.log('Set problems:', response.data.length);
      } else {
        setProblems([]);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      showToast.error(error.message || 'Failed to fetch problems');
      setProblems([]);
    } finally {
      setLoadingProblems(false);
    }
  };

  const fetchProblemSubmissions = async () => {
    try {
      const response = await getProblemSubmissions(selectedProblem._id);
      setSubmissions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      setSubmissions([]);
    }
  };

  const fetchTestcases = async () => {
    try {
      const response = await getTestcases(selectedProblem._id);
      if (response.success && response.data) {
        setTestcases(response.data.testcases || []);
      }
    } catch (error) {
      console.error('Failed to fetch testcases:', error);
      setTestcases([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem) {
      showToast.error('Please select a problem first');
      setSubmissionError('Please select a problem first');
      return;
    }

    if (!code.trim()) {
      showToast.error('Please write some code before submitting');
      setSubmissionError('Please write some code before submitting');
      return;
    }

    if (testcases.length === 0) {
      showToast.error('No testcases found. Generate testcases from the Problem Generator first!');
      setSubmissionError('No testcases found. Generate testcases from the Problem Generator first!');
      return;
    }

    try {
      setSubmitting(true);
      setSubmissionResult(null);
      setSubmissionError(null); // Clear previous errors
      
      // Initialize judging progress
      setJudgingProgress({
        currentTest: 0,
        totalTests: testcases.length,
        status: 'compiling',
        testResults: []
      });
      
      console.log('Submitting solution for problem:', selectedProblem._id);
      console.log('Language:', selectedLanguage);
      console.log('Code length:', code.length);
      console.log('Testcases available:', testcases.length);
      
      const response = await submitSolution(selectedProblem._id, selectedLanguage, code);
      
      console.log('Submit response:', response);
      
      if (response.success) {
        showToast.success('Submission received! Judging in progress...');
        
        // Update to running state
        setJudgingProgress(prev => ({
          ...prev,
          status: 'running'
        }));
        
        // Start polling for results
        setPolling(true);
        pollSubmissionStatus(response.data.submissionId);
      } else {
        throw new Error(response.message || 'Failed to submit solution');
      }
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error.message || 'Failed to submit solution. Please try again.';
      showToast.error(errorMessage);
      setSubmissionError(errorMessage);
      setSubmitting(false);
      setPolling(false);
      setJudgingProgress({ currentTest: 0, totalTests: 0, status: 'idle', testResults: [], logs: [] });
    }
  };

  const pollSubmissionStatus = async (submissionId) => {
    const maxAttempts = 60; // Increase to 60 seconds
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        console.log(`Polling attempt ${attempts}/${maxAttempts} for submission ${submissionId}`);
        
        const response = await getSubmissionStatus(submissionId);
        
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        console.log('Submission status:', response.data?.status);
        
        if (response.success && response.data) {
          console.log('Current status:', response.data.status);
          
          // Update progress based on status and test results
          if (response.data.status === 'Compiling') {
            setJudgingProgress(prev => ({
              ...prev,
              status: 'compiling',
              currentTest: 0,
              totalTests: response.data.totalTests,
              logs: response.data.logs || []
            }));
          } else if (response.data.status === 'Running') {
            const completedTests = response.data.testResults ? response.data.testResults.length : 0;
            setJudgingProgress(prev => ({
              ...prev,
              currentTest: completedTests,
              totalTests: response.data.totalTests,
              status: 'running',
              testResults: response.data.testResults || [],
              logs: response.data.logs || []
            }));
          } else if (response.data.testResults && response.data.testResults.length > 0) {
            const completedTests = response.data.testResults.length;
            setJudgingProgress(prev => ({
              ...prev,
              currentTest: completedTests,
              totalTests: response.data.totalTests,
              status: response.data.status === 'Pending' ? 'running' : 'completed',
              testResults: response.data.testResults,
              logs: response.data.logs || []
            }));
          }
          
          // Check if judging is complete (status is not Pending, Compiling, or Running)
          if (!['Pending', 'Compiling', 'Running'].includes(response.data.status)) {
            console.log('Judging complete! Setting result...');
            setSubmissionResult(response.data);
            setSubmitting(false);
            setPolling(false);
            
            // Mark as completed
            setJudgingProgress(prev => ({
              ...prev,
              status: 'completed'
            }));
            
            // Don't switch tabs automatically - keep showing results in main view
            fetchProblemSubmissions();
            
            if (response.data.status === 'Accepted') {
              showToast.success('All test cases passed! 🎉');
            } else if (response.data.status === 'Compilation Error') {
              showToast.error('Compilation Error! Check the results below.');
            } else if (response.data.status === 'Wrong Answer') {
              showToast.error(`Wrong Answer - ${response.data.passedTests}/${response.data.totalTests} passed`);
            } else if (response.data.status === 'Runtime Error') {
              showToast.error('Runtime Error! Check the results below.');
            } else if (response.data.status === 'Time Limit Exceeded') {
              showToast.error('Time Limit Exceeded!');
            } else {
              showToast.error(`Verdict: ${response.data.status}`);
            }
            
            return; // Stop polling
          } else {
            console.log('Still processing, will poll again...');
          }
        } else {
          console.error('Invalid response:', response);
        }
        
        if (attempts < maxAttempts) {
          setTimeout(poll, 500); // Poll every 0.5 seconds for faster updates
        } else {
          console.error('Polling timeout reached');
          setSubmitting(false);
          setPolling(false);
          setJudgingProgress({ currentTest: 0, totalTests: 0, status: 'idle', testResults: [], logs: [] });
          setSubmissionError('Judging timeout. Please check submission history.');
          showToast.error('Judging timeout. Please check submission status later.');
        }
      } catch (error) {
        console.error('Polling error:', error);
        console.error('Error details:', error.response?.data);
        setSubmitting(false);
        setPolling(false);
        setJudgingProgress({ currentTest: 0, totalTests: 0, status: 'idle', testResults: [], logs: [] });
        setSubmissionError(error.message || 'Error fetching submission status');
        showToast.error('Error checking submission status');
      }
    };

    poll();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast.success('Code copied to clipboard!');
  };

  const handleResetCode = () => {
    setCode(codeTemplates[selectedLanguage]);
    showToast.success('Code reset to template');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Wrong Answer': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Runtime Error': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'Time Limit Exceeded': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Compilation Error': return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
      case 'Pending': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted': return <CheckCircle className="w-5 h-5" />;
      case 'Wrong Answer':
      case 'Compilation Error': return <XCircle className="w-5 h-5" />;
      case 'Runtime Error': return <AlertCircle className="w-5 h-5" />;
      case 'Time Limit Exceeded': return <Clock className="w-5 h-5" />;
      case 'Pending': return <Loader className="w-5 h-5 animate-spin" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    const diff = difficulty?.toLowerCase() || '';
    if (diff.includes('easy') || diff.includes('800') || diff.includes('1000')) {
      return 'bg-green-500/20 text-green-400 border-green-500/40';
    } else if (diff.includes('medium') || diff.includes('1200') || diff.includes('1400')) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    } else if (diff.includes('hard') || diff.includes('1600') || diff.includes('1800')) {
      return 'bg-red-500/20 text-red-400 border-red-500/40';
    }
    return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Top Navigation Bar */}
      <div className="bg-[#1a1f2e] border-b border-gray-700 shadow-xl sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Code Judge</h1>
              </div>
              
              {selectedProblem && (
                <>
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                  <h2 className="text-lg font-semibold text-gray-300 max-w-md truncate">
                    {selectedProblem.title}
                  </h2>
                </>
              )}
            </div>

            <button
              onClick={() => setShowAllProblems(!showAllProblems)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-white font-medium"
            >
              <ListChecks className="w-4 h-4" />
              {showAllProblems ? 'Hide' : 'Show'} Problems
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Problems Sidebar */}
        {showAllProblems && (
          <div className="w-80 bg-[#1a1f2e] border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                All Problems ({problems.length})
              </h2>
              
              {loadingProblems ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-blue-400" />
                </div>
              ) : problems.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  <p className="text-gray-500 text-sm">
                    No problems found.<br />Generate some problems first!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {problems.map((problem) => (
                    <button
                      key={problem._id}
                      onClick={() => {
                        setSelectedProblem(problem);
                        setSubmissionResult(null);
                        setShowAllProblems(false);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-all border ${
                        selectedProblem?._id === problem._id
                          ? 'bg-blue-600/20 border-blue-500 shadow-lg'
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <h3 className="font-semibold text-sm mb-2 text-white">
                        {problem.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded border ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                          {problem.rating}
                        </span>
                        {problem.tags && problem.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Judge Area */}
        {!selectedProblem ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <Terminal className="w-20 h-20 mx-auto mb-6 text-blue-400" />
              <h2 className="text-3xl font-bold text-white mb-3">Welcome to Code Judge</h2>
              <p className="text-gray-400 text-lg mb-6">
                Select a problem from the list to start coding and test your solution
              </p>
              <button
                onClick={() => setShowAllProblems(true)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold transition-colors inline-flex items-center gap-2"
              >
                <ListChecks className="w-5 h-5" />
                Browse Problems
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex">
            {/* Left Panel - Problem Description */}
            <div 
              className="bg-[#1a1f2e] border-r border-gray-700 overflow-y-auto"
              style={{ width: `${splitPosition}%` }}
            >
              {/* Tabs */}
              <div className="sticky top-0 bg-[#1a1f2e] border-b border-gray-700 z-10">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('problem')}
                    className={`flex-1 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'problem'
                        ? 'text-blue-400 bg-gray-800/50 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Problem
                  </button>
                  <button
                    onClick={() => setActiveTab('submissions')}
                    className={`flex-1 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'submissions'
                        ? 'text-blue-400 bg-gray-800/50 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    Submissions ({submissions.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('testcases')}
                    className={`flex-1 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'testcases'
                        ? 'text-blue-400 bg-gray-800/50 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                    }`}
                  >
                    <ListChecks className="w-4 h-4" />
                    Test Cases ({testcases.length})
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'problem' && (
                  <div className="text-white space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold mb-3">{selectedProblem.title}</h1>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${getDifficultyColor(selectedProblem.difficulty)}`}>
                          {selectedProblem.difficulty}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40 text-sm font-medium">
                          Rating: {selectedProblem.rating}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 text-sm">
                          {selectedProblem.timeComplexity}
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {selectedProblem.description}
                      </p>
                    </div>

                    {selectedProblem.examples && selectedProblem.examples.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Examples</h3>
                        <div className="space-y-4">
                          {selectedProblem.examples.map((example, idx) => (
                            <div key={idx} className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                              <div className="bg-gray-900/50 px-4 py-2 border-b border-gray-700">
                                <span className="text-sm font-semibold text-gray-400">Example {idx + 1}</span>
                              </div>
                              <div className="p-4 space-y-3">
                                <div>
                                  <span className="text-xs font-semibold text-gray-500 uppercase">Input:</span>
                                  <pre className="mt-1 bg-black/40 p-3 rounded text-sm text-green-400 font-mono overflow-x-auto">
                                    {example.input}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-xs font-semibold text-gray-500 uppercase">Output:</span>
                                  <pre className="mt-1 bg-black/40 p-3 rounded text-sm text-blue-400 font-mono overflow-x-auto">
                                    {example.output}
                                  </pre>
                                </div>
                                {example.explanation && (
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase">Explanation:</span>
                                    <p className="mt-1 text-sm text-gray-400">{example.explanation}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProblem.constraints && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Constraints</h3>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                          <p className="text-gray-300 whitespace-pre-wrap text-sm font-mono">
                            {selectedProblem.constraints}
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedProblem.hints && selectedProblem.hints.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Hints</h3>
                        <div className="space-y-2">
                          {selectedProblem.hints.map((hint, idx) => (
                            <div key={idx} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                              <p className="text-sm text-blue-300">💡 {hint}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'submissions' && (
                  <div className="space-y-3">
                    {submissions.length === 0 ? (
                      <div className="text-center py-12">
                        <History className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                        <p className="text-gray-500">No submissions yet. Submit your solution to see results!</p>
                      </div>
                    ) : (
                      submissions.map((sub) => (
                        <div
                          key={sub._id}
                          className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`flex items-center gap-2 font-semibold px-3 py-1 rounded-lg border ${getStatusColor(sub.status)}`}>
                              {getStatusIcon(sub.status)}
                              {sub.status}
                            </div>
                            <span className="text-xs text-gray-500 uppercase font-medium px-2 py-1 bg-gray-700 rounded">
                              {sub.language}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              {sub.passedTests}/{sub.totalTests} tests passed
                              {sub.totalExecutionTime > 0 && ` • ${sub.totalExecutionTime}ms`}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(sub.submittedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'testcases' && (
                  <div className="space-y-3">
                    {testcases.length === 0 ? (
                      <div className="text-center py-12">
                        <ListChecks className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                        <p className="text-gray-500">No test cases available. Generate test cases from the problem generator.</p>
                      </div>
                    ) : (
                      testcases.map((testcase, idx) => (
                        <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
                          <div className="bg-gray-900/50 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-400">Test Case {idx + 1}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              testcase.type === 'basic' ? 'bg-green-500/20 text-green-400' :
                              testcase.type === 'edge' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {testcase.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="p-4 space-y-3">
                            <div>
                              <span className="text-xs font-semibold text-gray-500 uppercase">Input:</span>
                              <pre className="mt-1 bg-black/40 p-3 rounded text-sm text-green-400 font-mono overflow-x-auto">
                                {testcase.input}
                              </pre>
                            </div>
                            <div>
                              <span className="text-xs font-semibold text-gray-500 uppercase">Expected Output:</span>
                              <pre className="mt-1 bg-black/40 p-3 rounded text-sm text-blue-400 font-mono overflow-x-auto">
                                {testcase.output}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Resizer */}
            <div
              className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
              onMouseDown={(e) => {
                e.preventDefault();
                const startX = e.pageX;
                const startWidth = splitPosition;

                const doDrag = (e) => {
                  const containerWidth = e.target.closest('.flex').offsetWidth;
                  const newWidth = startWidth + ((e.pageX - startX) / containerWidth) * 100;
                  setSplitPosition(Math.max(30, Math.min(70, newWidth)));
                };

                const stopDrag = () => {
                  document.removeEventListener('mousemove', doDrag);
                  document.removeEventListener('mouseup', stopDrag);
                };

                document.addEventListener('mousemove', doDrag);
                document.addEventListener('mouseup', stopDrag);
              }}
            />

            {/* Right Panel - Code Editor */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
              {/* Editor Header */}
              <div className="bg-[#252526] border-b border-gray-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Code Editor</span>
                  </div>
                  
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600"
                  >
                    <option value="python">Python 3</option>
                    <option value="cpp">C++ 17</option>
                    <option value="java">Java 11</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
                    title="Copy code"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleResetCode}
                    className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
                    title="Reset to template"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code Textarea */}
              <div className="flex-1 overflow-hidden">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-full bg-[#1e1e1e] text-white font-mono text-sm p-4 focus:outline-none resize-none"
                  placeholder="Write your code here..."
                  spellCheck="false"
                  style={{
                    lineHeight: '1.6',
                    tabSize: 4,
                  }}
                />
              </div>

              {/* Submit Bar */}
                            {/* Submit Bar */}
              <div className="bg-[#252526] border-t border-gray-700 px-2 md:px-4 py-2 md:py-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                  <div className="text-xs md:text-sm text-gray-400 order-2 sm:order-1">
                    {testcases.length > 0 ? (
                      <span className="flex items-center gap-1 md:gap-2">
                        <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-400" />
                        {testcases.length} test cases available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 md:gap-2 text-yellow-400">
                        <AlertCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        No test cases found
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting || testcases.length === 0}
                    className="flex items-center justify-center gap-1 md:gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold transition-colors text-white shadow-lg text-sm md:text-base order-1 sm:order-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                        <span>Judging...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Submit Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Judging Status Panel with Real-time Progress */}
              {submitting && !submissionResult && (
                <div className="bg-gray-900/95 border-t-4 border-blue-500 p-4 md:p-6 max-h-96 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader className="w-6 h-6 md:w-8 md:h-8 animate-spin text-blue-400" />
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white">
                        {judgingProgress.status === 'compiling' && 'Compiling Your Code...'}
                        {judgingProgress.status === 'running' && 'Running Test Cases...'}
                        {judgingProgress.status === 'completed' && 'Judging Complete!'}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {judgingProgress.status === 'compiling' && 'Checking for syntax errors'}
                        {judgingProgress.status === 'running' && `Progress: ${judgingProgress.currentTest}/${judgingProgress.totalTests} test cases`}
                      </p>
                    </div>
                  </div>

                  {/* Terminal-like Logs Display */}
                  {judgingProgress.logs && judgingProgress.logs.length > 0 && (
                    <div className="mb-4 bg-black/60 rounded-lg border border-gray-700 p-4 font-mono text-sm max-h-64 overflow-y-auto">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                        <Terminal className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-semibold">Judge Terminal</span>
                      </div>
                      {judgingProgress.logs.map((log, idx) => (
                        <div 
                          key={idx} 
                          className={`py-1 ${
                            log.type === 'success' ? 'text-green-400' :
                            log.type === 'error' ? 'text-red-400' :
                            log.type === 'warning' ? 'text-yellow-400' :
                            'text-gray-300'
                          }`}
                          style={{
                            animation: 'slideIn 0.2s ease-out'
                          }}
                        >
                          {log.message}
                        </div>
                      ))}
                      <div ref={logsEndRef} />
                      <div className="flex items-center gap-1 text-green-400 mt-2 animate-pulse">
                        <span>▊</span>
                      </div>
                    </div>
                  )}

                  {/* Progress Bar */}
                  {judgingProgress.totalTests > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Test Cases Progress</span>
                        <span>{judgingProgress.currentTest}/{judgingProgress.totalTests}</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-full transition-all duration-300 ease-out relative overflow-hidden"
                          style={{ width: `${(judgingProgress.currentTest / judgingProgress.totalTests) * 100}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Test Results */}
                  {judgingProgress.testResults.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Live Results:</h4>
                      {judgingProgress.testResults.map((test, idx) => (
                        <div 
                          key={idx}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                            test.status === 'Passed' 
                              ? 'bg-green-900/20 border-green-500/40' 
                              : test.status === 'Failed'
                              ? 'bg-red-900/20 border-red-500/40'
                              : test.status === 'TLE'
                              ? 'bg-yellow-900/20 border-yellow-500/40'
                              : 'bg-orange-900/20 border-orange-500/40'
                          }`}
                          style={{
                            animation: 'slideIn 0.3s ease-out'
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-300">Test #{test.testcaseNumber}</span>
                            {test.executionTime && (
                              <span className="text-xs text-gray-500">({test.executionTime}ms)</span>
                            )}
                          </div>
                          <div className={`flex items-center gap-1 text-sm font-semibold ${
                            test.status === 'Passed' ? 'text-green-400' :
                            test.status === 'Failed' ? 'text-red-400' :
                            test.status === 'TLE' ? 'text-yellow-400' :
                            'text-orange-400'
                          }`}>
                            {test.status === 'Passed' && <CheckCircle className="w-4 h-4" />}
                            {test.status === 'Failed' && <XCircle className="w-4 h-4" />}
                            {test.status === 'TLE' && <Clock className="w-4 h-4" />}
                            {test.status === 'Error' && <AlertCircle className="w-4 h-4" />}
                            {test.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status Message */}
                  <div className="bg-gray-800/50 rounded-lg p-3 md:p-4 space-y-2">
                    {judgingProgress.status === 'compiling' && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        Compiling code with {selectedLanguage === 'python' ? 'Python 3' : selectedLanguage === 'cpp' ? 'G++ 17' : 'Java 11'}...
                      </div>
                    )}
                    {judgingProgress.status === 'running' && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          Executing test cases and comparing outputs...
                        </div>
                        <div className="text-xs text-gray-500">
                          Each test case has a 5-second time limit
                        </div>
                      </>
                    )}
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSubmitting(false);
                          setPolling(false);
                          setJudgingProgress({ currentTest: 0, totalTests: 0, status: 'idle', testResults: [], logs: [] });
                          showToast.info('Stopped polling. Check submissions tab for final results.');
                        }}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
                      >
                        Stop Polling & Check Submissions
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Panel */}
              {submissionError && !submitting && (
                <div className="bg-red-900/20 border-t-4 border-red-500 p-4 md:p-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-6 h-6 md:w-8 md:h-8 text-red-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">Submission Error</h3>
                      <div className="bg-red-900/30 rounded-lg p-3 md:p-4 border border-red-700">
                        <p className="text-sm md:text-base text-red-200">{submissionError}</p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => setSubmissionError(null)}
                          className="px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded text-sm text-white transition-colors"
                        >
                          Dismiss
                        </button>
                        {submissionError.includes('testcases') && (
                          <button
                            onClick={() => setActiveSection && setActiveSection('dashboard')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm text-white transition-colors"
                          >
                            Go to Problem Generator
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submission Result */}
              {submissionResult && (
                <div className={`border-t-4 max-h-60 md:max-h-80 overflow-y-auto ${
                  submissionResult.status === 'Accepted' 
                    ? 'bg-green-900/20 border-green-500' 
                    : submissionResult.status === 'Compilation Error'
                    ? 'bg-pink-900/20 border-pink-500'
                    : 'bg-red-900/20 border-red-500'
                }`}>
                  <div className="p-3 md:p-4">
                    {/* Success/Error Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="flex items-center gap-3">
                        {submissionResult.status === 'Accepted' ? (
                          <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
                        ) : submissionResult.status === 'Compilation Error' ? (
                          <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-pink-400" />
                        ) : (
                          <XCircle className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
                        )}
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white">
                            {submissionResult.status === 'Accepted' ? 'Accepted!' : submissionResult.status}
                          </h3>
                          <p className="text-sm md:text-base text-gray-400">
                            {submissionResult.status === 'Accepted' 
                              ? 'All test cases passed successfully!' 
                              : submissionResult.status === 'Compilation Error'
                              ? 'Your code failed to compile. Check the error below.'
                              : 'Some tests failed. Review the details below.'}
                          </p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1 md:gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 font-bold text-base md:text-lg w-fit ${getStatusColor(submissionResult.status)}`}>
                        {getStatusIcon(submissionResult.status)}
                        {submissionResult.status}
                      </div>
                    </div>

                    {/* Compilation Error Display */}
                    {submissionResult.status === 'Compilation Error' && submissionResult.testResults && submissionResult.testResults[0] && (
                      <div className="mb-4">
                        <div className="bg-pink-900/30 border border-pink-500/40 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-pink-400 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Compilation Error Details
                          </h4>
                          <pre className="text-xs md:text-sm text-pink-200 font-mono overflow-x-auto whitespace-pre-wrap bg-black/30 p-3 rounded mb-3">
                            {submissionResult.testResults[0].error}
                          </pre>
                          <div className="bg-pink-900/20 rounded p-3 text-xs text-pink-200">
                            <p className="font-semibold mb-2">💡 Common Compilation Issues:</p>
                            <ul className="space-y-1 pl-4">
                              <li>• Check for syntax errors (missing semicolons, brackets, parentheses)</li>
                              <li>• Verify variable and function names are spelled correctly</li>
                              <li>• Make sure all variables are declared before use</li>
                              <li>• For Java: Ensure class name is "Solution"</li>
                              <li>• For C++: Check all #include statements are correct</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Runtime Error Tips */}
                    {submissionResult.status === 'Runtime Error' && (
                      <div className="mb-4 bg-orange-900/20 border border-orange-500/40 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          💡 Common Runtime Error Causes:
                        </h4>
                        <ul className="text-xs md:text-sm text-orange-200 space-y-1 pl-4">
                          <li>• Division by zero</li>
                          <li>• Array/list index out of bounds</li>
                          <li>• Null/None pointer access</li>
                          <li>• Stack overflow (infinite recursion or too deep recursion)</li>
                          <li>• Input/output format mismatch (reading wrong data type)</li>
                          <li>• Memory limit exceeded</li>
                        </ul>
                      </div>
                    )}

                    {/* Stats Grid - Only show if not compilation error */}
                    {submissionResult.status !== 'Compilation Error' && (
                      <>
                        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
                          <div className="bg-gray-800/50 border border-gray-700 p-2 md:p-3 rounded-lg text-center">
                            <p className="text-[10px] md:text-xs text-gray-500 uppercase mb-1">Test Cases</p>
                            <p className="text-base md:text-lg font-bold text-white">
                              {submissionResult.passedTests}/{submissionResult.totalTests}
                            </p>
                          </div>
                          <div className="bg-gray-800/50 border border-gray-700 p-2 md:p-3 rounded-lg text-center">
                            <p className="text-[10px] md:text-xs text-gray-500 uppercase mb-1">Execution Time</p>
                            <p className="text-base md:text-lg font-bold text-white">{submissionResult.totalExecutionTime}ms</p>
                          </div>
                          <div className="bg-gray-800/50 border border-gray-700 p-2 md:p-3 rounded-lg text-center">
                            <p className="text-[10px] md:text-xs text-gray-500 uppercase mb-1">Language</p>
                            <p className="text-base md:text-lg font-bold text-white uppercase">{submissionResult.language}</p>
                          </div>
                        </div>

                        {/* Quick Error Summary for Wrong Answer */}
                        {submissionResult.status === 'Wrong Answer' && submissionResult.testResults && (
                          <div className="mb-4 bg-yellow-900/20 border border-yellow-500/40 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Why Your Solution Failed:
                            </h4>
                            <div className="text-xs md:text-sm text-yellow-100 space-y-2">
                              {submissionResult.testResults.filter(t => t.status === 'Failed').slice(0, 3).map((test, idx) => (
                                <div key={idx} className="bg-yellow-900/30 rounded p-2 border-l-4 border-yellow-400">
                                  <div className="font-semibold text-yellow-300 mb-1">Test #{test.testcaseNumber}:</div>
                                  <div className="pl-2 space-y-1">
                                    {test.error ? (
                                      <pre className="whitespace-pre-wrap font-mono text-xs">{test.error}</pre>
                                    ) : (
                                      <>
                                        <div><span className="text-yellow-400">Expected:</span> {test.expectedOutput?.substring(0, 100)}{test.expectedOutput?.length > 100 ? '...' : ''}</div>
                                        <div><span className="text-yellow-400">Your output:</span> {test.actualOutput?.substring(0, 100)}{test.actualOutput?.length > 100 ? '...' : ''}</div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {submissionResult.testResults.filter(t => t.status === 'Failed').length > 3 && (
                                <p className="text-center text-yellow-400 text-xs">
                                  + {submissionResult.testResults.filter(t => t.status === 'Failed').length - 3} more failed test(s)
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Test Results - Only show if not compilation error or if has actual test results */}
                    {submissionResult.testResults && submissionResult.testResults.length > 0 && submissionResult.status !== 'Compilation Error' && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Test Case Results:</h4>
                        {submissionResult.testResults.map((test, idx) => (
                          <details key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg group">
                            <summary className="cursor-pointer p-3 flex items-center justify-between hover:bg-gray-800 transition-colors rounded-lg">
                              <span className="font-medium text-white">Test #{test.testcaseNumber}</span>
                              <div className="flex items-center gap-3">
                                {test.executionTime && (
                                  <span className="text-xs text-gray-400">{test.executionTime}ms</span>
                                )}
                                <span className={`flex items-center gap-1 text-sm font-semibold ${
                                  test.status === 'Passed' ? 'text-green-400' : 
                                  test.status === 'TLE' ? 'text-yellow-400' :
                                  'text-red-400'
                                }`}>
                                  {test.status === 'Passed' ? <CheckCircle className="w-4 h-4" /> : 
                                   test.status === 'TLE' ? <Clock className="w-4 h-4" /> :
                                   <XCircle className="w-4 h-4" />}
                                  {test.status}
                                </span>
                              </div>
                            </summary>
                            <div className="px-3 pb-3 space-y-2 text-sm">
                              {/* Show error reason first if test failed */}
                              {test.error && test.status !== 'Passed' && (
                                <div className="mb-3">
                                  <div className="bg-red-900/30 border border-red-500/40 rounded-lg p-3">
                                    <p className="text-xs text-red-400 uppercase mb-1 flex items-center gap-1 font-semibold">
                                      <AlertCircle className="w-3 h-3" />
                                      Reason for Failure:
                                    </p>
                                    <pre className="text-xs md:text-sm text-red-300 whitespace-pre-wrap font-mono">{test.error}</pre>
                                  </div>
                                </div>
                              )}
                              
                              {test.input && (
                                <div>
                                  <p className="text-xs text-gray-500 uppercase mb-1">Input:</p>
                                  <pre className="bg-black/40 p-2 rounded text-xs text-green-400 font-mono overflow-x-auto">{test.input}</pre>
                                </div>
                              )}
                              {test.expectedOutput && (
                                <div>
                                  <p className="text-xs text-gray-500 uppercase mb-1">Expected Output:</p>
                                  <pre className="bg-black/40 p-2 rounded text-xs text-blue-400 font-mono overflow-x-auto">{test.expectedOutput}</pre>
                                </div>
                              )}
                              {test.actualOutput !== undefined && (
                                <div>
                                  <p className="text-xs text-gray-500 uppercase mb-1">Your Output:</p>
                                  <pre className={`p-2 rounded text-xs font-mono overflow-x-auto ${
                                    test.status === 'Passed' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
                                  }`}>{test.actualOutput || '(empty or no output)'}</pre>
                                </div>
                              )}
                              
                              {/* Show stderr/runtime error separately */}
                              {test.error && (test.status === 'Error' || test.status === 'TLE') && (
                                <div>
                                  <p className="text-xs text-red-400 uppercase mb-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {test.status === 'TLE' ? 'Time Limit Exceeded:' : 'Runtime Error:'}
                                  </p>
                                  <pre className="bg-red-900/20 p-2 rounded text-xs text-red-300 font-mono overflow-x-auto whitespace-pre-wrap">{test.error}</pre>
                                </div>
                              )}
                            </div>
                          </details>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          setSubmissionResult(null);
                          setSubmissionError(null);
                          setJudgingProgress({ currentTest: 0, totalTests: 0, status: 'idle', testResults: [], logs: [] });
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors text-sm"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Submit Again
                      </button>
                      <button
                        onClick={() => setActiveTab('submissions')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors text-sm"
                      >
                        <History className="w-4 h-4" />
                        View All Submissions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgeProblems;
