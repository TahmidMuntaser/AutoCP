import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Zap, Brain, Users, TrendingUp, Code2, 
  Cpu, Target, Trophy, Rocket, CheckCircle, 
  Sparkles, Award, Lightbulb, CircuitBoard, Binary
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AboutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="bg-[#001a1f]">
      {/* Hero Section - Asymmetric Design */}
      <section className="relative overflow-hidden bg-linear-to-r from-[#002029] via-[#00303d] to-[#004052] text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-15 pb-24 relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left Content - Takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center space-x-2 bg-linear-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-400/30 mb-8 shadow-lg shadow-blue-500/20">
                <CircuitBoard size={20} className="text-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-cyan-300">AI-Powered Innovation</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-black mb-8 leading-tight">
                <span className="block text-white">Redefining</span>
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-purple-500">
                  Competitive
                </span>
                <span className="block text-transparent bg-clip-text bg-linear-to-r from-purple-500 via-purple-400 to-cyan-400">
                  Programming
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
                No more waiting weeks for problem setters. No more expensive expert teams. 
                AutoCP harnesses the power of AI to democratize competitive programming—instantly generating 
                high-quality problems for <span className="text-cyan-400 font-semibold">everyone, everywhere</span>.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleGetStarted}
                  className="group relative px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-600 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-cyan-500/40"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <Rocket size={22} className="group-hover:rotate-12 transition-transform" />
                    <span>Launch Your Journey</span>
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl font-semibold text-lg transition-all duration-300 border-2 border-white/30 hover:border-cyan-400"
                >
                  Explore Platform
                </button>
              </div>
            </div>

            {/* Right Stats Card - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* Glowing border effect */}
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                
                <div className="relative bg-[#003d4d]/60 backdrop-blur-xl rounded-2xl p-8 border border-cyan-500/30">
                  <div className="flex items-center space-x-3 mb-6">
                    <Binary className="w-8 h-8 text-cyan-400" />
                    <h3 className="text-2xl font-bold">Platform Stats</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                          <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-white">60-70%</p>
                          <p className="text-sm text-gray-400">Time Saved</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                          <Trophy className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-white">10,000+</p>
                          <p className="text-sm text-gray-400">Contests Enabled</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-cyan-500/20 rounded-lg group-hover:bg-cyan-500/30 transition-colors">
                          <Sparkles className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-white">∞</p>
                          <p className="text-sm text-gray-400">Problems Generated</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#001520" fillOpacity="1"/>
          </svg>
        </div>
      </section>

      {/* The Vision - Storytelling Section */}
      <section className="py-16 bg-[#001520] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Visual Element */}
            <div className="relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-linear-to-br from-red-500 to-red-600 rounded-2xl p-8 shadow-lg transform hover:-rotate-2 transition-transform">
                    <div className="text-white text-6xl mb-4">❌</div>
                    <h3 className="text-xl font-bold text-white mb-2">The Problem</h3>
                    <p className="text-red-100 text-sm">Weeks of manual work, limited access, expert dependency</p>
                  </div>
                  <div className="bg-linear-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-lg transform hover:rotate-2 transition-transform">
                    <Award className="w-12 h-12 text-white mb-3" />
                    <p className="text-white font-semibold">Only Elite Teams</p>
                  </div>
                </div>
                
                <div className="space-y-4 pt-8">
                  <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl p-8 shadow-lg transform hover:rotate-2 transition-transform">
                    <div className="text-white text-6xl mb-4">✨</div>
                    <h3 className="text-xl font-bold text-white mb-2">Our Solution</h3>
                    <p className="text-green-100 text-sm">AI automation, instant results, accessible to all</p>
                  </div>
                  <div className="bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-lg transform hover:-rotate-2 transition-transform">
                    <Rocket className="w-12 h-12 text-white mb-3" />
                    <p className="text-white font-semibold">Everyone Can Host</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full mb-6">
                <span className="text-blue-300 font-semibold text-sm">Our Mission</span>
              </div>
              
              <h2 className="text-5xl font-black text-white mb-6">
                Breaking Down Barriers
              </h2>
              
              <div className="space-y-6 text-gray-300 text-lg">
                <p className="leading-relaxed">
                  For years, competitive programming has been locked behind the gates of expertise. 
                  Creating quality problems requires <span className="font-bold text-white">expert problem setters</span>, 
                  takes <span className="font-bold text-white">weeks or months</span>, and is only accessible to 
                  <span className="font-bold text-white"> well-funded institutions</span>.
                </p>
                
                <p className="leading-relaxed">
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400">
                    We changed that.
                  </span>
                </p>
                
                <p className="leading-relaxed">
                  AutoCP uses fine-tuned AI models to generate complete problem sets—statements, testcases, 
                  complexity analysis—in <span className="font-bold text-cyan-400">seconds</span>. 
                  Now, any educator, club, or institution can host world-class contests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Redesigned Flow */}
      <section className="py-16 bg-linear-to-r from-[#002029] via-[#00303d] to-[#004052] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-purple-300 font-semibold text-sm">AI-Powered Workflow</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-4">
              How <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400">AutoCP</span> Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From idea to judge-ready problems in seconds—powered by cutting-edge AI
            </p>
          </div>

          {/* Flow Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Step 1 - Large */}
            <div className="group relative bg-linear-to-br from-[#003d5a] to-[#00202a] rounded-3xl p-8 border-2 border-cyan-500/40 hover:border-cyan-400 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg">
                      1
                    </div>
                    <h3 className="text-2xl font-black text-white">Select Topics</h3>
                  </div>
                  <Target className="w-10 h-10 text-cyan-400" />
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Choose your desired topics and difficulty level. From Dynamic Programming to Graph Theory, 
                  pick what matters to you.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 text-xs font-semibold">DP</span>
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 text-xs font-semibold">Graphs</span>
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-semibold">Greedy</span>
                  <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 text-xs font-semibold">Trees</span>
                </div>
              </div>
            </div>

            {/* Step 2 - Large */}
            <div className="group relative bg-linear-to-br from-[#3d1a4d] to-[#1f0d26] rounded-3xl p-8 border-2 border-purple-500/40 hover:border-purple-400 transition-all overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-400 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg">
                      2
                    </div>
                    <h3 className="text-2xl font-black text-white">AI Generation</h3>
                  </div>
                  <Brain className="w-10 h-10 text-purple-400" />
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Our fine-tuned LLM creates unique, high-quality problem statements with examples 
                  and constraints in real-time.
                </p>
                <div className="flex items-center space-x-2 text-purple-300 text-sm">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span>Generating unique problem...</span>
                </div>
              </div>
            </div>

            {/* Step 3 - Medium */}
            <div className="group relative bg-[#00303d] border border-[#004052] rounded-2xl p-6 hover:border-yellow-500/50 transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">Smart Testcases</h3>
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Auto-generate edge cases, validate constraints, and ensure correctness</p>
                  <div className="flex items-center text-yellow-400 text-xs font-semibold">
                    <CheckCircle size={14} className="mr-1" />
                    <span>10+ test cases generated</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1 w-0 group-hover:w-full bg-linear-to-r from-yellow-500 to-orange-500 transition-all duration-300 rounded-full"></div>
            </div>

            {/* Step 4 - Medium */}
            <div className="group relative bg-[#00303d] border border-[#004052] rounded-2xl p-6 hover:border-green-500/50 transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-lg shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">Export Ready</h3>
                    <Rocket className="w-8 h-8 text-green-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-3">Download in JSON/TXT format compatible with any online judge platform</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-green-300 text-xs font-semibold">JSON</span>
                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-300 text-xs font-semibold">TXT</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1 w-0 group-hover:w-full bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-300 rounded-full"></div>
            </div>
          </div>

          {/* Time Comparison */}
          <div className="bg-[#00202a]/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-2xl font-black text-white mb-4">
                  Speed That <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-400">Matters</span>
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">❌</span>
                      </div>
                      <span className="text-gray-300">Traditional Method</span>
                    </div>
                    <span className="text-red-400 font-bold">2-4 weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-lg">✨</span>
                      </div>
                      <span className="text-gray-300">With AutoCP</span>
                    </div>
                    <span className="text-green-400 font-bold text-xl">2-5 seconds</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-linear-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-6 border border-purple-500/20">
                  <div className="text-center">
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-purple-400 to-cyan-400 mb-2">
                      99.9%
                    </div>
                    <p className="text-gray-300 font-semibold">Faster Problem Generation</p>
                    <p className="text-gray-400 text-sm mt-2">Compared to manual creation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve - Redesigned Bento Grid */}
      <section className="py-16 bg-[#001520] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-4 py-2 rounded-full mb-6">
              <Users className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 font-semibold text-sm">Universal Access</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-4">
              Built for <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400">Every Creator</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              One platform, infinite possibilities—from classrooms to global competitions
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Large card - Educators (spans 2 cols) */}
            <div className="lg:col-span-2 group relative bg-linear-to-br from-[#00405a] to-[#002838] rounded-3xl p-8 border-2 border-cyan-500/40 hover:border-cyan-400 transition-all overflow-hidden min-h-[280px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3">Educators</h3>
                <p className="text-gray-300 mb-4 text-sm">Design custom contests tailored to your curriculum with adjustable difficulty levels</p>
                <div className="flex items-center text-cyan-400 font-semibold group-hover:translate-x-2 transition-transform">
                  <span className="text-sm">Explore for Teachers</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </div>

            {/* Tall card - ICPC Teams (spans 2 rows) */}
            <div className="lg:col-span-2 lg:row-span-2 group relative bg-linear-to-br from-[#3d1a4d] to-[#1f0d26] rounded-3xl p-8 border-2 border-purple-500/40 hover:border-purple-400 transition-all overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-purple-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <span className="text-3xl">💻</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-3">ICPC Teams</h3>
                <p className="text-gray-300 mb-4 text-sm">Get unlimited fresh problems matching competition standards. Practice like you compete.</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-purple-300 text-sm">
                    <CheckCircle size={16} className="mr-2 text-purple-400" />
                    <span>Contest-level difficulty</span>
                  </div>
                  <div className="flex items-center text-purple-300 text-sm">
                    <CheckCircle size={16} className="mr-2 text-purple-400" />
                    <span>Real-time testcases</span>
                  </div>
                  <div className="flex items-center text-purple-300 text-sm">
                    <CheckCircle size={16} className="mr-2 text-purple-400" />
                    <span>Topic-based practice</span>
                  </div>
                </div>
                <div className="flex items-center text-purple-400 font-semibold text-sm group-hover:translate-x-2 transition-transform">
                  <span>Start Practicing</span>
                  <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            </div>

            {/* Medium card - Universities */}
            <div className="lg:col-span-2 group relative bg-[#00303d] border border-[#004052] rounded-2xl p-6 hover:border-green-500/50 transition-all hover:-translate-y-1 min-h-[140px]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">🏫</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">Universities</h3>
                  <p className="text-gray-400 text-sm">Host institution-wide competitions at any scale</p>
                </div>
              </div>
              <div className="mt-3 h-1 w-0 group-hover:w-full bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-300 rounded-full"></div>
            </div>

            {/* Small cards */}
            <div className="lg:col-span-2 group relative bg-[#00303d] border border-[#004052] rounded-2xl p-6 hover:border-yellow-500/50 transition-all hover:-translate-y-1 min-h-[140px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-2xl">📚</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Self-Learners</h3>
                  <p className="text-gray-400 text-sm">Master topics with targeted practice</p>
                </div>
                <ArrowRight className="text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" size={18} />
              </div>
            </div>

            <div className="lg:col-span-2 group relative bg-[#00303d] border border-[#004052] rounded-2xl p-6 hover:border-indigo-500/50 transition-all hover:-translate-y-1 min-h-[140px]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-2xl">👥</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Communities</h3>
                  <p className="text-gray-400 text-sm">Engage members with fresh challenges</p>
                </div>
                <ArrowRight className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" size={18} />
              </div>
            </div>

            {/* Wide featured card - OJ Platforms */}
            <div className="lg:col-span-4 group relative bg-linear-to-r from-[#2a1a3d] via-[#1a2838] to-[#1a3d3d] rounded-3xl p-8 border-2 border-purple-400/30 hover:border-purple-400 transition-all overflow-hidden">
              <div className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/30 px-3 py-1 rounded-full mb-4">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 font-semibold text-xs">For Platforms</span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black text-white mb-3">
                    Online Judge <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-cyan-400">Integration</span>
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">Seamlessly integrate AI-powered problem generation into your platform. Scale your content library instantly with our robust API.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-300 text-xs font-semibold">API Access</span>
                    <span className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-400/30 rounded-lg text-cyan-300 text-xs font-semibold">Bulk Generation</span>
                    <span className="px-3 py-1.5 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 text-xs font-semibold">Custom Topics</span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="bg-[#00202a]/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Endpoints</span>
                        <span className="text-cyan-400 font-mono text-sm">5+ REST APIs</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Response Time</span>
                        <span className="text-green-400 font-mono text-sm">&lt; 2 seconds</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Uptime</span>
                        <span className="text-purple-400 font-mono text-sm">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[#004052]">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400 mb-1 group-hover:scale-110 transition-transform">10K+</div>
              <p className="text-xs text-gray-400">Educators</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-500 mb-1 group-hover:scale-110 transition-transform">500+</div>
              <p className="text-xs text-gray-400">Universities</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-400 mb-1 group-hover:scale-110 transition-transform">50K+</div>
              <p className="text-xs text-gray-400">Students</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400 mb-1 group-hover:scale-110 transition-transform">∞</div>
              <p className="text-xs text-gray-400">Problems</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Bold and Engaging */}
      <section className="relative py-20 bg-linear-to-r from-[#002029] via-[#003d4d] to-[#004052] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 mb-8">
            <Sparkles size={20} className="text-yellow-400" />
            <span className="text-sm font-semibold text-white">Join the Revolution</span>
          </div>

          <h2 className="text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            Ready to Transform
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-purple-500">
              Your CP Journey?
            </span>
          </h2>
          
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop waiting for problem setters. Start creating contests in minutes. 
            <span className="text-cyan-400 font-semibold block mt-2">The future of competitive programming is here.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={handleGetStarted}
              className="group relative px-10 py-5 bg-linear-to-r from-cyan-600 to-blue-600 rounded-xl font-black text-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <Rocket size={24} className="group-hover:rotate-12 transition-transform" />
                <span>Start Free Now</span>
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="px-10 py-5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl font-bold text-xl transition-all duration-300 border-2 border-white/30 hover:border-cyan-400 text-white"
            >
              View Platform Demo
            </button>
          </div>

          {/* Social proof */}
          <div className="mt-16 flex flex-wrap justify-center gap-12 text-gray-400">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">10,000+</p>
              <p className="text-sm">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50,000+</p>
              <p className="text-sm">Problems Generated</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">95%</p>
              <p className="text-sm">Success Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
