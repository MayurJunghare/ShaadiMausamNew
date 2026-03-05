import { Navbar } from '../components/Navbar';
import { Pricing } from '../components/Pricing';
import { Footer } from '../components/Footer';

interface PricingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

/**
 * Full pricing page with same theme as landing: Navbar + Pricing section + Footer.
 * Only rendered when user is logged in (wrapped by ProtectedRoute).
 */
export function PricingPage({ onOpenAuth }: PricingPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onOpenAuth={onOpenAuth} />
      <main className="flex-1 pt-16">
        <Pricing onOpenAuth={onOpenAuth} />
      </main>
      <Footer />
    </div>
  );
}
