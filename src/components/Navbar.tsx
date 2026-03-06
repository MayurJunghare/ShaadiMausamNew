import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cloud, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  variant?: 'app' | 'marketing';
}

export function Navbar({ onOpenAuth, variant = 'marketing' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isApp = variant === 'app';
  const isHome = location.pathname === '/';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          >
            <Cloud className="text-gold-500" size={32} />
            <span className="text-2xl font-heading font-bold text-maroon-500">
              ShaadiMausam
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {isApp ? (
              <>
                <Link
                  to="/"
                  className={`font-medium transition-colors ${
                    location.pathname === '/'
                      ? 'text-gold-600'
                      : 'text-gray-700 hover:text-gold-600'
                  }`}
                >
                  Plan Wedding
                </Link>
                <Link
                  to="/pricing"
                  className={`font-medium transition-colors ${
                    location.pathname === '/pricing'
                      ? 'text-gold-600'
                      : 'text-gray-700 hover:text-gold-600'
                  }`}
                >
                  Pricing
                </Link>
              </>
            ) : isHome ? (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-700 hover:text-gold-600 transition-colors font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-700 hover:text-gold-600 transition-colors font-medium"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('demo')}
                  className="text-gray-700 hover:text-gold-600 transition-colors font-medium"
                >
                  Demo
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-700 hover:text-gold-600 transition-colors font-medium"
                >
                  Pricing
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-gold-600 transition-colors font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/pricing"
                  className={`font-medium transition-colors ${
                    location.pathname === '/pricing'
                      ? 'text-gold-600'
                      : 'text-gray-700 hover:text-gold-600'
                  }`}
                >
                  Pricing
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span className="text-sm">{user.email}</span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 text-maroon-600 hover:text-maroon-700 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="text-gray-700 hover:text-gold-600 transition-colors font-medium"
                >
                  {isApp ? 'Login' : 'Sign In'}
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 p-2 -mr-2 touch-manipulation active:bg-gray-100 rounded-lg transition-colors"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {isApp ? (
              <>
                <Link
                  to="/"
                  className="block w-full text-left text-gray-700 hover:text-gold-600 active:bg-gray-50 py-3 px-3 rounded-lg transition-colors touch-manipulation font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Plan Wedding
                </Link>
                <Link
                  to="/pricing"
                  className="block w-full text-left text-gray-700 hover:text-gold-600 active:bg-gray-50 py-3 px-3 rounded-lg transition-colors touch-manipulation font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
              </>
            ) : isHome ? (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left text-gray-700 hover:text-gold-600 active:bg-gray-50 py-3 px-3 rounded-lg transition-colors touch-manipulation font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="block w-full text-left text-gray-700 hover:text-gold-600 active:bg-gray-50 py-3 px-3 rounded-lg transition-colors touch-manipulation font-medium"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollToSection('demo')}
                  className="block w-full text-left text-gray-700 hover:text-gold-600 active:bg-gray-50 py-3 px-3 rounded-lg transition-colors touch-manipulation font-medium"
                >
                  Demo
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left text-gray-700 hover:text-gold-600 active:bg-gray-50 py-3 px-3 rounded-lg transition-colors touch-manipulation font-medium"
                >
                  Pricing
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="block w-full text-left text-gray-700 hover:text-gold-600 active:bg-gray-50 py-3 px-3 rounded-lg transition-colors touch-manipulation font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/pricing"
                  className="block w-full text-left text-gray-700 hover:text-gold-600 active:bg-gray-50 py-3 px-3 rounded-lg transition-colors touch-manipulation font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
              </>
            )}
            {user ? (
              <>
                <div className="text-sm text-gray-600 py-3 px-3 border-t mt-2 pt-3">{user.email}</div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 text-maroon-600 active:bg-red-50 py-3 px-3 rounded-lg w-full transition-colors touch-manipulation font-medium"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="block w-full text-left text-gray-700 hover:text-gold-600 active:bg-gray-50 py-3 px-3 rounded-lg transition-colors touch-manipulation font-medium border-t mt-2"
                >
                  {isApp ? 'Login' : 'Sign In'}
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-3 rounded-lg font-semibold active:from-gold-600 active:to-gold-700 transition-all shadow-md min-h-[48px] touch-manipulation mt-2"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
