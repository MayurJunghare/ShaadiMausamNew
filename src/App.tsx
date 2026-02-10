import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { VisualDemo } from './components/VisualDemo';
import { Pricing } from './components/Pricing';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Navbar onOpenAuth={handleOpenAuth} />
        <Hero onOpenAuth={handleOpenAuth} />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <VisualDemo />
        <Pricing onOpenAuth={handleOpenAuth} />
        <CallToAction onOpenAuth={handleOpenAuth} />
        <Footer />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
        />
      </div>
    </AuthProvider>
  );
}

export default App;
