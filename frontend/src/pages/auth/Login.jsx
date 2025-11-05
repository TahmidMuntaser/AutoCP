import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../components/Toast/CustomToast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      showToast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const toastId = showToast.loading('Logging in...');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        showToast.dismiss(toastId);
        showToast.success('Login successful! Welcome back!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        showToast.dismiss(toastId);
        showToast.error(result.message || 'Login failed');
      }
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    showToast.custom('Google OAuth coming soon!', { icon: '🚀' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002029] via-[#00303d] to-[#004052] flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Logo and Info */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <div className="flex items-center space-x-4">
            <img 
              src="/src/assets/logo.png" 
              alt="AutoCP Logo" 
              className="h-16 w-16 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <h2 className="text-4xl font-bold text-white">AutoCP</h2>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Login to continue generating AI-powered competitive programming problems and managing your contests.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-gray-300">AI-Powered Problem Generation</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-gray-300">Instant Testcase Creation</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <p className="text-gray-300">Contest Management Tools</p>
            </div>
          </div>

          <div className="pt-4">
            <Link to="/" className="inline-flex items-center text-white hover:text-gray-200 text-sm font-medium">
              <span className="mr-2">←</span> Back to Home
            </Link>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          {/* Mobile Logo and Title */}
          <div className="lg:hidden text-center mb-6">
            <div className="flex justify-center items-center space-x-3 mb-3">
              <img 
                src="/src/assets/logo.png" 
                alt="AutoCP Logo" 
                className="h-12 w-12 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <h2 className="text-2xl font-bold text-white">AutoCP</h2>
            </div>
            <h1 className="text-xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-sm text-gray-300">Login to continue to AutoCP</p>
          </div>

        {/* Login Card */}
        <div className="bg-[#00607a] rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#00303d] rounded-lg focus:ring-2 focus:ring-[#004052] focus:border-transparent outline-none transition-all bg-[#005066] text-white placeholder-gray-300"
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-[#00303d] rounded-lg focus:ring-2 focus:ring-[#004052] focus:border-transparent outline-none transition-all bg-[#005066] text-white placeholder-gray-300"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-white hover:text-gray-200 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#00303d] hover:bg-[#004052] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-400"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#00607a] text-white">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 border-2 border-gray-400 hover:border-white bg-white rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium text-gray-700">Continue with Google</span>
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-white mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-gray-200 hover:text-white font-semibold underline">
              Sign up
            </Link>
          </p>

          {/* Mobile Back to Home */}
          <div className="lg:hidden text-center mt-4 pt-4 border-t border-gray-400">
            <Link to="/" className="inline-flex items-center text-white hover:text-gray-200 text-sm font-medium">
              <span className="mr-2">←</span> Back to Home
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
