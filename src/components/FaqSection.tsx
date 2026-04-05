import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'What is Open-Meteo?',
    a: `Open-Meteo is a free, open-source weather API that combines data from major meteorological providers. ShaadiMausam uses it for historical patterns and, when applicable, forecasts — no separate proprietary weather backend.`,
  },
  {
    q: 'What is Pangu24 AI?',
    a: `Pangu24 is a cutting-edge AI weather forecasting model developed by Huawei Research. It was trained on 39 years of global weather data and uses a 3D Earth Transformer neural network to predict atmospheric conditions with remarkable accuracy. In industry deployments it often runs on NVIDIA GPUs (including T4-class hardware), similar to setups used by advanced meteorological pipelines. The wedding weather numbers you see in ShaadiMausam today come from Open-Meteo; Pangu24 is well known as an example of how deep learning is used in modern weather science.`,
  },
  {
    q: 'Which cities use Pangu24 AI forecasts?',
    a: `Pangu24-style AI forecasting is most often discussed for high-traffic regions and flagship metros. India's top wedding destinations — where couples most want reliable weather insight — include Mumbai, Delhi, Bangalore, Jaipur, Goa, Chennai, Hyderabad, Kolkata, Pune, and Nagpur. ShaadiMausam's planner accepts any venue you choose: we use Open-Meteo for everyone, including these cities, so you get consistent historical and forecast-style analysis whether you're in a metro or a smaller town.`,
  },
  {
    q: 'Why does it say historical average?',
    a: `For many wedding dates, the clearest signal is how that calendar day has behaved in past years (typical heat, rain tendency, humidity). That is what "historical average" means: a statistical picture for your venue and season, not a guarantee for one exact future day.`,
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
