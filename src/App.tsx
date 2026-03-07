import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { PricingPage } from './pages/PricingPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { AuthModal } from './components/AuthModal';

function RootPage({ onOpenAuth }: { onOpenAuth: (mode: 'login' | 'signup') => void }) {
  const { user } = useAuth();
  if (user) return <HomePage onOpenAuth={onOpenAuth} />;
  return <LandingPage onOpenAuth={onOpenAuth} />;
}

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <RootPage onOpenAuth={handleOpenAuth} />
                  <AuthModal
                    isOpen={authModalOpen}
                    onClose={() => setAuthModalOpen(false)}
                    mode={authMode}
                  />
                </>
              }
            />
            <Route path="/results" element={<ProtectedRoute />}>
              <Route
                index
                element={
                  <>
                    <ResultsPage onOpenAuth={handleOpenAuth} />
                    <AuthModal
                      isOpen={authModalOpen}
                      onClose={() => setAuthModalOpen(false)}
                      mode={authMode}
                    />
                  </>
                }
              />
            </Route>
            <Route path="/pricing" element={<ProtectedRoute />}>
              <Route
                index
                element={
                  <>
                    <PricingPage onOpenAuth={handleOpenAuth} />
                    <AuthModal
                      isOpen={authModalOpen}
                      onClose={() => setAuthModalOpen(false)}
                      mode={authMode}
                    />
                  </>
                }
              />
            </Route>
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
