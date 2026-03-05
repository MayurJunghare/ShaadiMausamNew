import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ProblemSolution } from '../components/ProblemSolution';
import { Features } from '../components/Features';
import { HowItWorks } from '../components/HowItWorks';
import { VisualDemo } from '../components/VisualDemo';
import { Pricing } from '../components/Pricing';
import { CallToAction } from '../components/CallToAction';
import { Footer } from '../components/Footer';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

/**
 * Home page: Navbar + full-screen video, then landing sections (ProblemSolution, Features, HowItWorks, VisualDemo, CallToAction, Footer).
 * Scroll to hash (e.g. /#features) when navigating from another route.
 */
export function LandingPage({ onOpenAuth }: LandingPageProps) {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onOpenAuth={onOpenAuth} />
      <Hero onOpenAuth={onOpenAuth} />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <VisualDemo />
      <Pricing onOpenAuth={onOpenAuth} />
      <CallToAction onOpenAuth={onOpenAuth} />
      <Footer />
    </div>
  );
}
