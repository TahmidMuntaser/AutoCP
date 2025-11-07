import React, { useState } from 'react';
import { X, Copy, Check, Code, Loader2 } from 'lucide-react';
import { showToast } from '../Toast/CustomToast';

const SolutionModal = ({ isOpen, onClose, solution, loading }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [copiedStates, setCopiedStates] = useState({});

  if (!isOpen) return null;

  const handleCopy = (code, language) => {
    navigator.clipboard.writeText(code);
    setCopiedStates({ ...copiedStates, [language]: true });
    showToast.success(`${language.toUpperCase()} code copied!`);
    
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [language]: false });
    }, 2000);
  };

  const getLanguageCode = () => {
    if (!solution?.codes) return '';
    const codeObj = solution.codes.find(c => c.language === selectedLanguage);
    return codeObj?.code || '';
  };

  // Helper function to format text with inline code and bold markers
  const formatInlineText = (text, colorClass = 'text-blue-300', bgClass = 'bg-blue-900/30') => {
    if (!text) return null;
    
    return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/).map((part, i) => {
      // Handle **bold** text
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      // Handle `code` text
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className={`${colorClass} font-mono ${bgClass} px-1 rounded`}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const languageColors = {
    python: { bg: 'bg-blue-500/20', border: 'border-blue-400/50', text: 'text-blue-300', hover: 'hover:bg-blue-500/30' },
    cpp: { bg: 'bg-purple-500/20', border: 'border-purple-400/50', text: 'text-purple-300', hover: 'hover:bg-purple-500/30' },
    java: { bg: 'bg-orange-500/20', border: 'border-orange-400/50', text: 'text-orange-300', hover: 'hover:bg-orange-500/30' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#002029] border-2 border-blue-500/30 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/50 flex items-center justify-center">
              <Code className="text-blue-300" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Solution</h2>
              <p className="text-gray-400 text-sm">AI-Generated Optimized Solution</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-gray-400 hover:text-red-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-400 mb-4" size={48} />
              <p className="text-white font-semibold text-lg">Generating Solution...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few seconds</p>
            </div>
          ) : solution ? (
            <div className="space-y-6">
              {/* Algorithm Explanation */}
              <div className="bg-[#00303d]/60 border border-cyan-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-cyan-400 rounded-full"></div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Algorithm Explanation</h3>
                </div>
                <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {solution.algorithmExplanation.split('\n').map((line, idx) => {
                    if (!line.trim()) return <br key={idx} />;
                    
                    // Handle numbered steps (1., 2., 3., etc.)
                    if (line.trim().match(/^\d+\./)) {
                      return (
                        <p key={idx} className="font-semibold text-cyan-200 mt-4 mb-2">
                          {formatInlineText(line, 'text-blue-300', 'bg-blue-900/30')}
                        </p>
                      );
                    }
                    
                    // Handle bullet points
                    if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                      const content = line.replace(/^[\s•\-]+/, '');
                      return (
                        <div key={idx} className="flex gap-2 my-1 ml-4">
                          <span className="text-cyan-400 mt-1">•</span>
                          <span className="flex-1">
                            {formatInlineText(content, 'text-blue-300', 'bg-blue-900/30')}
                          </span>
                        </div>
                      );
                    }
                    
                    // Handle section headers (all caps or starting with **)
                    if (line.trim().match(/^[A-Z\s:]+$/) && line.trim().length < 50) {
                      return (
                        <p key={idx} className="font-bold text-cyan-300 mt-4 mb-2 text-sm uppercase tracking-wide">
                          {line}
                        </p>
                      );
                    }
                    
                    // Regular paragraph with inline formatting
                    return (
                      <p key={idx} className="mb-2">
                        {formatInlineText(line, 'text-blue-300', 'bg-blue-900/30')}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Complexity Analysis */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#00303d]/60 border border-cyan-500/20 rounded-xl p-4">
                  <p className="text-cyan-400 text-sm font-semibold mb-1">Time Complexity</p>
                  <p className="text-white text-xl font-bold">{solution.timeComplexity}</p>
                </div>
                <div className="bg-[#00303d]/60 border border-green-500/20 rounded-xl p-4">
                  <p className="text-green-400 text-sm font-semibold mb-1">Space Complexity</p>
                  <p className="text-white text-xl font-bold">{solution.spaceComplexity}</p>
                </div>
              </div>

              {/* Key Points */}
              {solution.keyPoints && solution.keyPoints.length > 0 && (
                <div className="bg-[#00303d]/60 border border-pink-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-pink-400 rounded-full"></div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Key Points</h3>
                  </div>
                  <ul className="space-y-3">
                    {solution.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-pink-400 mt-1 font-bold">•</span>
                        <span className="text-gray-300 flex-1">
                          {formatInlineText(point, 'text-pink-300', 'bg-pink-900/30')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Code Implementation */}
              <div className="bg-[#00303d]/60 border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-purple-400 rounded-full"></div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Code Implementation</h3>
                </div>

                {/* Language Tabs */}
                <div className="flex gap-2 mb-4">
                  {['python', 'cpp', 'java'].map((lang) => {
                    const colors = languageColors[lang];
                    const isActive = selectedLanguage === lang;
                    return (
                      <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                          isActive
                            ? `${colors.bg} ${colors.border} ${colors.text}`
                            : `border-[#004052] text-gray-400 ${colors.hover}`
                        }`}
                      >
                        {lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                      </button>
                    );
                  })}
                </div>

                {/* Code Editor Display */}
                <div className="relative bg-[#001a1f] border-2 border-[#004052] rounded-xl overflow-hidden shadow-lg">
                  {/* Editor Header */}
                  <div className="bg-[#002029] border-b border-[#004052] px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                      </div>
                      <span className="text-gray-400 text-xs font-mono ml-3">
                        solution.{selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage === 'java' ? 'java' : 'py'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(getLanguageCode(), selectedLanguage)}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 transition-colors text-blue-300 text-xs font-semibold"
                    >
                      {copiedStates[selectedLanguage] ? (
                        <>
                          <Check size={14} className="text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Content with Line Numbers */}
                  <div className="flex overflow-x-auto">
                    {/* Line Numbers */}
                    <div className="bg-[#00151a] border-r border-[#004052] px-3 py-4 select-none">
                      <pre className="text-gray-500 text-xs font-mono leading-relaxed text-right">
                        {getLanguageCode().split('\n').map((_, idx) => (
                          <div key={idx} className="h-[21px]">{idx + 1}</div>
                        ))}
                      </pre>
                    </div>
                    
                    {/* Code Content */}
                    <div className="flex-1 px-4 py-4 overflow-x-auto">
                      <pre className="text-sm font-mono leading-relaxed">
                        <code className="text-gray-200">
                          {getLanguageCode()}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edge Cases */}
              {solution.edgeCases && solution.edgeCases.length > 0 && (
                <div className="bg-[#00303d]/60 border border-orange-500/20 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1 h-6 bg-orange-400 rounded-full"></div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Edge Cases</h3>
                  </div>
                  <ul className="space-y-3">
                    {solution.edgeCases.map((edge, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-orange-400 mt-1 font-bold">•</span>
                        <span className="text-gray-300 flex-1">
                          {formatInlineText(edge, 'text-orange-300', 'bg-orange-900/30')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-400">No solution available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-blue-500/20 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500/30 hover:bg-blue-500/40 border border-blue-400/60 text-blue-300 rounded-lg font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolutionModal;
