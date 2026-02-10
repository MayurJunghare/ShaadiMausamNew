import { UserPlus, MapPin, CloudSun } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Sign Up for ShaadiMausam',
    description: 'Create your free account in seconds and join thousands of couples planning their perfect wedding.',
    color: 'from-gold-500 to-gold-600',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'Enter Your Wedding Details',
    description: 'Share your wedding location and preferred dates. Our system analyzes historical and forecasted data.',
    color: 'from-rose-500 to-rose-600',
  },
  {
    number: '03',
    icon: CloudSun,
    title: 'Get Comprehensive Insights',
    description: 'Receive detailed weather forecasts, golden hour timings, travel advisories, and personalized recommendations.',
    color: 'from-blue-500 to-blue-600',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-cream-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-maroon-100 text-maroon-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-maroon-500 mb-4">
            Three Simple Steps to Weather Confidence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start planning your perfect wedding day in minutes
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 via-rose-300 to-blue-300 transform -translate-y-1/2"></div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 hover:border-gold-300">
                  <div className="flex items-center justify-center mb-6">
                    <div className={`bg-gradient-to-br ${step.color} w-20 h-20 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <step.icon className="text-white" size={36} />
                    </div>
                  </div>

                  <div className={`text-6xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent text-center mb-4`}>
                    {step.number}
                  </div>

                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
