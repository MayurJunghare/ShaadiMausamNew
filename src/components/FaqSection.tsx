import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does the forecast work for different date ranges?',
    a: 'For dates within 0–15 days of today we use a real AI forecast (Earth2). For dates 16–90 days ahead we show a historical average based on past years’ weather at your venue—useful for planning but with lower confidence than the short-term forecast.',
  },
  {
    q: 'Why does it say "historical average" for some dates?',
    a: 'Beyond 15 days, detailed day-by-day forecasts are less reliable. We show typical weather for that date based on the last 10 years at your location. Use it as a guide for what to expect; actual weather may vary.',
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
                <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
