import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does the forecast work for different date ranges?',
    a: `ShaadiMausam uses three different weather data sources depending on your location and date:
- For major cities (Mumbai, Delhi, Bangalore, Jaipur, Goa, Chennai, Hyderabad, Kolkata, Pune, Nagpur): We use Pangu24 AI — forecasts are pre-computed daily for instant results.
- For all other cities and towns: We use Open-Meteo, a highly accurate weather forecast service with 80-90% accuracy up to 16 days ahead.
- For dates 16-90 days in the future: We use Open-Meteo Historical Averages — based on the same calendar date over the last 10 years.`,
  },
  {
    q: 'What is Pangu24 AI?',
    a: `Pangu24 is a cutting-edge AI weather forecasting model developed by Huawei Research. It was trained on 39 years of global weather data and uses a 3D Earth Transformer neural network to predict atmospheric conditions with remarkable accuracy. ShaadiMausam runs Pangu24 on NVIDIA T4 GPUs, the same technology used by leading meteorological organizations worldwide. For major Indian wedding cities, we pre-compute Pangu24 forecasts daily so you get instant, highly accurate results.`,
  },
  {
    q: 'What is Open-Meteo?',
    a: `Open-Meteo is a free, open-source weather API that aggregates forecasts from top meteorological services including ECMWF, NOAA, and DWD. It provides 80-90% accurate forecasts for any location on Earth up to 16 days ahead. For dates beyond 16 days, Open-Meteo's historical archive analyzes weather patterns from the past 10 years to give statistically reliable seasonal estimates — perfect for long-term wedding planning.`,
  },
  {
    q: 'Why does it say historical average for some dates?',
    a: `If your wedding date is more than 16 days away, precise forecasts are not yet available from any weather service in the world — this is a fundamental limit of atmospheric science. Instead, we use Open-Meteo Historical Averages, analyzing the same calendar date over the past 10 years to give you a reliable seasonal estimate. This is still very useful for understanding typical weather conditions for your chosen date and location.`,
  },
  {
    q: 'Which cities use Pangu24 AI forecasts?',
    a: `Pangu24 AI forecasts are currently available for India's top wedding destinations: Mumbai, Delhi, Bangalore, Jaipur, Goa, Chennai, Hyderabad, Kolkata, Pune, and Nagpur. These forecasts are refreshed every 24 hours automatically. For all other locations, we use Open-Meteo which is still highly accurate for wedding planning purposes.`,
  },
  {
    q: 'What is your refund policy?',
    a: 'We have a no-refund policy. Please use the free analysis and recommendations to decide if the service fits your needs before any paid plans.',
  },
  {
    q: 'How should I use these recommendations?',
    a: 'Treat them as planning aids, not guarantees. Combine the weather insight with your venue, caterers, and backup plans. Re-check the forecast closer to your date (within 15 days) for the most reliable outlook.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-12 sm:mt-16">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="text-maroon-500 shrink-0" size={24} />
        <h2 className="text-xl font-heading font-bold text-gray-900">Frequently Asked Questions</h2>
      </div>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {FAQ_ITEMS.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-100 last:border-b-0"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-gray-900 pr-2">{item.q}</span>
              <ChevronDown
                className={`shrink-0 text-gray-500 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                size={20}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-4 pt-0">
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
