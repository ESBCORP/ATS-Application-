import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Workflow, Eye, EyeOff, Users, TrendingUp, Shield, Award, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Chatbot from '../../components/ui/Chatbot';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const { login, error: loginError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(emailOrUsername, password);
      navigate(from, { replace: true });
    } catch (error) {
      // Error handled in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotMessage('');
    try {
      await axios.post('https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/auth/forgot-password', {
        email: forgotEmail
      }, {
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json'
        }
      });
      setForgotMessage('Reset instructions sent. Please check your email.');
    } catch (error: any) {
      setForgotMessage(error?.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Welcome Section */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          {/* Brand Header */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
                  <Workflow className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  VirtuosoU
                </h1>
                <p className="text-slate-600 font-medium">Recruitment Excellence</p>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h2 className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Hiring Process
              </span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              Join thousands of companies using our AI-powered ATS to find, manage, and hire the best talent efficiently.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            {[
              { icon: Shield, text: "Enterprise-grade security & compliance" },
              { icon: Users, text: "Advanced candidate management tools" },
              { icon: TrendingUp, text: "Real-time analytics & hiring insights" },
              { icon: Award, text: "99.9% uptime with 24/7 support" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-4 group">
                <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-slate-700 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
            {[
              { value: "50K+", label: "Companies" },
              { value: "2M+", label: "Candidates" },
              { value: "99.9%", label: "Uptime" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Mobile Brand Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Workflow className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  VirtuosoU
                </h1>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              {!showForgot ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                    <p className="text-slate-600">Sign in to access your dashboard</p>
                  </div>

                  {/* Error Message */}
                  {loginError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-800">{loginError}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Username
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="emailOrUsername"
                          name="emailOrUsername"
                          type="text"
                          value={emailOrUsername}
                          onChange={(e) => setEmailOrUsername(e.target.value)}
                          placeholder="Enter your username"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                        />
                        {password && (
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-slate-600">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgot(true)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Sign In Button */}
                    <Button
                      type="submit"
                      fullWidth
                      isLoading={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Button>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500 font-medium">Or continue with</span>
                      </div>
                    </div>

                    {/* Google Sign In */}
                    <Button
                      type="button"
                      fullWidth
                      className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-3 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      onClick={async () => {
                        try {
                          const res = await fetch("https://esb-ats-bndke8f0gza5e8d0.eastus2-01.azurewebsites.net/auth/google/auth-url");
                          const data = await res.json();
                          window.location.href = data.auth_url;
                        } catch (err) {
                          console.error("Failed to fetch Google auth URL", err);
                        }
                      }}
                    >
                      <img
                        src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                        alt="Google"
                        className="h-5 w-5"
                      />
                      <span>Sign in with Google</span>
                    </Button>

                    {/* Google Error */}
                    {state?.googleError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600 text-center font-medium">{state.googleError}</p>
                      </div>
                    )}

                    {/* Sign Up Link */}
                    <div className="text-center pt-6 border-t border-slate-200">
                      <p className="text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                          Create Account
                        </Link>
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  {/* Forgot Password Form */}
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Reset Password</h2>
                    <p className="text-slate-600">Enter your email to receive reset instructions</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-700">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-400"
                      />
                    </div>

                    <Button
                      onClick={handleForgotPassword}
                      fullWidth
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Send Reset Link
                    </Button>

                    {forgotMessage && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <p className="text-sm text-blue-800 font-medium">{forgotMessage}</p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setShowForgot(false)}
                      className="w-full py-3 text-slate-600 hover:text-slate-800 font-medium transition-colors rounded-xl hover:bg-slate-50"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-sm text-slate-500">
                © 2024 VirtuosoU. Secure • Reliable • Professional
              </p>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Login;