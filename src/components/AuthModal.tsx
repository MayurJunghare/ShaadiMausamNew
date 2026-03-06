import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, mode: initialMode }: AuthModalProps) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // When modal opens, show the correct form (login vs signup)
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = mode === 'login'
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        // Supabase returns "Invalid login credentials" for wrong email/password or unconfirmed email
        const message = error.message === 'Invalid login credentials'
          ? 'Wrong email or password. Try again or sign up if you don\'t have an account.'
          : error.message;
        setError(message);
      } else {
        onClose();
        setEmail('');
        setPassword('');
        navigate('/');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      if (msg === 'Failed to fetch' || msg.toLowerCase().includes('fetch')) {
        setError(
          'Cannot reach the server. Check your internet, ensure the Supabase project is not paused (Dashboard → Project Settings), and try again.'
        );
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 relative animate-slide-up my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 active:text-gray-900 transition-colors p-2 -m-2 touch-manipulation"
          aria-label="Close dialog"
        >
          <X size={28} />
        </button>

        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-maroon-500 mb-2 pr-8">
          {mode === 'login' ? 'Welcome Back' : 'Get Started'}
        </h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          {mode === 'login'
            ? 'Sign in to access your wedding weather plans'
            : 'Create an account to start planning your perfect day'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-base min-h-[48px]"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-base min-h-[48px]"
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-4 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-700 active:from-gold-700 active:to-gold-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg min-h-[48px] touch-manipulation"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-gray-600 text-sm sm:text-base">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-gold-600 font-semibold hover:text-gold-700 active:text-gold-800 transition-colors touch-manipulation p-1 -m-1"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
