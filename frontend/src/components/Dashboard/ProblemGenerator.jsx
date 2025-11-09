import React, { useState } from 'react';
import { 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Code2, 
  Zap, 
  Brain,
  CheckCircle2,
  ChevronRight,
  Heart,
  Download,
  Copy,
  FileCode,
  ListChecks
} from 'lucide-react';
import { showToast } from '../Toast/CustomToast';
import { generateProblem, toggleFavorite as toggleFavoriteApi } from '../../services/generateProblemApi';
import { generateSolution as generateSolutionApi, getSolution } from '../../services/generateSolutionApi';
import { generateTestcases as generateTestcasesApi, getTestcases } from '../../services/generateTestcaseApi';
import SolutionModal from '../Solution/SolutionModal';
import TestcaseModal from '../Testcase/TestcaseModal';
import { SkeletonProblemGenerator } from '../Loading/SkeletonLoader';

const ProblemGenerator = () => {
  const [formData, setFormData] = useState({
    topics: [],
    rating: '',
    suggestion: ''
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [step, setStep] = useState(1);
  const [generatedProblem, setGeneratedProblem] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [solutionModalOpen, setSolutionModalOpen] = useState(false);
  const [solution, setSolution] = useState(null);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [testcaseModalOpen, setTestcaseModalOpen] = useState(false);
  const [testcases, setTestcases] = useState(null);
  const [testcaseLoading, setTestcaseLoading] = useState(false);

  const topics = [
    { id: 'dp', name: 'Dynamic Programming', icon: Brain, color: 'purple' },
    { id: 'graph', name: 'Graph Algorithms', icon: Code2, color: 'blue' },
    { id: 'greedy', name: 'Greedy', icon: Zap, color: 'yellow' },
    { id: 'trees', name: 'Trees', icon: Code2, color: 'green' },
    { id: 'binary-search', name: 'Binary Search', icon: Zap, color: 'cyan' },
    { id: 'sorting', name: 'Sorting', icon: Code2, color: 'pink' },
    { id: 'data-structures', name: 'Data Structures', icon: Brain, color: 'orange' },
    { id: 'number-theory', name: 'Number Theory', icon: Zap, color: 'red' },
    { id: 'strings', name: 'Strings', icon: Code2, color: 'indigo' },
    { id: 'geometry', name: 'Geometry', icon: Brain, color: 'teal' },
    { id: 'game-theory', name: 'Game Theory', icon: Zap, color: 'violet' },
    { id: 'combinatorics', name: 'Combinatorics', icon: Code2, color: 'lime' },
    { id: 'bit-manipulation', name: 'Bit Manipulation', icon: Zap, color: 'rose' },
    { id: 'hashing', name: 'Hashing', icon: Code2, color: 'sky' },
    { id: 'recursion', name: 'Recursion', icon: Brain, color: 'fuchsia' },
    { id: 'backtracking', name: 'Backtracking', icon: Zap, color: 'amber' },
    { id: 'segment-tree', name: 'Segment Tree', icon: Code2, color: 'emerald' },
    { id: 'two-pointer', name: 'Two Pointer', icon: Brain, color: 'slate' },
    { id: 'math', name: 'Math', icon: Zap, color: 'blue' }
  ];

  const ratings = [
    { value: '800', label: '800', difficulty: 'Beginner', color: 'green' },
    { value: '1000', label: '1000', difficulty: 'Easy', color: 'green' },
    { value: '1200', label: '1200', difficulty: 'Medium', color: 'yellow' },
    { value: '1400', label: '1400', difficulty: 'Medium', color: 'yellow' },
    { value: '1600', label: '1600', difficulty: 'Hard', color: 'orange' },
    { value: '1800', label: '1800', difficulty: 'Hard', color: 'red' },
    { value: '2000', label: '2000+', difficulty: 'Expert', color: 'purple' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateProblem = async (e) => {
    e.preventDefault();

    if (formData.topics.length === 0 || !formData.rating) {
      showToast.error('Please select topics and rating');
      return;
    }

    setLoading(true);
    setProgress(0);
    setProgressMessage('Initializing AI...');
    const toastId = showToast.loading('Generating problem with AI...');

    try {
      // Simulate progress stages
      const progressStages = [
        { percent: 10, message: 'Analyzing topics and difficulty...' },
        { percent: 30, message: 'Crafting problem statement...' },
        { percent: 50, message: 'Generating test cases...' },
        { percent: 70, message: 'Creating hints and insights...' },
        { percent: 90, message: 'Finalizing problem...' }
      ];

      // Start progress simulation
      let currentStage = 0;
      const progressInterval = setInterval(() => {
        if (currentStage < progressStages.length) {
          setProgress(progressStages[currentStage].percent);
          setProgressMessage(progressStages[currentStage].message);
          currentStage++;
        }
      }, 800);

      // Call the API to generate problem
      const response = await generateProblem({
        topics: formData.topics,
        rating: formData.rating,
        suggestion: formData.suggestion
      });

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Problem generated successfully!');

      if (response.success) {
        const problem = response.data;
        
        // Format the problem data for display
        const formattedProblem = {
          id: problem._id,
          title: problem.title,
          topic: problem.topics.join(', '),
          rating: problem.rating,
          description: problem.description,
          examples: problem.examples || [],
          constraints: problem.constraints,
          timeComplexity: problem.timeComplexity,
          spaceComplexity: problem.spaceComplexity,
          hints: problem.hints || [],
          approach: problem.approach || '',
          keyInsights: problem.keyInsights || [],
          tags: problem.tags || [],
          generatedAt: new Date(problem.generatedAt).toLocaleString()
        };

        setGeneratedProblem(formattedProblem);
        setIsFavorited(problem.isFavorited);
        
        showToast.dismiss(toastId);
        showToast.success('Problem generated successfully!');
      }
    } catch (error) {
      console.error('Error generating problem:', error);
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Failed to generate problem. Please try again.');
      setProgress(0);
      setProgressMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Check for inconsistent selections
  const isInconsistentSelection = () => {
    const hardTopics = ['Dynamic Programming', 'Graph Algorithms', 'Game Theory', 'Geometry'];
    const hasHardTopic = formData.topics.some(topic => hardTopics.includes(topic));
    const ratingValue = parseInt(formData.rating);
    
    if (hasHardTopic && ratingValue < 1200) {
      return 'Some selected topics are typically harder. Consider choosing a higher rating.';
    }
    
    const easyTopics = ['Sorting', 'Binary Search'];
    const hasEasyTopic = formData.topics.some(topic => easyTopics.includes(topic));
    
    if (hasEasyTopic && ratingValue > 1600) {
      return 'Some selected topics are typically easier. Consider choosing a lower rating.';
    }
    
    return null;
  };

  const inconsistencyWarning = formData.topics.length > 0 && formData.rating ? isInconsistentSelection() : null;

  const getColorClasses = (color, selected = false) => {
    const colors = {
      purple: selected ? 'bg-purple-500/20 border-purple-400 text-purple-300' : 'border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10',
      blue: selected ? 'bg-blue-500/20 border-blue-400 text-blue-300' : 'border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/10',
      yellow: selected ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300' : 'border-yellow-500/30 hover:border-yellow-400 hover:bg-yellow-500/10',
      green: selected ? 'bg-green-500/20 border-green-400 text-green-300' : 'border-green-500/30 hover:border-green-400 hover:bg-green-500/10',
      cyan: selected ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10',
      pink: selected ? 'bg-pink-500/20 border-pink-400 text-pink-300' : 'border-pink-500/30 hover:border-pink-400 hover:bg-pink-500/10',
      orange: selected ? 'bg-orange-500/20 border-orange-400 text-orange-300' : 'border-orange-500/30 hover:border-orange-400 hover:bg-orange-500/10',
      red: selected ? 'bg-red-500/20 border-red-400 text-red-300' : 'border-red-500/30 hover:border-red-400 hover:bg-red-500/10',
      indigo: selected ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300' : 'border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-500/10',
      teal: selected ? 'bg-teal-500/20 border-teal-400 text-teal-300' : 'border-teal-500/30 hover:border-teal-400 hover:bg-teal-500/10',
      violet: selected ? 'bg-violet-500/20 border-violet-400 text-violet-300' : 'border-violet-500/30 hover:border-violet-400 hover:bg-violet-500/10',
      lime: selected ? 'bg-lime-500/20 border-lime-400 text-lime-300' : 'border-lime-500/30 hover:border-lime-400 hover:bg-lime-500/10',
    };
    return colors[color] || colors.blue;
  };

  const handleNext = () => {
    if (step === 1 && formData.topics.length === 0) {
      showToast.error('Please select at least one topic');
      return;
    }
    if (step === 2 && !formData.rating) {
      showToast.error('Please select a difficulty');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const generateAnother = () => {
    setGeneratedProblem(null);
    setFormData({ topics: [], rating: '', suggestion: '' });
    setStep(1);
  };

  const handleCopyCode = () => {
    const problemText = `${generatedProblem.title}\n\n${generatedProblem.description}\n\nExamples:\n${generatedProblem.examples.map((ex, i) => `${i + 1}. Input: ${ex.input}\nOutput: ${ex.output}`).join('\n\n')}\n\nConstraints:\n${generatedProblem.constraints}`;
    navigator.clipboard.writeText(problemText);
    showToast.success('Copied to clipboard!');
  };

  const handleFavorite = async () => {
    if (!generatedProblem?.id) return;

    try {
      const response = await toggleFavoriteApi(generatedProblem.id);
      
      if (response.success) {
        setIsFavorited(!isFavorited);
        showToast.success(response.message);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showToast.error(error.message || 'Failed to update favorite status');
    }
  };

  const handleViewSolution = async () => {
    if (!generatedProblem?.id) return;

    try {
      setSolutionModalOpen(true);
      setSolutionLoading(true);

      // Try to get existing solution first
      try {
        const response = await getSolution(generatedProblem.id);
        if (response.success) {
          setSolution(response.data);
          setSolutionLoading(false);
          return;
        }
      } catch (error) {
        // Solution doesn't exist, generate new one
        console.log('Solution not found, generating new one...');
      }

      // Generate new solution
      const toastId = showToast.loading('Generating solution...');
      const response = await generateSolutionApi(generatedProblem.id);
      
      if (response.success) {
        setSolution(response.data);
        showToast.dismiss(toastId);
        showToast.success('Solution generated successfully!');
      }
    } catch (error) {
      console.error('Error getting solution:', error);
      showToast.error(error.message || 'Failed to get solution');
      setSolutionModalOpen(false);
    } finally {
      setSolutionLoading(false);
    }
  };

  const handleViewTestcases = async () => {
    if (!generatedProblem?.id) return;

    try {
      setTestcaseModalOpen(true);
      setTestcaseLoading(true);

      // Try to get existing testcases first
      try {
        const response = await getTestcases(generatedProblem.id);
        if (response.success) {
          setTestcases(response.data);
          setTestcaseLoading(false);
          return;
        }
      } catch (error) {
        // Testcases don't exist, generate new ones
        console.log('Testcases not found, generating new ones...');
      }

      // Generate new testcases
      const toastId = showToast.loading('Generating testcases...');
      const response = await generateTestcasesApi(generatedProblem.id);
      
      if (response.success) {
        setTestcases(response.data);
        showToast.dismiss(toastId);
        showToast.success('Testcases generated successfully!');
      }
    } catch (error) {
      console.error('Error getting testcases:', error);
      showToast.error(error.message || 'Failed to get testcases');
      setTestcaseModalOpen(false);
    } finally {
      setTestcaseLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#002029] overflow-hidden relative p-4">
      {/* Solution Modal */}
      <SolutionModal
        isOpen={solutionModalOpen}
        onClose={() => setSolutionModalOpen(false)}
        solution={solution}
        loading={solutionLoading}
      />

      {/* Testcase Modal */}
      <TestcaseModal
        isOpen={testcaseModalOpen}
        onClose={() => setTestcaseModalOpen(false)}
        testcases={testcases}
        loading={testcaseLoading}
      />

      {/* If problem is generated, show problem view */}
      {generatedProblem ? (
        <div className="relative z-10 min-h-screen py-6 pt-0">
          {/* Animated Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

          <div className="max-w-5xl mx-auto relative z-10 pt-0">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-500/30 border border-blue-400/50 rounded-lg text-blue-300 text-xs font-semibold">
                      {generatedProblem.topic}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/30 border border-purple-400/50 rounded-lg text-purple-300 text-xs font-semibold">
                      Rating {generatedProblem.rating}
                    </span>
                    {generatedProblem.tags && generatedProblem.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-cyan-500/20 border border-cyan-400/40 rounded-lg text-cyan-300 text-xs font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-2xl font-bold text-white mt-6 mb-1">{generatedProblem.title}</h1>
                  <p className="text-gray-400 text-xs">Generated {generatedProblem.generatedAt}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleFavorite}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      isFavorited
                        ? 'bg-red-500/30 border-red-400 text-red-300'
                        : 'bg-[#00303d] border-[#004052] text-gray-400 hover:border-red-400/50'
                    }`}
                  >
                    <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-lg border-2 bg-[#00303d] border-[#004052] text-gray-400 hover:border-blue-400/50 transition-all"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Complexity Summary Bar */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#00303d]/60 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-4">
                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Time Complexity</p>
                <p className="text-xl font-black text-cyan-300">{generatedProblem.timeComplexity}</p>
              </div>
              <div className="bg-[#00303d]/60 backdrop-blur-xl border border-green-500/20 rounded-lg p-4">
                <p className="text-gray-400 text-xs font-semibold mb-1 uppercase">Space Complexity</p>
                <p className="text-xl font-black text-green-300">{generatedProblem.spaceComplexity}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-4 mb-6">
              {/* Problem Statement */}
              <div className="bg-[#00303d]/60 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-blue-400 rounded-full"></div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Problem Statement</h2>
                </div>
                <div className="text-gray-300 leading-relaxed text-base whitespace-pre-wrap prose prose-invert max-w-none">
                  {generatedProblem.description.split('\n').map((paragraph, idx) => {
                    if (!paragraph.trim()) return null;
                    
                    // Handle bullet points
                    if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-') || paragraph.trim().match(/^\d+\./)) {
                      // Process bullet point content for bold formatting
                      const bulletContent = paragraph.replace(/^[•\-]\s*/, '').replace(/^\d+\.\s*/, '');
                      const formattedBullet = bulletContent.split(/(`[^`]+`|'[^']+'|\*\*[^*]+\*\*)/).map((part, i) => {
                        if ((part.startsWith('`') && part.endsWith('`')) || (part.startsWith("'") && part.endsWith("'"))) {
                          return <strong key={i} className="text-white font-bold">{part.slice(1, -1)}</strong>;
                        }
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                      });
                      
                      return (
                        <div key={idx} className="flex gap-2 my-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span className="flex-1">{formattedBullet}</span>
                        </div>
                      );
                    }
                    
                    // Handle bold text with backticks `text`, single quotes 'text', or **text**
                    const formattedText = paragraph.split(/(`[^`]+`|'[^']+'|\*\*[^*]+\*\*)/).map((part, i) => {
                      if ((part.startsWith('`') && part.endsWith('`')) || (part.startsWith("'") && part.endsWith("'"))) {
                        return <strong key={i} className="text-white font-bold">{part.slice(1, -1)}</strong>;
                      }
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    });
                    
                    return <p key={idx} className="mb-3">{formattedText}</p>;
                  })}
                </div>
              </div>

              {/* Examples */}
              <div className="bg-[#00303d]/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-purple-400 rounded-full"></div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Examples</h2>
                </div>
                <div className="space-y-3">
                  {generatedProblem.examples.map((example, idx) => (
                    <div key={idx} className="bg-[#002029]/50 border border-[#004052] rounded-xl p-4 hover:border-purple-500/40 transition-all">
                      <p className="text-xs text-purple-400 font-bold mb-3 uppercase tracking-wider">Example {idx + 1}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#002029]/50 rounded-lg p-3 border border-blue-500/20 relative group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-blue-400 text-xs font-bold uppercase">Input</p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(example.input);
                                showToast.success('Input copied!');
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-blue-500/20 rounded"
                              title="Copy input"
                            >
                              <Copy size={14} className="text-blue-400" />
                            </button>
                          </div>
                          <p className="text-blue-300 font-mono text-sm break-words">{example.input}</p>
                        </div>
                        <div className="bg-[#002029]/50 rounded-lg p-3 border border-green-500/20 relative group">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-green-400 text-xs font-bold uppercase">Output</p>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(example.output);
                                showToast.success('Output copied!');
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-green-500/20 rounded"
                              title="Copy output"
                            >
                              <Copy size={14} className="text-green-400" />
                            </button>
                          </div>
                          <p className="text-green-300 font-mono text-sm break-words">{example.output}</p>
                        </div>
                      </div>
                      {example.explanation && (
                        <div className="mt-3 pt-3 border-t border-[#004052]">
                          <p className="text-gray-400 text-xs font-bold mb-2 uppercase">Explanation</p>
                          <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">
                            {example.explanation.split(/(`[^`]+`|'[^']+'|\*\*[^*]+\*\*)/).map((part, i) => {
                              if ((part.startsWith('`') && part.endsWith('`')) || (part.startsWith("'") && part.endsWith("'"))) {
                                return <strong key={i} className="text-white font-bold">{part.slice(1, -1)}</strong>;
                              }
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div className="bg-[#00303d]/60 backdrop-blur-xl border border-yellow-500/20 rounded-2xl p-6 hover:border-yellow-500/40 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-yellow-400 rounded-full"></div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Constraints</h2>
                </div>
                <pre className="text-gray-300 font-mono text-sm bg-[#002029]/50 p-4 rounded-lg border border-[#004052] overflow-auto whitespace-pre-wrap">
                  {generatedProblem.constraints}
                </pre>
              </div>

              {/* Approach */}
              {generatedProblem.approach && (
                <div className="bg-[#00303d]/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-cyan-400 rounded-full"></div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Approach</h2>
                  </div>
                  <div className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap break-words">
                    {generatedProblem.approach.split(/(`[^`]+`|'[^']+'|\*\*[^*]+\*\*)/).map((part, i) => {
                      if ((part.startsWith('`') && part.endsWith('`')) || (part.startsWith("'") && part.endsWith("'"))) {
                        return <strong key={i} className="text-white font-bold">{part.slice(1, -1)}</strong>;
                      }
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                      }
                      return part;
                    })}
                  </div>
                </div>
              )}

              {/* Key Insights */}
              {generatedProblem.keyInsights && generatedProblem.keyInsights.length > 0 && (
                <div className="bg-[#00303d]/60 backdrop-blur-xl border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-pink-400 rounded-full"></div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Key Insights</h2>
                  </div>
                  <ul className="space-y-2">
                    {generatedProblem.keyInsights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-pink-400 mt-1">•</span>
                        <span className="text-gray-300 text-sm flex-1 break-words">
                          {insight.split(/(`[^`]+`|'[^']+'|\*\*[^*]+\*\*)/).map((part, i) => {
                            if ((part.startsWith('`') && part.endsWith('`')) || (part.startsWith("'") && part.endsWith("'"))) {
                              return <strong key={i} className="text-white font-bold">{part.slice(1, -1)}</strong>;
                            }
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hints */}
              {generatedProblem.hints && generatedProblem.hints.length > 0 && (
                <div className="bg-[#00303d]/60 backdrop-blur-xl border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-orange-400 rounded-full"></div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Hints</h2>
                  </div>
                  <div className="space-y-2">
                    {generatedProblem.hints.map((hint, idx) => (
                      <div key={idx} className="bg-[#002029]/50 border border-[#004052] rounded-lg p-3">
                        <p className="text-orange-400 text-xs font-bold mb-1">Hint {idx + 1}</p>
                        <p className="text-gray-300 text-sm break-words whitespace-pre-wrap">
                          {hint.split(/(`[^`]+`|'[^']+'|\*\*[^*]+\*\*)/).map((part, i) => {
                            if ((part.startsWith('`') && part.endsWith('`')) || (part.startsWith("'") && part.endsWith("'"))) {
                              return <strong key={i} className="text-white font-bold">{part.slice(1, -1)}</strong>;
                            }
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleViewSolution}
                className="py-3 bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-500/40 border-2 border-purple-400/50 text-white font-semibold rounded-lg transition-all shadow-lg text-sm flex items-center justify-center gap-2"
              >
                <FileCode size={16} />
                View Solution
              </button>
              <button
                onClick={handleViewTestcases}
                className="py-3 bg-gradient-to-r from-cyan-500/30 to-green-500/30 hover:from-cyan-500/40 hover:to-green-500/40 border-2 border-cyan-400/50 text-white font-semibold rounded-lg transition-all shadow-lg text-sm flex items-center justify-center gap-2"
              >
                <ListChecks size={16} />
                Test Cases
              </button>
              <button
                onClick={generateAnother}
                className="py-3 bg-[#004052] hover:bg-[#005066] text-white font-semibold rounded-lg transition-all shadow-lg text-sm flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                New Challenge
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Original Form View */
        <>
          {/* Animated Background Elements */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Main Container */}
            <div className="grid md:grid-cols-2 gap-12 items-center py-6 pt-0">
          
          {/* Left Side - Visual/Info */}
          <div className="hidden md:flex flex-col justify-center space-y-8">
            <div>
              <h1 className="text-7xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight mb-4">
                Generate
              </h1>
              <h2 className="text-5xl font-bold text-white leading-tight">
                Your Next Challenge
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 border border-blue-400/50 flex items-center justify-center shrink-0 animate-pulse shadow-lg shadow-blue-500/50">
                  <Brain className="text-blue-300" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">AI-Powered</h3>
                  <p className="text-gray-400">Intelligent problem generation tailored to your level</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 border border-purple-400/50 flex items-center justify-center shrink-0 animate-pulse shadow-lg shadow-purple-500/50" style={{ animationDelay: '0.5s' }}>
                  <Zap className="text-purple-300" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Instant</h3>
                  <p className="text-gray-400">Generated in seconds with full explanations</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center shrink-0 animate-pulse shadow-lg shadow-cyan-500/50" style={{ animationDelay: '1s' }}>
                  <Code2 className="text-cyan-300" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Complete</h3>
                  <p className="text-gray-400">Includes test cases, solutions, and complexity analysis</p>
                </div>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-3 pt-12">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    s < step
                      ? 'w-8 bg-green-400'
                      : s === step
                      ? 'w-12 bg-blue-400'
                      : 'w-2 bg-[#004052]'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-[#00303d]/60 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 md:p-8 shadow-2xl">
            
            {/* Step 1: Topic Selection */}
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Pick Your Topics</h2>
                  <p className="text-gray-400 text-sm">Select one or more topics (you can pick multiple!)</p>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {topics.map((topic) => {
                    const Icon = topic.icon;
                    const isSelected = formData.topics.includes(topic.name);

                    return (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setFormData(prev => {
                            const newTopics = prev.topics.includes(topic.name)
                              ? prev.topics.filter(t => t !== topic.name)
                              : [...prev.topics, topic.name];
                            return { ...prev, topics: newTopics };
                          });
                        }}
                        disabled={loading}
                        className={`group relative p-3 rounded-lg transition-all duration-300 overflow-hidden disabled:opacity-50 ${
                          isSelected
                            ? 'bg-blue-500/30 border-2 border-blue-400 ring-2 ring-blue-400/30'
                            : 'bg-[#002029]/50 border-2 border-[#004052] hover:border-blue-400/60'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
                        )}
                        <div className="relative flex flex-col items-center text-center">
                          <Icon className={`w-5 h-5 mb-1 transition-colors ${isSelected ? 'text-blue-300' : 'text-gray-400'}`} />
                          <p className={`text-xs font-semibold transition-colors leading-tight ${isSelected ? 'text-blue-100' : 'text-gray-300'}`}>
                            {topic.name}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Difficulty Selection */}
            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Pick Difficulty</h2>
                  <p className="text-gray-400 text-sm">Topics: <span className="text-blue-300 font-semibold">{formData.topics.join(', ')}</span></p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {ratings.map((rating) => {
                    const isSelected = formData.rating === rating.value;
                    const colorMap = {
                      green: 'from-green-500/20 to-green-600/20 border-green-400/60 hover:border-green-400',
                      yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-400/60 hover:border-yellow-400',
                      orange: 'from-orange-500/20 to-orange-600/20 border-orange-400/60 hover:border-orange-400',
                      red: 'from-red-500/20 to-red-600/20 border-red-400/60 hover:border-red-400',
                      purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/60 hover:border-purple-400'
                    };

                    return (
                      <button
                        key={rating.value}
                        onClick={() => setFormData(prev => ({ ...prev, rating: rating.value }))}
                        disabled={loading}
                        className={`p-3 rounded-lg transition-all duration-300 border-2 disabled:opacity-50 ${
                          isSelected
                            ? `bg-linear-to-r ${colorMap[rating.color]} ring-2 ring-opacity-30 ring-current`
                            : `bg-[#002029]/50 border-[#004052] hover:${colorMap[rating.color]}`
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-left">
                            <p className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {rating.label}
                            </p>
                            <p className={`text-xs ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                              {rating.difficulty}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="text-white shrink-0" size={18} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {inconsistencyWarning && (
                  <div className="p-3 bg-yellow-500/20 border-2 border-yellow-500/40 rounded-lg flex gap-2">
                    <AlertCircle className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                    <p className="text-yellow-100 text-xs">{inconsistencyWarning}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Custom Story */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Add Your Twist</h2>
                  <p className="text-gray-400 text-sm">{formData.topics.join(', ')} • {formData.rating}</p>
                </div>

                <div className="space-y-4">
                  <textarea
                    name="suggestion"
                    value={formData.suggestion}
                    onChange={handleInputChange}
                    placeholder="Give your problem a story... or leave blank for a standard problem"
                    rows="3"
                    className="w-full px-4 py-2 bg-[#002029]/50 border-2 border-[#004052] rounded-lg text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-all resize-none text-sm"
                    disabled={loading}
                  />

                  <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 rounded-lg p-3">
                    <p className="text-gray-300 font-semibold text-xs mb-2">⚡ What You'll Get:</p>
                    <ul className="space-y-1 text-xs text-gray-400">
                      <li className="flex gap-2">
                        <span className="text-blue-400">✓</span> Full problem statement
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-400">✓</span> 5-10 test cases
                      </li>
                      <li className="flex gap-2">
                        <span className="text-cyan-400">✓</span> Time & space complexity
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-2 rounded-lg border-2 border-[#004052] text-white font-semibold text-sm hover:bg-[#004052]/50 transition-all"
                >
                  Back
                </button>
              )}

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className={`flex-1 px-6 py-2 bg-[#004052] hover:bg-[#005066] text-white font-semibold text-sm rounded-lg transition-all shadow-lg ${step === 1 ? 'ml-0' : ''}`}
                >
                  Next →
                </button>
              ) : (
                <div className="flex-1">
                  <button
                    onClick={handleGenerateProblem}
                    disabled={loading || formData.topics.length === 0 || !formData.rating}
                    className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-[#004052] hover:bg-[#005066] text-white font-bold text-sm rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Generate!</span>
                      </>
                    )}
                  </button>
                  
                  {/* Progress Bar */}
                  {loading && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{progressMessage}</span>
                        <span className="text-blue-400 font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-[#002029] rounded-full overflow-hidden border border-[#004052]">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-500 ease-out relative overflow-hidden"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}} />
        </>
      )}
    </div>
  );
};

export default ProblemGenerator;
