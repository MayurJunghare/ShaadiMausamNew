import { useLocation, useNavigate } from 'react-router-dom';
import {
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Shirt,
  Building2,
  UtensilsCrossed,
  Camera,
  Users,
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { FallingFlowers } from '../components/FallingFlowers';
import { FaqSection } from '../components/FaqSection';
import type { WeatherData } from '../types/weather';
import type { Recommendations } from '../services/claudeService';

interface ResultsState {
  startDate: string;
  endDate?: string;
  location: string;
  locationCoords?: { lat: number; lng: number };
  weatherData?: WeatherData;
  recommendations?: Recommendations;
  suitabilityScore?: number;
}

function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

interface ResultsPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export function ResultsPage({ onOpenAuth }: ResultsPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState | null;

  if (!state?.startDate || !state?.location || !state?.weatherData) {
    navigate('/', { replace: true });
    return null;
  }

  const startLabel = formatDateLabel(state.startDate);
  const endLabel = state.endDate ? formatDateLabel(state.endDate) : null;
  const dateRangeText = endLabel ? `${startLabel} - ${endLabel}` : startLabel;

  const dailyForecasts = state.weatherData.dailyForecasts;
  const score = state.suitabilityScore ?? 0;
  const rating = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair';
  const ratingColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-amber-600' : 'text-orange-600';
  const rec = state.recommendations;

  // Build provider flags from each day's API source
  const providerFlags = new Set<'earth2' | 'openmeteo'>();
  dailyForecasts.forEach((day) => {
    const src = day.source;
    if (src === 'Pangu24 AI') providerFlags.add('earth2');
    if (src === 'Open-Meteo Forecast' || src === 'Open-Meteo Historical Average') providerFlags.add('openmeteo');
  });

  let dataSourceLabel = '';
  if (providerFlags.has('earth2') && providerFlags.has('openmeteo')) {
    dataSourceLabel = 'Pangu24 AI & Open-Meteo';
  } else if (providerFlags.has('earth2')) {
    dataSourceLabel = 'Pangu24 AI';
  } else if (providerFlags.has('openmeteo')) {
    dataSourceLabel = 'Open-Meteo';
  }

  const sectionText = (
    section: { fullRecommendation?: string; [key: string]: string | undefined } | undefined,
    fallback: string
  ): string => {
    if (!section?.fullRecommendation) return fallback;
    return section.fullRecommendation.trim();
  };

  /** Render section content as bullet list when newline-separated, else paragraph */
  const sectionContent = (text: string, paragraphClass: string) => {
    const points = text.split(/\n/).map((s) => s.trim()).filter(Boolean);
    if (points.length > 1) {
      return (
        <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
          {points.map((point, i) => (
            <li key={i}>{point.replace(/^[•\-]\s*/, '')}</li>
          ))}
        </ul>
      );
    }
    return <p className={paragraphClass}>{text || ''}</p>;
  };

  const longContentClass = 'text-gray-700 leading-relaxed whitespace-pre-line';

  return (
    <div className="min-h-screen bg-cream-50 relative">
      <FallingFlowers />
      <Navbar onOpenAuth={onOpenAuth} variant="app" />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-maroon-600 mb-2">
          Weather Analysis Results
        </h1>
        <p className="text-gray-600 mb-1">{dateRangeText}</p>
        <p className="text-gray-600 text-sm mb-6">{state.location}</p>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex-1">
            {dataSourceLabel && (
              <p className="text-sm text-gray-500">
                Data source:{' '}
                <span className="font-medium text-maroon-600">
                  {dataSourceLabel}
                </span>
              </p>
            )}
          </div>
          <div className="border-2 border-amber-200/80 bg-gradient-to-b from-gold-50 to-amber-50 rounded-xl px-6 py-4 text-center shrink-0 shadow-md">
            <p className="text-sm font-semibold text-gray-700 mb-1">Overall Suitability Score</p>
            <p className={`text-3xl font-bold ${ratingColor}`}>{score}/100</p>
            <p className={`text-lg font-semibold ${ratingColor}`}>{rating}</p>
          </div>
        </div>

        {/* Daily forecast cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {dailyForecasts.map((day, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 shadow-lg border border-amber-100/50"
            >
              <p className="font-heading font-bold text-gray-900 mb-3">{day.day}, {day.dateShort}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Thermometer className="text-maroon-500 shrink-0" size={18} />
                  <span>Min. {day.tempMin}°C – Max. {day.tempMax}°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="text-blue-600 shrink-0" size={18} />
                  <span>Rain chance: {day.rainChance}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="text-gray-600 shrink-0" size={18} />
                  <span>Wind: {day.wind} km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="text-blue-500 shrink-0" size={18} />
                  <span>Humidity: {day.humidity}%</span>
                </div>
              </div>
              <p className="mt-3 font-semibold text-gray-800">{day.summary}</p>
              {day.note && <p className="mt-1 text-gray-600 text-sm">{day.note}</p>}
            </div>
          ))}
        </div>

        {/* Personal Hygiene & Comfort */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100/60 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="text-gold-500" size={24} />
            <h2 className="text-xl font-heading font-bold text-maroon-500">Personal Hygiene & Comfort</h2>
          </div>
          {sectionContent(
            sectionText(rec?.personalHygiene,
              [rec?.personalHygiene?.moisturizer, rec?.personalHygiene?.dressShoes].filter(Boolean).join(' ') ||
              'Use a light moisturizer with SPF. Hydrate well. Comfortable dress shoes for the expected conditions.'
            ),
            longContentClass
          )}
        </section>

        {/* Venue Recommendations */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100/60 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="text-rose-500" size={24} />
            <h2 className="text-xl font-heading font-bold text-maroon-500">Venue Recommendations</h2>
          </div>
          {sectionContent(
            sectionText(rec?.venueRecommendations,
              [rec?.venueRecommendations?.outdoorVenue, rec?.venueRecommendations?.indoorVenue].filter(Boolean).join(' ') ||
              'Outdoor venues can work well with a backup plan. Indoor options provide climate control.'
            ),
            longContentClass
          )}
        </section>

        {/* Local Cuisine Suggestions */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100/60 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="text-green-600" size={24} />
            <h2 className="text-xl font-heading font-bold text-maroon-500">Local Cuisine Suggestions</h2>
          </div>
          {sectionContent(
            sectionText(rec?.localCuisine,
              [rec?.localCuisine?.warmOptions, rec?.localCuisine?.hotBeverages].filter(Boolean).join(' ') ||
              'Consider weather-appropriate menu items and hot beverages for guest comfort.'
            ),
            longContentClass
          )}
        </section>

        {/* Photography Opportunities */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100/60 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="text-purple-500" size={24} />
            <h2 className="text-xl font-heading font-bold text-maroon-500">Photography Opportunities</h2>
          </div>
          {sectionContent(
            sectionText(rec?.photography,
              [rec?.photography?.goldenHour, rec?.photography?.weatherSpecific].filter(Boolean).join(' ') ||
              'Golden hour 6:00–7:30 AM and 5:30–7:00 PM. Adjust plans based on the forecast.'
            ),
            longContentClass
          )}
        </section>

        {/* Guest Comfort */}
        <section className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100/60 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-maroon-500" size={24} />
            <h2 className="text-xl font-heading font-bold text-maroon-500">Guest Comfort</h2>
          </div>
          {sectionContent(
            sectionText(rec?.guestComfort, 'Arrange shaded waiting areas and AC where needed. Consider elderly and child guest comfort.'),
            longContentClass
          )}
        </section>

        <p className="text-center text-sm text-gray-500 mt-8 mb-6">
          Made with ❤️ for Indian Weddings
        </p>
        </div>

        <FaqSection />
      </main>
    </div>
  );
}
