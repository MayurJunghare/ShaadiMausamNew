import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CallToActionProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function CallToAction({ onOpenAuth }: CallToActionProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('newsletter_signups')
        .insert([{ email }]);

      if (insertError) {
        setError('Something went wrong. Please try again.');
      } else {
        setSuccess(true);
        setEmail('');
        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-maroon-600 via-maroon-500 to-rose-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-4 sm:mb-6 px-4">
            {user ? 'Start Planning Your Perfect Wedding' : 'Ready to Plan Your Dream Wedding?'}
          </h2>
          <p className="text-lg sm:text-xl text-cream-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            {user
              ? 'You are all set! Head to your dashboard to start exploring weather insights for your special day.'
              : 'Join thousands of couples who trust ShaadiMausam for weather-perfect wedding planning.'}
          </p>

          {user ? (
            <button className="bg-white text-maroon-600 px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-cream-50 active:bg-cream-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl min-h-[48px] touch-manipulation">
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={() => onOpenAuth('signup')}
              className="bg-white text-maroon-600 px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-cream-50 active:bg-cream-100 transition-all transform hover:scale-105 active:scale-95 shadow-xl min-h-[48px] touch-manipulation"
            >
              Get Started Free
            </button>
          )}

          <div className="mt-10 sm:mt-12 pt-10 sm:pt-12 border-t border-white/20">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3 sm:mb-4 px-4">
              Stay Updated with Wedding Planning Tips
            </h3>
            <p className="text-cream-100 mb-6 px-4 text-sm sm:text-base">
              Subscribe to our newsletter for weather insights and wedding planning advice
            </p>

            {success ? (
              <div className="max-w-md mx-auto bg-green-500 text-white px-6 py-4 rounded-lg flex items-center justify-center space-x-3 shadow-lg">
                <CheckCircle size={24} />
                <span className="font-semibold">Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3.5 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none text-base min-h-[48px]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gold-500 text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-gold-600 active:bg-gold-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg min-h-[48px] touch-manipulation whitespace-nowrap"
                  >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                {error && (
                  <div className="mt-3 text-red-200 text-sm">{error}</div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
