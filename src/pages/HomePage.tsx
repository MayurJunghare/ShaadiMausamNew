import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Cloud, MapPin, Sparkles } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { FallingFlowers } from '../components/FallingFlowers';
import { FaqSection } from '../components/FaqSection';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getWeatherForecast, calculateSuitability } from '../services/weatherService';
import { geocodeAddress } from '../services/geocodeService';
import { getRecommendations } from '../services/claudeService';

const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY as string | undefined;
const SEARCH_LIMIT_PER_DAY = 3;

/** UTC start of today and tomorrow for daily search count */
function getUtcDayBounds(): { startOfToday: string; startOfTomorrow: string } {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { startOfToday: start.toISOString(), startOfTomorrow: end.toISOString() };
}
// Requires Maps JavaScript API + Places API enabled (APIs & Services → Enable APIs).
// Reverse geocode: use Maps JS API Geocoder when script is loaded (no CORS), else fallback.

function reverseGeocode(lat: number, lng: number): Promise<string> {
  const fallback = `Current location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  if (window.google?.maps?.Geocoder) {
    return new Promise((resolve) => {
      const geocoder = new window.google!.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results?.[0]?.formatted_address) {
            resolve(results[0].formatted_address);
          } else {
            resolve(fallback);
          }
        }
      );
    });
  }
  if (!GOOGLE_PLACES_API_KEY) return Promise.resolve(fallback);
  return fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_PLACES_API_KEY}`
  )
    .then((res) => res.json())
    .then((data: { results?: Array<{ formatted_address?: string }> }) => data.results?.[0]?.formatted_address || fallback)
    .catch(() => fallback);
}

function loadGoogleMapsScript(): Promise<void> {
  if (document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
    if (window.google?.maps?.places) return Promise.resolve();
    return new Promise((resolve) => {
      const t = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(t);
          resolve();
        }
      }, 50);
    });
  }
  return new Promise((resolve, reject) => {
    const callbackName = '___gmapsPlacesReady___';
    const win = window as unknown as Record<string, unknown>;
    const timeout = window.setTimeout(() => {
      if (!win[callbackName]) return;
      delete win[callbackName];
      reject(new Error('Timeout'));
    }, 12000);
    (win as Record<string, () => void>)[callbackName] = () => {
      clearTimeout(timeout);
      delete win[callbackName];
      resolve();
    };
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      clearTimeout(timeout);
      delete win[callbackName];
      reject(new Error('Script failed'));
    };
    document.head.appendChild(script);
  });
}

interface HomePageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

