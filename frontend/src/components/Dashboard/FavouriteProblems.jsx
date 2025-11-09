import React, { useState, useEffect } from 'react';
import { Trash2, Copy, Heart, ChevronLeft, FileCode, ListChecks } from 'lucide-react';
import { showToast } from '../Toast/CustomToast';
import { getFavoriteProblems, toggleFavorite, deleteProblem } from '../../services/generateProblemApi';
import { generateSolution as generateSolutionApi, getSolution } from '../../services/generateSolutionApi';
import { generateTestcases as generateTestcasesApi, getTestcases } from '../../services/generateTestcaseApi';
import SolutionModal from '../Solution/SolutionModal';
import TestcaseModal from '../Testcase/TestcaseModal';
import { SkeletonHistoryItem } from '../Loading/SkeletonLoader';

const FavouriteProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [solutionModalOpen, setSolutionModalOpen] = useState(false);
  const [solution, setSolution] = useState(null);
  const [solutionLoading, setSolutionLoading] = useState(false);
  const [testcaseModalOpen, setTestcaseModalOpen] = useState(false);
  const [testcases, setTestcases] = useState(null);
  const [testcaseLoading, setTestcaseLoading] = useState(false);

  // Fetch favorite problems on component mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavoriteProblems(1, 50);
      if (response.success) {
        // Format problems for display
        const formattedProblems = response.data.map(p => ({
          id: p._id,
          title: p.title,
          topic: p.topics,
          rating: p.rating,
          timeComplexity: p.timeComplexity,
          spaceComplexity: p.spaceComplexity,
          description: p.description,
          examples: p.examples,
          constraints: p.constraints,
          savedAt: new Date(p.generatedAt).toLocaleString()
        }));
        setProblems(formattedProblems);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      showToast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      const response = await toggleFavorite(id);
      if (response.success) {
        setProblems(problems.filter(p => p.id !== id));
        showToast.success('Removed from favorites');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      showToast.error('Failed to remove favorite');
    }
  };

  const handleDeleteProblem = async (id) => {
    try {
      const response = await deleteProblem(id);
      if (response.success) {
        setProblems(problems.filter(p => p.id !== id));
        showToast.success('Problem deleted');
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
      showToast.error('Failed to delete problem');
    }
  };

  const handleDeleteAll = () => {
    if (problems.length === 0) {
      showToast.error('No problems to delete');
      return;
    }
    // Would need a bulk delete API endpoint for this
    showToast.error('Bulk delete not implemented yet');
  };

  const handleCopy = (problem) => {
    const problemText = `${problem.title}\n\n${problem.description}\n\nTime: ${problem.timeComplexity}\nSpace: ${problem.spaceComplexity}`;
    navigator.clipboard.writeText(problemText);
    showToast('Problem copied to clipboard', 'success');
  };

  const handleViewSolution = async (problemId) => {
    if (!problemId) return;

    try {
      setSolutionModalOpen(true);
      setSolutionLoading(true);

      // Try to get existing solution first
      try {
        const response = await getSolution(problemId);
        if (response.success) {
          setSolution(response.data);
          setSolutionLoading(false);
          return;
        }
      } catch (error) {
        console.log('Solution not found, generating new one...');
      }

      // Generate new solution
      const toastId = showToast.loading('Generating solution...');
      const response = await generateSolutionApi(problemId);
      
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

  const handleViewTestcases = async (problemId) => {
    if (!problemId) return;

    try {
      setTestcaseModalOpen(true);
      setTestcaseLoading(true);

      // Try to get existing testcases first
      try {
        const response = await getTestcases(problemId);
        if (response.success) {
          setTestcases(response.data);
          setTestcaseLoading(false);
          return;
        }
      } catch (error) {
        console.log('Testcases not found, generating new ones...');
      }

      // Generate new testcases
      const toastId = showToast.loading('Generating testcases...');
      const response = await generateTestcasesApi(problemId);
      
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

  // If a problem is selected, show full details
  if (selectedProblem) {
    return (
      <div className="bg-[#002029] relative overflow-hidden py-0">
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

        {/* Animated background orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4">
          {/* Back button */}
          <button
            onClick={() => setSelectedProblem(null)}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-3"
          >
            <ChevronLeft size={20} />
            <span>Back to Favorites</span>
          </button>

          {/* Problem Header */}
          <div className="mb-3">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {Array.isArray(selectedProblem.topic) ? (
                    selectedProblem.topic.map((t, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">
                      {selectedProblem.topic}
                    </span>
                  )}
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                    {selectedProblem.rating}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {selectedProblem.title}
                </h1>
              </div>
              <button
                onClick={() => handleCopy(selectedProblem)}
                className="p-3 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400 shrink-0 ml-16"
              >
                <Copy size={24} />
              </button>
            </div>
          </div>

          {/* Complexity Cards */}
          <div className="grid md:grid-cols-2 gap-3 mb-5">
            {/* Time Complexity */}
            <div className="bg-[#00303d]/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-3">
              <p className="text-cyan-400 text-sm font-semibold mb-1">Time Complexity</p>
              <p className="text-white text-2xl font-bold">{selectedProblem.timeComplexity}</p>
            </div>

            {/* Space Complexity */}
            <div className="bg-[#00303d]/60 backdrop-blur-xl border border-green-500/20 rounded-xl p-3">
              <p className="text-green-400 text-sm font-semibold mb-1">Space Complexity</p>
              <p className="text-white text-2xl font-bold">{selectedProblem.spaceComplexity}</p>
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-purple-500 rounded"></div>
              <h2 className="text-xl font-bold text-white">Problem Statement</h2>
            </div>
            <div className="text-base text-gray-300 leading-relaxed bg-[#00303d]/40 border-l-2 border-blue-500/30 pl-4 py-3 rounded whitespace-pre-wrap break-words">
              {selectedProblem.description.split('\n').map((paragraph, idx) => {
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
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-purple-500 rounded"></div>
              <h2 className="text-xl font-bold text-white">Examples</h2>
            </div>
            <div className="space-y-3">
              {selectedProblem.examples.map((example, index) => (
                <div key={index} className="bg-[#00303d]/40 border border-blue-500/20 rounded-lg p-3">
                  <div className="grid md:grid-cols-2 gap-3 mb-2">
                    <div className="relative group">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-cyan-400 font-semibold text-sm">Input</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(example.input);
                            showToast.success('Input copied!');
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-cyan-500/20 rounded"
                          title="Copy input"
                        >
                          <Copy size={12} className="text-cyan-400" />
                        </button>
                      </div>
                      <p className="text-gray-300 font-mono text-sm break-words">{example.input}</p>
                    </div>
                    <div className="relative group">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-green-400 font-semibold text-sm">Output</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(example.output);
                            showToast.success('Output copied!');
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-green-500/20 rounded"
                          title="Copy output"
                        >
                          <Copy size={12} className="text-green-400" />
                        </button>
                      </div>
                      <p className="text-gray-300 font-mono text-sm break-words">{example.output}</p>
                    </div>
                  </div>
                  {example.explanation && (
                    <div className="border-t border-blue-500/10 pt-2">
                      <p className="text-gray-400 text-sm whitespace-pre-wrap break-words">
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
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-purple-500 rounded"></div>
              <h2 className="text-xl font-bold text-white">Constraints</h2>
            </div>
            <pre className="bg-[#00303d]/60 border border-blue-500/20 rounded-lg p-3 text-gray-300 font-mono text-sm overflow-x-auto">
              {selectedProblem.constraints}
            </pre>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleViewSolution(selectedProblem.id)}
              className="py-3 bg-gradient-to-r from-purple-500/30 to-blue-500/30 hover:from-purple-500/40 hover:to-blue-500/40 border-2 border-purple-400/50 text-white font-semibold rounded-lg transition-all shadow-lg text-sm flex items-center justify-center gap-2"
            >
              <FileCode size={16} />
              View Solution
            </button>
            <button
              onClick={() => handleViewTestcases(selectedProblem.id)}
              className="py-3 bg-gradient-to-r from-cyan-500/30 to-green-500/30 hover:from-cyan-500/40 hover:to-green-500/40 border-2 border-cyan-400/50 text-white font-semibold rounded-lg transition-all shadow-lg text-sm flex items-center justify-center gap-2"
            >
              <ListChecks size={16} />
              Test Cases
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen py-6">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Saved Problems</h2>
            <p className="text-gray-400 text-sm">{problems.length} problem{problems.length !== 1 ? 's' : ''} saved</p>
          </div>
          <button
            onClick={handleDeleteAll}
            disabled={problems.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 border border-red-400/60 text-red-300 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} />
            Delete All
          </button>
        </div>

        {/* Problems Grid */}
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonHistoryItem key={i} />
            ))}
          </div>
        ) : problems.length === 0 ? (
          <div className="bg-[#00303d]/60 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-12 text-center">
            <Heart size={48} className="mx-auto text-gray-400 mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">No Favorite Problems Yet</h3>
            <p className="text-gray-400">Start saving problems to build your collection</p>
          </div>
        ) : (
          <div className="space-y-2">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="bg-[#00303d]/60 backdrop-blur-xl border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {Array.isArray(problem.topic) ? (
                      problem.topic.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-500/30 border border-blue-400/50 rounded text-blue-300 text-xs font-semibold">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 bg-blue-500/30 border border-blue-400/50 rounded text-blue-300 text-xs font-semibold">
                        {problem.topic}
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-purple-500/30 border border-purple-400/50 rounded text-purple-300 text-xs font-semibold">
                      {problem.rating}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white truncate">{problem.title}</h3>
                  <p className="text-gray-500 text-xs mt-1">Saved: {problem.savedAt}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => setSelectedProblem(problem)}
                    className="px-2 py-1 rounded bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/60 text-blue-300 text-xs font-semibold transition-all whitespace-nowrap"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleCopy(problem)}
                    className="p-1 rounded border border-[#004052] text-gray-400 hover:border-blue-400/50 hover:text-blue-400 transition-all"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProblem(problem.id)}
                    className="p-1 rounded border border-[#004052] text-gray-400 hover:border-red-400/50 hover:text-red-400 transition-all"
                    title="Delete from favorites"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouriteProblems;
