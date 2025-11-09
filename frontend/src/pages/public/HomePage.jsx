import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  Target, 
  Code2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Award,
  FileCode,
  GitBranch,
  Rocket
} from 'lucide-react';
import { Skeleton } from '../../components/Loading/SkeletonLoader';

const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Generation',
      description: 'Generate high-quality competitive programming problems using advanced AI models',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Zap,
      title: 'Instant Testcases',
      description: 'Automatically create comprehensive testcases with edge cases covered',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Target,
      title: 'Complexity Analysis',
      description: 'Get accurate time and space complexity estimates for each problem',
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      icon: FileCode,
      title: 'Judge-Ready Export',
      description: 'Export problems in formats compatible with major online judges',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  const stats = [
    { icon: Users, label: 'Active Users', value: '10,000+', color: 'text-blue-600' },
    { icon: Code2, label: 'Problems Generated', value: '50,000+', color: 'text-green-600' },
    { icon: Award, label: 'Contests Hosted', value: '1,500+', color: 'text-purple-600' },
    { icon: TrendingUp, label: 'Success Rate', value: '95%', color: 'text-orange-600' }
  ];

  const benefits = [
    'Saves 60-70% of problem-setting time',
    'Unlimited practice problems for learners',
    'No dependency on human problem setters',
    'Supports multiple difficulty levels',
    'Covers all major CP topics',
    'Instant problem generation'
  ];

  const topics = [
    'Dynamic Programming', 'Graph Algorithms', 'Greedy', 'Trees',
    'Binary Search', 'Sorting', 'Data Structures', 'Number Theory',
    'Strings', 'Geometry', 'Game Theory', 'Combinatorics'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#002029] via-[#00303d] to-[#004052]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Hero Section Skeleton */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-40 rounded" />
              </div>
            </div>
            
            <Skeleton className="h-14 w-3/4 mx-auto mb-6 rounded-xl" />
            <Skeleton className="h-6 w-2/3 mx-auto mb-10 rounded-lg" />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-14 w-48 rounded-lg mx-auto sm:mx-0" />
              <Skeleton className="h-14 w-40 rounded-lg mx-auto sm:mx-0" />
            </div>
          </div>

          {/* Stats Section Skeleton */}
          <div className="bg-[#00607a]/30 backdrop-blur-sm border border-[#004052] rounded-2xl p-8 mb-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="text-center">
                  <Skeleton className="h-10 w-10 mx-auto mb-3 rounded-xl" />
                  <Skeleton className="h-8 w-24 mx-auto mb-2 rounded" />
                  <Skeleton className="h-4 w-20 mx-auto rounded" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Feature Cards Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-[#00303d]/60 backdrop-blur-xl border border-[#004052] rounded-2xl p-6 shadow-sm">
                <Skeleton className="h-14 w-14 rounded-xl mb-4" />
                <Skeleton className="h-6 w-4/5 mb-3 rounded-lg" />
                <Skeleton className="h-4 w-full mb-2 rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section - Full Screen */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#002029] via-[#00303d] to-[#004052] text-white min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Sparkles size={18} className="text-yellow-400" />
                <span className="text-sm font-medium">AI-Powered CP Platform</span>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Generate Competitive Programming
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Problems with AI
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              AutoCP automates the full problem-setting pipeline — reducing dependency on human problem setters and making competitive programming accessible to everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group inline-flex items-center space-x-2 px-8 py-4 bg-[#004052] hover:bg-[#005066] rounded-lg font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>Get Started Free</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg font-semibold text-lg transition-all duration-200 border border-white/20"
              >
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#00607a] border-y border-[#004052]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className={`p-3 bg-white bg-opacity-10 rounded-xl ${stat.color}`}>
                    <stat.icon size={28} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-[#002029] via-[#00303d] to-[#004052]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Powerful Features for Problem Setters
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to create, host, and manage competitive programming contests
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-[#00607a] rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#004052] hover:border-[#005066] hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} className={feature.color} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 bg-gradient-to-br from-[#002029] to-[#00303d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              All Major CP Topics Covered
            </h2>
            <p className="text-xl text-gray-300">
              Generate problems across all competitive programming domains
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {topics.map((topic, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white font-medium transition-all duration-200 border border-white/20 hover:scale-105 cursor-pointer"
              >
                {topic}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#00607a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-[#004052] px-4 py-2 rounded-full mb-6 border border-[#005066]">
                <GitBranch size={18} className="text-white" />
                <span className="font-semibold text-white">Why Choose AutoCP?</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Automate Your Problem Setting Workflow
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                AutoCP revolutionizes competitive programming by automating the tedious process of problem creation. Focus on teaching and organizing contests while AI handles the heavy lifting.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#004052] to-[#002029] rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Brain size={20} className="text-white" />
                      </div>
                      <span className="text-white font-semibold text-lg">AI Engine</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 w-11/12 animate-pulse"></div>
                    </div>
                    <p className="text-gray-300 text-sm mt-2">Generating problem...</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <Zap size={20} className="text-white" />
                      </div>
                      <span className="text-white font-semibold text-lg">Testcase Generator</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Testcases Created:</span>
                        <span className="text-white font-semibold">50/50</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 w-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <CheckCircle size={20} className="text-white" />
                        </div>
                        <span className="text-white font-semibold text-lg">Ready to Export</span>
                      </div>
                      <Rocket size={24} className="text-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#002029] via-[#00303d] to-[#004052]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Contest Preparation?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of problem setters, educators, and competitive programmers already using AutoCP
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center space-x-2 px-10 py-5 bg-[#004052] hover:bg-[#005066] text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <span>Start Generating Problems Now</span>
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
