import { Check, Sparkles } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  priceLabel: string;
  subtitle?: string;
  popular?: boolean;
  features: string[];
  gradient: string;
  buttonStyle: string;
  buttonText: string;
  perfectFor?: string;
}

const plans: PricingPlan[] = [
  {
    name: 'Free Trial',
    price: '0',
    priceLabel: 'FREE',
    subtitle: 'Let users try before buying',
    features: [
      '3-day forecast',
      'Basic suitability score',
      '1 city, 1 date',
      'See what you\'ll get!',
    ],
    gradient: 'from-gray-50 to-gray-100',
    buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white',
    buttonText: 'Start Free Trial',
  },
  {
    name: 'Basic Wedding Forecast',
    price: '999',
    priceLabel: 'ONE-TIME PAYMENT',
    popular: true,
    perfectFor: 'Perfect for: 95% of couples',
    features: [
      '10-day accurate forecast',
      'Historical weather analysis',
      'AI venue recommendations',
      'Downloadable PDF report',
      'Compare up to 3 dates',
      'Email support',
      'Valid until 1 week after wedding',
    ],
    gradient: 'from-gold-50 to-gold-100',
    buttonStyle: 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white',
    buttonText: 'Get Started - ₹999',
  },
  {
    name: 'Premium Wedding Package',
    price: '1,999',
    priceLabel: 'ONE-TIME PAYMENT',
    perfectFor: 'Perfect for: Luxury weddings',
    features: [
      'Everything in Basic',
      'Unlimited date comparisons',
      'Hourly weather breakdown',
      'Personal hygiene & comfort tips',
      'Local cuisine recommendations',
      'Guest comfort planning',
      'WhatsApp alerts (7 days before)',
      'Priority support (4hr response)',
    ],
    gradient: 'from-maroon-50 to-rose-50',
    buttonStyle: 'bg-gradient-to-r from-maroon-500 to-maroon-600 hover:from-maroon-600 hover:to-maroon-700 text-white',
    buttonText: 'Get Started - ₹1,999',
  },
];

interface PricingProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function Pricing({ onOpenAuth }: PricingProps) {
  return (
    <section id="pricing" className="py-16 md:py-20 bg-gradient-to-b from-cream-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-gold-100 text-gold-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-maroon-500 mb-4 px-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Flexible pricing for every couple, from intimate celebrations to grand affairs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-br ${plan.gradient} rounded-2xl p-6 md:p-8 border-2 ${
                plan.popular
                  ? 'border-gold-400 shadow-2xl scale-105 md:scale-110'
                  : 'border-gray-200 hover:border-gold-300 hover:shadow-xl'
              } transition-all duration-300 transform hover:-translate-y-1 touch-manipulation`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                  <Sparkles size={14} />
                  <span>Recommended</span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-heading font-bold text-gray-900 mb-2 uppercase">
                  {plan.name}
                </h3>
                <div className="mb-3">
                  <span className="text-4xl md:text-5xl font-bold text-maroon-600">₹{plan.price}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 font-semibold uppercase tracking-wide">
                  {plan.priceLabel}
                </p>
                {plan.subtitle && (
                  <p className="text-sm text-gray-500 mt-2 italic">{plan.subtitle}</p>
                )}
              </div>

              <div className="border-t-2 border-gray-300 my-4"></div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.perfectFor && (
                <p className="text-sm md:text-base font-semibold text-gray-700 mb-4 text-center">
                  {plan.perfectFor} ✓
                </p>
              )}

              <button
                onClick={() => onOpenAuth('signup')}
                className={`w-full ${plan.buttonStyle} px-6 py-3 md:py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg min-h-[48px] touch-manipulation`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12">
          <p className="text-gray-600 text-sm md:text-base">
            All paid plans are one-time payments with no recurring charges. Access valid until 1 week after your wedding date.
          </p>
        </div>
      </div>
    </section>
  );
}
