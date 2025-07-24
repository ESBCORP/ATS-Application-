import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Building, Workflow } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Chatbot from '../../components/ui/Chatbot';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      // Here you would typically make an API call to create the account
      // For now, we'll just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/login');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center bg-white/10 rounded-2xl backdrop-blur-lg">
            <Workflow className="h-12 w-12 text-white transform -rotate-12" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Join VirtuosoU and streamline your recruitment process
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Registration failed</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-lg bg-white/10 p-6 backdrop-blur-lg">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="First name"
                  required
                  className="block w-full pl-10 bg-white/5 text-white placeholder-gray-300 border-gray-500 focus:border-teal-400 focus:ring-teal-400"
                />
              </div>
              
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Last name"
                  required
                  className="block w-full pl-10 bg-white/5 text-white placeholder-gray-300 border-gray-500 focus:border-teal-400 focus:ring-teal-400"
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
                required
                className="block w-full pl-10 bg-white/5 text-white placeholder-gray-300 border-gray-500 focus:border-teal-400 focus:ring-teal-400"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
                required
                className="block w-full pl-10 bg-white/5 text-white placeholder-gray-300 border-gray-500 focus:border-teal-400 focus:ring-teal-400"
              />
            </div>

            <div className="relative">
              <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
              <Input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Company name"
                required
                className="block w-full pl-10 bg-white/5 text-white placeholder-gray-300 border-gray-500 focus:border-teal-400 focus:ring-teal-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Password"
                required
                className="block w-full pl-10 bg-white/5 text-white placeholder-gray-300 border-gray-500 focus:border-teal-400 focus:ring-teal-400"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm password"
                required
                className="block w-full pl-10 bg-white/5 text-white placeholder-gray-300 border-gray-500 focus:border-teal-400 focus:ring-teal-400"
              />
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-500 bg-white/5 text-teal-400 focus:ring-teal-400"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-300">
                I agree to the <Link to="/terms" className="text-teal-400 hover:text-teal-300">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="text-teal-400 hover:text-teal-300">Privacy Policy</Link>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="bg-teal-500 hover:bg-teal-400 focus:ring-teal-400"
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-300">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-teal-400 hover:text-teal-300">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
      <Chatbot />
    </div>
  );
};

export default Signup;