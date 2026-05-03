import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = (() => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', { email, password });
      const { user, accessToken, refreshToken } = response.data;

      login(accessToken, user);
      localStorage.setItem('refreshToken', refreshToken);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 -right-40 w-80 h-80 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full opacity-10 blur-3xl animate-pulse-soft"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-500 to-cyan-500 rounded-full opacity-10 blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Card */}
        <div className="card overflow-hidden">
          <div className="h-1 bg-gradient-accent"></div>
          
          <div className="p-8 md:p-12">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gradient-accent rounded-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">MeterFlow</h1>
                <p className="text-xs text-gray-400">API Platform</p>
              </div>
            </div>

            {/* Welcome text */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Get Started</h2>
              <p className="text-gray-400">Create your account and start building</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-base pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {/* Password strength indicator */}
                {password && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i < passwordStrength
                            ? 'bg-gradient-accent'
                            : 'bg-gray-700'
                        }`}
                      ></div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-base pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {confirmPassword && password === confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-green-400 text-sm">
                    <CheckCircle size={16} />
                    <span>Passwords match</span>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm flex gap-2 animate-slide-up">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-semibold mt-8"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-transparent border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Already have account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <button
              onClick={() => navigate('/login')}
              className="w-full px-4 py-3 bg-gray-700/50 hover:bg-gray-700 text-white font-medium rounded-lg transition-smooth border border-gray-600 hover:border-gray-500"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2024 MeterFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
}
