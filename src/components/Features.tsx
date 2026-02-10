import { Cloud, Camera, Calendar, Umbrella, UtensilsCrossed } from 'lucide-react';

const features = [
  {
    icon: Cloud,
    title: 'Comprehensive Weather Insights',
    description: 'Get detailed forecasts including temperature, humidity, precipitation, and wind speed for your chosen wedding location and dates.',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Camera,
    title: 'Best Photo Opportunity Windows',
    description: 'Discover the perfect lighting conditions and weather windows for stunning wedding photography with golden hour timing.',
    color: 'from-gold-500 to-gold-600',
    bgColor: 'bg-gold-50',
    iconColor: 'text-gold-600',
  },
  {
    icon: Calendar,
    title: 'Smart Date Recommendations',
    description: 'Identify dates to avoid due to extreme heat, monsoons, or unfavorable conditions. Find the ideal time for your celebration.',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    icon: Umbrella,
    title: 'Personalized Comfort Tips',
    description: 'Get custom recommendations for sunscreen, warm clothing, rain protection, and guest comfort based on weather predictions.',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: UtensilsCrossed,
    title: 'Discover Local Flavors',
    description: 'Explore the best restaurants and authentic regional cuisine near your wedding venue for pre-wedding dinners and celebrations.',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-block bg-gold-100 text-gold-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-maroon-500 mb-4 px-4">
            Everything You Need for a Perfect Wedding Day
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            From weather forecasts to photography timing, we've got every detail covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 md:p-8 border-2 border-gray-100 hover:border-gold-300 active:border-gold-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 touch-manipulation"
            >
              <div className={`${feature.bgColor} w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={feature.iconColor} size={28} />
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-bold text-gray-900 mb-3 md:mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
