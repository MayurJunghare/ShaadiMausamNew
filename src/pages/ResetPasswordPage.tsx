import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setHasSession(!!session?.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setHasSession(!!session?.user);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) {
        setError(err.message);
      } else {
        navigate('/', { replace: true });
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (hasSession === null) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-lg border border-amber-100">
          <h1 className="text-2xl font-heading font-bold text-maroon-500 mb-2">
            Invalid or expired link
          </h1>
          <p className="text-gray-600 mb-6 text-sm">
            This reset link is invalid or has expired. Please request a new one from the sign-in page.
          </p>
          <Link
            to="/"
            className="inline-block w-full text-center bg-gradient-to-r from-gold-500 to-gold-600 text-white py-3 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all"
          >
            Go to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-lg border border-amber-100">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-maroon-500 mb-2">
          Set new password
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Enter your new password below.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
              New password
            </label>
            <input
              type="password"
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-base min-h-[48px]"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all text-base min-h-[48px]"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white py-4 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg min-h-[48px] touch-manipulation"
          >
            {loading ? 'Please wait...' : 'Update password'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          <Link to="/" className="text-gold-600 font-semibold hover:text-gold-700">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
