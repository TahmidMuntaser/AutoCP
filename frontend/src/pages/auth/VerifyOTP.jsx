import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, Loader2, MailCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../components/Toast/CustomToast';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, resendVerification } = useAuth();
  
  const email = location.state?.email || '';
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showToast.error('Email not found. Please register again.');
      navigate('/register');
      return;
    }

    if (!verificationCode || verificationCode.length !== 6) {
      showToast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    const toastId = showToast.loading('Verifying your email...');

    try {
      const result = await verifyEmail(email, verificationCode);
      
      if (result.success) {
        showToast.dismiss(toastId);
        showToast.success('Email verified! Welcome to AutoCP!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        showToast.dismiss(toastId);
        showToast.error(result.message || 'Verification failed');
      }
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showToast.error('Email not found');
      return;
    }

    setLoading(true);
    const toastId = showToast.loading('Resending code...');

    try {
      const result = await resendVerification(email);
      
      showToast.dismiss(toastId);
      if (result.success) {
        showToast.success('Verification code sent!');
      } else {
        showToast.error(result.message || 'Failed to resend code');
      }
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error('Failed to resend code');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-3xl font-bold text-white">Almost There!</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              Check your email and enter the verification code to complete your registration and start generating problems.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-gray-300">Secure Email Verification</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-gray-300">Code Valid for 10 Minutes</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <p className="text-gray-300">Instant Account Activation</p>
            </div>
          </div>

          <div className="pt-4">
            <Link to="/" className="inline-flex items-center text-white hover:text-gray-200 text-sm font-medium">
              <span className="mr-2">←</span> Back to Home
            </Link>
          </div>
        </div>

        {/* Right Side - Verification Form */}
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
            <h1 className="text-xl font-bold text-white mb-1">Verify Email</h1>
            <p className="text-sm text-gray-300">
              {email ? `We sent a code to ${email}` : 'Enter your verification code'}
            </p>
          </div>

          {/* Verification Card */}
          <div className="bg-[#00607a] rounded-2xl shadow-2xl p-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00303d] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#004052] p-3">
                  <img 
                    src="/src/assets/mail.png" 
                    alt="Email Verification" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-sm text-white mb-4">
                  Enter the 6-digit verification code we sent to your email
                </p>
              </div>

              {/* Verification Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-white mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  maxLength="6"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="block w-full px-4 py-2.5 text-center text-2xl font-bold tracking-widest border border-[#00303d] rounded-lg focus:ring-2 focus:ring-[#004052] focus:border-transparent outline-none transition-all bg-[#005066] text-white placeholder-gray-300"
                  placeholder="000000"
                  disabled={loading}
                />
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[#00303d] hover:bg-[#004052] text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    <span>Verify Email</span>
                  </>
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm text-white hover:text-gray-200 font-medium disabled:opacity-50"
                >
                  Didn't receive code? Resend
                </button>
              </div>

              {/* Back to Register */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-sm text-white hover:text-gray-200"
                >
                  ← Change email address
                </button>
              </div>
            </form>

            {/* Already verified */}
            <p className="text-center text-sm text-white mt-4">
              Already verified?{' '}
              <Link to="/login" className="text-gray-200 hover:text-white font-semibold underline">
                Sign in
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

export default VerifyOTP;