function formatDateWithOrdinal(d: Date): string {
  const day = d.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
  const month = d.toLocaleDateString('en-IN', { month: 'long' });
  const year = d.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

export function HomePage({ onOpenAuth }: HomePageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationFromCurrentLocation, setLocationFromCurrentLocation] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [dateMessage, setDateMessage] = useState('');
  const [placesLoadError, setPlacesLoadError] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');
  const [loadingDots, setLoadingDots] = useState('.');
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteInited = useRef(false);

  const today = new Date();
  const maxForecastDate = new Date(today);
  maxForecastDate.setDate(maxForecastDate.getDate() + 90);
  const todayStr = today.toISOString().slice(0, 10);
  const maxStr = maxForecastDate.toISOString().slice(0, 10);
  const maxForecastLabel = formatDateWithOrdinal(maxForecastDate);

  const handleStartDateChange = (value: string) => {
    setDateMessage('');
    if (!value) {
      setStartDate('');
      return;
    }
    const d = new Date(value);
    if (d < new Date(todayStr)) {
      setDateMessage('Please select a date from today onwards.');
      setStartDate('');
      return;
    }
    if (d > new Date(maxStr)) {
      setDateMessage('Forecast is only available for the next 90 days.');
      setStartDate('');
      return;
    }
    setStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    setDateMessage('');
    if (!value) {
      setEndDate('');
      return;
    }
    const d = new Date(value);
    if (d > new Date(maxStr)) {
      setDateMessage('Forecast is only available for the next 90 days.');
      setEndDate('');
      return;
    }
    if (startDate && value < startDate) {
      setDateMessage('End date must be on or after start date.');
      setEndDate('');
      return;
    }
    if (startDate) {
      const start = new Date(startDate);
      const diffMs = d.getTime() - start.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      if (diffDays > 3) {
        setDateMessage('End date can be at most 3 days after start date.');
        setEndDate('');
        return;
      }
    }
    setEndDate(value);
  };

  useEffect(() => {
    if (!GOOGLE_PLACES_API_KEY || autocompleteInited.current) return;
    setPlacesLoadError(false);
    loadGoogleMapsScript()
      .then(() => {
        function tryInit() {
          const input = locationInputRef.current;
          if (!input || !window.google?.maps?.places || autocompleteInited.current) return;
          const autocomplete = new window.google.maps.places.Autocomplete(input, {
          componentRestrictions: { country: 'in' },
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const name = place.formatted_address || place.name || '';
          if (!name) return;
          setLocationError('');
          setPlacesLoadError(false);
          setLocationFromCurrentLocation(false);
          if (input) input.value = name;
          setLocation(name);
          if (place.geometry?.location) {
            setLocationCoords({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          } else {
            setLocationCoords(null);
          }
        });
          autocompleteInited.current = true;
        }
        if (locationInputRef.current) tryInit();
        else setTimeout(tryInit, 150);
      })
      .catch(() => setPlacesLoadError(true));
  }, []);

  /* Animated dots when analyzing */
  useEffect(() => {
    if (!isAnalyzing) return;
    const t = setInterval(() => {
      setLoadingDots((d) => (d.length >= 3 ? '.' : d + '.'));
    }, 400);
    return () => clearInterval(t);
  }, [isAnalyzing]);

  const handleUseCurrentLocation = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationFromCurrentLocation(true);
        setLocationCoords({ lat: latitude, lng: longitude });
        setLocation('Getting address…');
        try {
          if (!window.google?.maps?.Geocoder && GOOGLE_PLACES_API_KEY) {
            await loadGoogleMapsScript();
          }
          const placeName = await reverseGeocode(latitude, longitude);
          setLocation(placeName);
        } catch {
          setLocation(`Current location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        }
        if (locationInputRef.current) locationInputRef.current.value = '';
      },
      () => {
        setLocationError('Unable to get your location. Please search manually.');
      }
    );
  };

  const handleSearchLocation = () => {
    setLocationError('');
    const trimmed = locationInputRef.current?.value.trim() ?? '';
    if (!trimmed) return;
    setLocationFromCurrentLocation(false);
    setLocation(trimmed);
    setLocationCoords(null);
  };

  const handleAnalyze = async () => {
    if (!startDate.trim()) return;
    if (!location.trim()) {
      setLocationError('Please select or enter a wedding location.');
      return;
    }
    if (!user) {
      setAnalyzeError('Please sign in to use the planner.');
      return;
    }
    setAnalyzeError('');
    setIsAnalyzing(true);
    try {
      const { startOfToday, startOfTomorrow } = getUtcDayBounds();
      const { count, error: countError } = await supabase
        .from('wedding_searches')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfToday)
        .lt('created_at', startOfTomorrow);

      if (countError) {
        setAnalyzeError('Could not check search limit. Please try again.');
        return;
      }
      if ((count ?? 0) >= SEARCH_LIMIT_PER_DAY) {
        setAnalyzeError("You've used your 3 free searches for today. Come back tomorrow for more.");
        return;
      }

      const { lat, lng } = locationCoords ?? await geocodeAddress(location);
      let daysToShow = 1;
      if (endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffMs = end.getTime() - start.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        daysToShow = Math.max(1, Math.min(4, Math.floor(diffDays) + 1));
      }
      const weatherData = await getWeatherForecast(lat, lng, startDate, daysToShow);
      const suitabilityScore = calculateSuitability(weatherData);
      const recommendations = await getRecommendations(weatherData, location, startDate, suitabilityScore);

      await supabase.from('wedding_searches').insert([
        {
          user_id: user.id,
          email: user.email ?? '',
          wedding_date_start: startDate,
          wedding_date_end: endDate || null,
          location: location.trim(),
        },
      ]);
      // Best-effort save: if insert fails (e.g. network), still navigate to results

      navigate('/results', {
        state: {
          startDate,
          endDate: endDate || undefined,
          location,
          locationCoords: locationCoords || undefined,
          weatherData,
          recommendations,
          suitabilityScore,
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to analyze weather. Please try again.';
      setAnalyzeError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 relative">
      <FallingFlowers />
      <Navbar onOpenAuth={onOpenAuth} variant="app" />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-maroon-600 mb-2 text-center">
              <span className="block whitespace-nowrap">
                <span className="relative inline-block">
                  <span className="text-maroon-600">W</span>
                  <span className="absolute -top-1 -right-2 opacity-90" aria-hidden>
                    <Cloud className="text-maroon-500" size={28} />
                  </span>
                </span>
                edding
              </span>
              <span className="block">Weather Planner</span>
            </h1>
            <p className="text-maroon-700/90 text-base sm:text-lg max-w-2xl mx-auto">
              Get personalized weather insights and recommendations for your perfect wedding day.
            </p>
          </div>

          {/* Single card: Wedding Date + Wedding Location */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100/60 mb-10">
            {/* Wedding Date section */}
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-maroon-600 shrink-0" size={24} />
              <h2 className="text-xl font-heading font-bold text-maroon-700">Wedding Date</h2>
            </div>
            <p className="text-gray-600 text-sm mb-1">Select your wedding date or date range.</p>
            <p className="text-gray-500 text-sm mb-4">Forecast is available till {maxForecastLabel}. Format: dd-mm-yyyy</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Wedding Date (or Start Date)
                </label>
                <div className="relative">
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    min={todayStr}
                    max={maxStr}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    title="dd-mm-yyyy"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional - for multi-day events)
                </label>
                <div className="relative">
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    max={maxStr}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    title="dd-mm-yyyy"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
            </div>
            {dateMessage && (
              <p className="text-sm text-amber-600 mt-2 mb-4">{dateMessage}</p>
            )}

            {/* Wedding Location section */}
            <div className="flex items-center gap-2 mb-2 pt-4 border-t border-gray-100">
              <MapPin className="text-maroon-600 shrink-0" size={24} />
              <h2 className="text-xl font-heading font-bold text-maroon-700">Wedding Location</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">Choose your wedding venue location.</p>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-maroon-500 hover:bg-maroon-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors mb-2 border border-maroon-600"
            >
              <MapPin size={20} />
              Use Current Location
            </button>
            {locationFromCurrentLocation && location && (
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium text-maroon-600">{location}</span>
              </p>
            )}
            {!locationFromCurrentLocation && <div className="mb-4" />}
            <p className="text-gray-500 text-sm mb-2">Or search manually</p>
            <div className="flex gap-2">
              <input
                ref={locationInputRef}
                type="text"
                defaultValue=""
                onKeyDown={(e) => e.key === 'Enter' && handleSearchLocation()}
                placeholder="Enter city, venue, or address..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                autoComplete="off"
                aria-label="Wedding location search"
              />
              <button
                type="button"
                onClick={handleSearchLocation}
                className="px-6 py-3 bg-maroon-400 hover:bg-maroon-500 text-white rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </div>
            {placesLoadError && GOOGLE_PLACES_API_KEY && (
              <p className="mt-2 text-sm text-amber-600">
                Enable <strong>Maps JavaScript API</strong> and <strong>Places API</strong> in Google Cloud (APIs &amp; Services → Library) for suggestions to appear.
              </p>
            )}
            {location && !locationFromCurrentLocation && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium text-maroon-600">{location}</span>
              </p>
            )}
            {locationError && (
              <p className="mt-2 text-sm text-red-600">{locationError}</p>
            )}
          </div>

        {/* Loading card: dolls + message when analyzing */}
        {isAnalyzing && (
          <div className="mb-10 flex justify-center">
            <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 p-8 shadow-lg border border-pink-100 text-center">
              <div className="flex justify-center items-end mb-6 h-24">
                <svg viewBox="0 0 200 100" className="w-48 h-24 flex-shrink-0" aria-hidden>
                  {/* Girl (left): head, dress, arm toward boy, legs */}
                  <g className="animate-doll-walk-left" style={{ transformOrigin: '50px 50px' }}>
                    <circle cx="50" cy="22" r="12" fill="#f9a8d4" stroke="#be185d" strokeWidth="1.5" />
                    <path d="M38 36 L42 72 L58 72 L62 36 Z" fill="#ec4899" stroke="#be185d" strokeWidth="1.2" />
                    <line x1="62" y1="48" x2="82" y2="44" stroke="#be185d" strokeWidth="2" strokeLinecap="round" />
                    <line x1="42" y1="50" x2="35" y2="58" stroke="#be185d" strokeWidth="2" strokeLinecap="round" />
                    <line x1="42" y1="72" x2="38" y2="88" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
                    <line x1="58" y1="72" x2="62" y2="88" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" />
                  </g>
                  {/* Boy (right): head, shirt, arm toward girl, legs */}
                  <g className="animate-doll-walk-right" style={{ transformOrigin: '150px 50px' }}>
                    <circle cx="150" cy="22" r="12" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="1.5" />
                    <rect x="138" y="34" width="24" height="38" rx="4" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.2" />
                    <line x1="138" y1="48" x2="118" y2="44" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
                    <line x1="162" y1="50" x2="165" y2="58" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
                    <line x1="142" y1="72" x2="138" y2="88" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
                    <line x1="158" y1="72" x2="162" y2="88" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                🌤️ Running AI weather model{loadingDots} This may take up to 60 seconds
              </p>
            </div>
          </div>
        )}

        <div className="text-center relative z-10">
          <button
            type="button"
            onClick={handleAnalyze}
            className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all min-h-[52px] border-2 ${
              startDate && location && !isAnalyzing
                ? 'text-maroon-800 bg-gradient-to-b from-amber-300 via-gold-500 to-amber-600 hover:from-amber-400 hover:via-gold-600 hover:to-amber-700 shadow-lg shadow-amber-900/20 border-amber-700/60'
                : 'bg-gray-300 hover:bg-gray-400 text-gray-800 cursor-not-allowed opacity-80 border-gray-400'
            }`}
            disabled={!startDate || !location || isAnalyzing}
          >
            {isAnalyzing ? (
              'Analyzing…'
            ) : (
              <>
                <Sparkles size={22} />
                Analyze Weather & Get Recommendations
              </>
            )}
          </button>
          {analyzeError && (
            <p className="mt-2 text-sm text-red-600">{analyzeError}</p>
          )}
          <p className="mt-4 text-sm text-gray-500">
            Select your wedding date and location to continue.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8 mb-6">
          Made with ❤️ for Indian Weddings
        </p>

        <FaqSection />
      </main>
    </div>
  );
}
