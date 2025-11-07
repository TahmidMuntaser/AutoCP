import React, { useState } from 'react';
import { X, Copy, Check, ListChecks, Loader2, FlaskConical } from 'lucide-react';
import { showToast } from '../Toast/CustomToast';

const TestcaseModal = ({ isOpen, onClose, testcases, loading }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  if (!isOpen) return null;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast.success('Testcase copied!');
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const getFilteredTestcases = () => {
    if (!testcases?.testcases) return [];
    if (selectedType === 'all') return testcases.testcases;
    return testcases.testcases.filter(tc => tc.type === selectedType);
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'basic':
        return 'bg-green-500/20 border-green-400/50 text-green-300';
      case 'edge':
        return 'bg-orange-500/20 border-orange-400/50 text-orange-300';
      case 'large':
        return 'bg-purple-500/20 border-purple-400/50 text-purple-300';
      default:
        return 'bg-gray-500/20 border-gray-400/50 text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'basic':
        return '🔹';
      case 'edge':
        return '⚠️';
      case 'large':
        return '📊';
      default:
        return '📝';
    }
  };

  const filteredTestcases = getFilteredTestcases();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#002029] border-2 border-cyan-500/30 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center">
              <ListChecks className="text-cyan-300" size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Test Cases</h2>
              <p className="text-gray-400 text-sm">
                {testcases?.testcases?.length || 0} testcases generated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-gray-400 hover:text-red-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter Tabs */}
        {!loading && testcases && (
          <div className="flex gap-2 p-4 border-b border-cyan-500/10">
            {['all', 'basic', 'edge', 'large'].map((type) => {
              const count = type === 'all' 
                ? testcases.testcases?.length || 0
                : testcases.testcases?.filter(tc => tc.type === type).length || 0;
              
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all border-2 ${
                    selectedType === type
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                      : 'border-[#004052] text-gray-400 hover:bg-cyan-500/10'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                  <span className="ml-2 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FlaskConical className="animate-bounce text-cyan-400 mb-4" size={48} />
              <p className="text-white font-semibold text-lg">Generating Testcases...</p>
              <p className="text-gray-400 text-sm mt-2">Creating diverse test scenarios</p>
            </div>
          ) : testcases ? (
            <div className="space-y-4">
              {filteredTestcases.map((testcase, idx) => (
                <div 
                  key={idx}
                  className="bg-[#00303d]/60 border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/40 transition-colors"
                >
                  {/* Testcase Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(testcase.type)}</span>
                      <div>
                        <h3 className="text-white font-bold">
                          Testcase #{testcases.testcases.indexOf(testcase) + 1}
                        </h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeColor(testcase.type)} mt-1`}>
                          {testcase.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(`Input:\n${testcase.input}\n\nOutput:\n${testcase.output}`, idx)}
                      className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
                      title="Copy testcase"
                    >
                      {copiedIndex === idx ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <Copy size={18} className="text-cyan-400" />
                      )}
                    </button>
                  </div>

                  {/* Input Section */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 bg-blue-400 rounded-full"></div>
                      <h4 className="text-blue-300 font-semibold text-sm uppercase tracking-wider">Input</h4>
                    </div>
                    <div className="bg-[#001a1f] border border-blue-500/20 rounded-lg p-4">
                      <pre className="text-gray-200 text-sm font-mono whitespace-pre-wrap break-all">
                        {testcase.input}
                      </pre>
                    </div>
                  </div>

                  {/* Output Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1 h-4 bg-green-400 rounded-full"></div>
                      <h4 className="text-green-300 font-semibold text-sm uppercase tracking-wider">Expected Output</h4>
                    </div>
                    <div className="bg-[#001a1f] border border-green-500/20 rounded-lg p-4">
                      <pre className="text-gray-200 text-sm font-mono whitespace-pre-wrap break-all">
                        {testcase.output}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-400">No testcases available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-cyan-500/20 p-4 flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            {filteredTestcases.length > 0 && (
              <>Showing {filteredTestcases.length} testcase{filteredTestcases.length !== 1 ? 's' : ''}</>
            )}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-500/30 hover:bg-cyan-500/40 border border-cyan-400/60 text-cyan-300 rounded-lg font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestcaseModal;
