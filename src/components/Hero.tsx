import { Link } from 'react-router-dom';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeroProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function Hero({ onOpenAuth }: HeroProps) {
  const { user } = useAuth();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

      <div className="hidden lg:block absolute top-20 left-10 animate-float">
        <Sun className="text-gold-400" size={40} />
      </div>
      <div className="hidden lg:block absolute top-32 right-20 animate-float" style={{ animationDelay: '1s' }}>
        <Cloud className="text-white/80" size={48} />
      </div>
      <div className="hidden lg:block absolute bottom-40 left-16 animate-float" style={{ animationDelay: '2s' }}>
        <CloudRain className="text-blue-300" size={36} />
      </div>
      <div className="hidden lg:block absolute bottom-32 right-32 animate-float" style={{ animationDelay: '1.5s' }}>
        <Wind className="text-cream-100" size={32} />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto animate-fade-in py-20">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-white mb-4 sm:mb-6 leading-tight">
          Perfect Weather for Your
          <span className="block text-gold-400">Perfect Day</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-cream-100 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
          Plan your dream wedding with confidence. Get comprehensive weather insights,
          golden hour timings, and personalized recommendations for your special celebration.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
          {user ? (
            <Link
              to="/"
              className="inline-flex bg-gradient-to-r from-gold-500 to-gold-600 text-white px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl min-h-[48px] touch-manipulation items-center justify-center"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('signup')}
                className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all transform hover:scale-105 active:scale-95 shadow-xl min-h-[48px] touch-manipulation"
              >
                Start Planning Your Wedding
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-6 sm:px-8 py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white/30 active:bg-white/40 transition-all min-h-[48px] touch-manipulation"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
