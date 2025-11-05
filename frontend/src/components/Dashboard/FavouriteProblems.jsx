import React, { useState } from 'react';
import { Trash2, Copy, Heart, ChevronLeft } from 'lucide-react';
import { showToast } from '../Toast/CustomToast';

const FavouriteProblems = () => {
  const [problems, setProblems] = useState([
    {
      id: 1,
      title: 'Two Sum Problem',
      topic: ['Arrays', 'Math', 'Greedy'],
      rating: '800',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
      examples: [
        {
          input: 'nums = [2,7,11,15], target = 9',
          output: '[0,1]',
          explanation: 'nums[0] + nums[1] == 9, so we return [0, 1]'
        },
        {
          input: 'nums = [3,2,4], target = 6',
          output: '[1,2]',
          explanation: 'nums[1] + nums[2] == 6, so we return [1, 2]'
        }
      ],
      constraints: '2 ≤ nums.length ≤ 10^4\n-10^9 ≤ nums[i] ≤ 10^9\n-10^9 ≤ target ≤ 10^9',
      savedAt: '2024-11-05 02:30 PM'
    },
    {
      id: 2,
      title: 'Binary Tree Traversal',
      topic: ['Trees'],
      rating: '1200',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(h)',
      description: 'Implement in-order, pre-order, and post-order traversal of a binary tree.',
      examples: [
        {
          input: 'tree = [1,null,2,3]',
          output: '[1,3,2]',
          explanation: 'The in-order traversal visits left subtree, node, then right subtree'
        }
      ],
      constraints: 'The number of nodes in the tree is in the range [0, 100].\n-100 ≤ Node.val ≤ 100',
      savedAt: '2024-11-05 01:15 PM'
    },
    {
      id: 3,
      title: 'Longest Substring Without Repeating',
      topic: ['Strings', 'Sliding Window'],
      rating: '1000',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(m,n))',
      description: 'Given a string s, find the length of the longest substring without repeating characters.',
      examples: [
        {
          input: 's = "abcabcbb"',
          output: '3',
          explanation: 'The answer is "abc", with the length of 3'
        }
      ],
      constraints: '0 ≤ s.length ≤ 5 * 10^4\ns consists of English letters, digits, symbols and spaces.',
      savedAt: '2024-11-04 11:45 PM'
    },
    {
      id: 4,
      title: 'Merge K Sorted Lists',
      topic: ['Linked Lists', 'Heap'],
      rating: '1600',
      timeComplexity: 'O(n log k)',
      spaceComplexity: 'O(1)',
      description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list.',
      examples: [
        {
          input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
          output: '[1,1,2,1,3,4,4,5,6]',
          explanation: 'The linked-lists are merged into one sorted list'
        }
      ],
      constraints: 'k == lists.length\n0 ≤ k ≤ 10^4\n0 ≤ lists[i].length ≤ 500',
      savedAt: '2024-11-04 10:20 PM'
    }
  ]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const handleDeleteProblem = (id) => {
    setProblems(problems.filter(p => p.id !== id));
    showToast('Problem removed from favorites', 'success');
  };

  const handleDeleteAll = () => {
    if (problems.length === 0) {
      showToast('No problems to delete', 'error');
      return;
    }
    setProblems([]);
    showToast('All favorite problems cleared', 'success');
  };

  const handleCopy = (problem) => {
    const problemText = `${problem.title}\n\n${problem.description}\n\nTime: ${problem.timeComplexity}\nSpace: ${problem.spaceComplexity}`;
    navigator.clipboard.writeText(problemText);
    showToast('Problem copied to clipboard', 'success');
  };

  // If a problem is selected, show full details
  if (selectedProblem) {
    return (
      <div className="bg-[#002029] relative overflow-hidden py-0">
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
            <p className="text-base text-gray-300 leading-relaxed bg-[#00303d]/40 border-l-2 border-blue-500/30 pl-4 py-3 rounded">
              {selectedProblem.description}
            </p>
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
                    <div>
                      <p className="text-cyan-400 font-semibold text-sm mb-1">Input</p>
                      <p className="text-gray-300 font-mono text-sm">{example.input}</p>
                    </div>
                    <div>
                      <p className="text-green-400 font-semibold text-sm mb-1">Output</p>
                      <p className="text-gray-300 font-mono text-sm">{example.output}</p>
                    </div>
                  </div>
                  {example.explanation && (
                    <div className="border-t border-blue-500/10 pt-2">
                      <p className="text-gray-400 text-sm line-clamp-2">{example.explanation}</p>
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
        {problems.length === 0 ? (
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
