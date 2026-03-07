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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, resetPasswordForEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  // When modal opens, show the correct form (login vs signup)
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowForgotPassword(false);
      setForgotPasswordSent(false);
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

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const { error: err } = await signInWithGoogle();
      if (err) {
        setError(err.message);
      }
      // If no error, Supabase redirects to Google; no need to close modal
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  }; 

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: err } = await resetPasswordForEmail(email);
      if (err) {
        setError(err.message);
      } else {
        setForgotPasswordSent(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
          {showForgotPassword
            ? forgotPasswordSent
              ? 'Check your email'
              : 'Reset password'
            : mode === 'login'
              ? 'Welcome Back'
              : 'Get Started'}
        </h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          {showForgotPassword
            ? forgotPasswordSent
              ? "If an account exists for that email, we've sent a link to reset your password."
              : "Enter your email and we'll send you a link to reset your password."
            : mode === 'login'
              ? 'Sign in to access your wedding weather plans'
              : 'Create an account to start planning your perfect day'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {showForgotPassword ? (
          forgotPasswordSent ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordSent(false);
                }}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-4 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all min-h-[48px] touch-manipulation"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-base min-h-[48px]"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-4 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg min-h-[48px] touch-manipulation"
              >
                {loading ? 'Please wait...' : 'Send reset link'}
              </button>
              <p className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-gold-600 font-semibold hover:text-gold-700 transition-colors touch-manipulation"
                >
                  Back to sign in
                </button>
              </p>
            </form>
          )
        ) : (
        <>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[48px] touch-manipulation"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

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
            {mode === 'login' && (
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-gold-600 text-sm font-semibold hover:text-gold-700 transition-colors touch-manipulation"
                >
                  Forgot password?
                </button>
              </div>
            )}
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
        </>
        )}
      </div>
    </div>
  );
}
