import { CloudRain, CheckCircle, Users, Target } from 'lucide-react';

export function ProblemSolution() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold">
              The Challenge
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-maroon-500 leading-tight">
              Don't Let Unpredictable Weather Rain on Your Big Day
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Planning a wedding is stressful enough without worrying about whether the weather
              will cooperate. Unexpected rain, extreme heat, or harsh conditions can impact your
              celebration, guest comfort, and those precious photo moments.
            </p>
            <div className="flex items-center space-x-3 text-gray-600">
              <CloudRain className="text-blue-500" size={24} />
              <span className="text-sm">Weather uncertainties affect 7 out of 10 outdoor weddings</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-gold-200">
            <div className="inline-block bg-gold-100 text-gold-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Our Solution
            </div>
            <h3 className="text-3xl font-heading font-bold text-maroon-500 mb-6">
              Weather Intelligence for Wedding Success
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Accurate Forecasts</h4>
                  <p className="text-gray-600">Detailed weather predictions for your wedding dates</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Target className="text-blue-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Smart Recommendations</h4>
                  <p className="text-gray-600">Personalized tips for optimal timing and preparation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="text-rose-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-semibold text-gray-900">Guest Comfort Focus</h4>
                  <p className="text-gray-600">Ensure every guest enjoys your special day</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
