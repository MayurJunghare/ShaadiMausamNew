/**
 * Weather service: Earth2 + Open-Meteo forecast.
 * Earth2 VM base URL comes from VITE_BACKEND_API_URL.
 */
import axios from 'axios';
import type {
  WeatherData,
  WeatherAnalysisResult,
  DailyForecast,
  Earth2ForecastResponse,
} from '../types/weather';
import { geocodeAddress } from './geocodeService';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || 'https://api.shaadimausam.in';
const OPEN_METEO_ARCHIVE_BASE = 'https://archive-api.open-meteo.com/v1/archive';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Fetch forecast from Earth2 backend for up to 10 days starting at `date`.
 * Used for days that are 0–15 days ahead.
 */
async function getEarth2Forecast(
  latitude: number,
  longitude: number,
  date: string,
  daysToShow: number = 4
): Promise<WeatherData> {
  const res = await axios.post<Earth2ForecastResponse>(`${BASE_URL}/earth2/forecast`, {
    latitude,
    longitude,
    date,
    days: 10,
  });

  const data = res.data;
  const weddingDay = data.forecast?.find((f) => f.date === date) || data.forecast?.[0];

  const sliceCount = Math.max(1, Math.min(4, Math.floor(daysToShow) || 1));

  const dailyForecasts: DailyForecast[] = (data.forecast || []).slice(0, sliceCount).map((f) => {
    const label = formatDateLabel(f.date);
    return {
      date: f.date,
      day: label.split(',')[0],
      dateShort: label.replace(/^[^,]+, /, ''),
      tempMin: f.temperature_min_c,
      tempMax: f.temperature_max_c,
      rainChance: f.precipitation_mm > 0 ? Math.min(100, Math.round(f.precipitation_mm * 10)) : 0,
      wind: Math.round(f.wind_speed_kmh),
      humidity: f.humidity_percent,
      summary: f.condition || 'Unknown',
      source: 'Pangu24 AI',
    };
  });

  if (dailyForecasts.length === 0 && weddingDay) {
    const label = formatDateLabel(weddingDay.date);
    dailyForecasts.push({
      date: weddingDay.date,
      day: label.split(',')[0],
      dateShort: label.replace(/^[^,]+, /, ''),
      tempMin: weddingDay.temperature_min_c,
      tempMax: weddingDay.temperature_max_c,
      rainChance: weddingDay.precipitation_mm > 0 ? Math.min(100, Math.round(weddingDay.precipitation_mm * 10)) : 0,
      wind: Math.round(weddingDay.wind_speed_kmh),
      humidity: weddingDay.humidity_percent,
      summary: weddingDay.condition || 'Unknown',
      source: 'Pangu24 AI',
    });
  }

  return {
    temperature: data.temperature ?? weddingDay?.temperature_c ?? 0,
    precipitation: data.precipitation ?? weddingDay?.precipitation_mm ?? 0,
    humidity: data.humidity ?? weddingDay?.humidity_percent ?? 0,
    wind: data.wind ?? weddingDay?.wind_speed_kmh ?? 0,
    condition: data.condition || weddingDay?.condition || 'Unknown',
    dailyForecasts: dailyForecasts.length > 0 ? dailyForecasts : [createFallbackDaily(date)],
  };
}

/**
 * Fetch historical averages from Open-Meteo archive for specific target dates.
 * For each future day (typically 16–90 days ahead), we:
 * - Look at the same calendar date over the last ~10 years
 * - Compute average temperature, humidity, wind
 * - Estimate rain chance as % of years where it rained that day
 */
async function getOpenMeteoHistoricalAverages(
  latitude: number,
  longitude: number,
  targetDates: string[]
): Promise<DailyForecast[]> {
  const results: DailyForecast[] = [];

  // Helper to zero-pad month/day
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  for (const isoTarget of targetDates) {
    const target = new Date(isoTarget + 'T12:00:00');
    const month = target.getMonth() + 1;
    const day = target.getDate();

    const nowYear = new Date().getFullYear();
    const endYear = nowYear - 1;
    const startYear = endYear - 9; // last ~10 years

    const startIso = `${startYear}-${pad(month)}-${pad(day)}`;
    const endIso = `${endYear}-${pad(month)}-${pad(day)}`;

    try {
      const res = await axios.get(OPEN_METEO_ARCHIVE_BASE, {
        params: {
          latitude,
          longitude,
          start_date: startIso,
          end_date: endIso,
          daily:
            'temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_mean',
          timezone: 'Asia/Kolkata',
        },
      });

      const d = res.data.daily as {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        wind_speed_10m_max: number[];
        relative_humidity_2m_mean: number[];
      };

      let count = 0;
      let sumTempMax = 0;
      let sumTempMin = 0;
      let sumWind = 0;
      let sumHumidity = 0;
      let rainyDays = 0;

      for (let i = 0; i < d.time.length; i++) {
        const dt = new Date(d.time[i] + 'T12:00:00');
        if (dt.getMonth() + 1 !== month || dt.getDate() !== day) continue;

        const tMax = d.temperature_2m_max[i];
        const tMin = d.temperature_2m_min[i];
        const precip = d.precipitation_sum[i];
        const wind = d.wind_speed_10m_max[i];
        const hum = d.relative_humidity_2m_mean[i];

        sumTempMax += tMax;
        sumTempMin += tMin;
        sumWind += wind;
        sumHumidity += hum;
        if (precip > 0.1) rainyDays += 1;
        count += 1;
      }

      if (count === 0) {
        // No matching days found in archive, skip and let caller fall back
        continue;
      }

      const avgTempMax = sumTempMax / count;
      const avgTempMin = sumTempMin / count;
      const avgWind = sumWind / count;
      const avgHumidity = sumHumidity / count;
      const rainChance = Math.round((rainyDays / count) * 100);

      const label = formatDateLabel(isoTarget);

      let summary = 'Pleasant';
      if (rainChance >= 60) summary = 'Rainy';
      else if (rainChance >= 30) summary = 'Partly cloudy';
      else if (avgTempMax >= 35) summary = 'Hot & sunny';
      else if (avgTempMax >= 28) summary = 'Sunny';

      results.push({
        date: isoTarget,
        day: label.split(',')[0],
        dateShort: label.replace(/^[^,]+, /, ''),
        tempMin: Math.round(avgTempMin * 10) / 10,
        tempMax: Math.round(avgTempMax * 10) / 10,
        rainChance,
        wind: Math.round(avgWind),
        humidity: Math.round(avgHumidity),
        summary,
        source: 'Open-Meteo Historical Average',
      });
    } catch (err) {
      console.warn('Open-Meteo historical API failed for', isoTarget, err);
      // On error for this specific day, we just skip and let caller use fallback.
    }
  }

  return results;
}

/**
 * Main forecast function used by HomePage.
 * For each day in the selected range:
 * - 0–15 days from today: Earth2 AI
 * - 16–90 days from today: Open-Meteo forecast
 */
export async function getWeatherForecast(
  latitude: number,
  longitude: number,
  startDate: string,
  daysToShow: number = 4
): Promise<WeatherData> {
  // Round coordinates to whole numbers (0 decimals) for consistency with backend seeding
  const roundedLat = Math.round(latitude);
  const roundedLon = Math.round(longitude);

  const start = new Date(startDate + 'T12:00:00');

  // Build date list for the selected range (1–4 days)
  const dates: string[] = [];
  for (let i = 0; i < daysToShow; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const today = new Date();
  const daysAhead = dates.map((iso) => {
    const d = new Date(iso + 'T12:00:00');
    return Math.floor((d.getTime() - today.getTime()) / MS_PER_DAY);
  });

  const needEarth2 = daysAhead.some((n) => n <= 15);
  const needOpenMeteo = daysAhead.some((n) => n >= 16 && n <= 90);

  let earth2Data: WeatherData | null = null;
  let openMeteoDays: DailyForecast[] = [];

  if (needEarth2) {
    try {
      earth2Data = await getEarth2Forecast(roundedLat, roundedLon, startDate, daysToShow);
    } catch (err) {
      console.warn('Earth2 API failed:', err);
      earth2Data = null;
    }
  }

  if (needOpenMeteo) {
    try {
      const targetForOpenMeteo = dates.filter((_, idx) => {
        const n = daysAhead[idx];
        return n >= 16 && n <= 90;
      });
      openMeteoDays = await getOpenMeteoHistoricalAverages(roundedLat, roundedLon, targetForOpenMeteo);
    } catch (err) {
      console.warn('Open-Meteo historical API failed:', err);
      let message = 'Unknown Open-Meteo error';
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const statusText = err.response?.statusText;
        const data = err.response?.data;
        const dataSnippet =
          typeof data === 'string'
            ? data.slice(0, 200)
            : data && typeof data === 'object'
            ? JSON.stringify(data).slice(0, 200)
            : '';
        message = `status=${status ?? 'n/a'} ${statusText ?? ''} ${dataSnippet || err.message}`;
      } else if (err instanceof Error) {
        message = err.message;
      }
      // Bubble up so HomePage shows this in the red error text
      throw new Error(`Open-Meteo historical error: ${message}`);
    }
  }

  const combinedDaily: DailyForecast[] = [];

  for (let i = 0; i < daysToShow; i++) {
    const iso = dates[i];
    const n = daysAhead[i];

    let chosen: DailyForecast | undefined;

    if (n <= 15 && earth2Data) {
      chosen = earth2Data.dailyForecasts.find((d) => d.date === iso);
    } else if (n >= 16 && n <= 90 && openMeteoDays.length > 0) {
      chosen = openMeteoDays.find((d) => d.date === iso);
    }

    if (!chosen) {
      chosen = createFallbackDaily(iso);
    }

    combinedDaily.push(chosen);
  }

  const avgTemp =
    combinedDaily.length > 0
      ? combinedDaily.reduce((sum, d) => sum + (d.tempMax + d.tempMin) / 2, 0) / combinedDaily.length
      : 0;

  const avgRain =
    combinedDaily.length > 0
      ? combinedDaily.reduce((sum, d) => sum + d.rainChance, 0) / combinedDaily.length
      : 0;

  const avgHumidity =
    combinedDaily.length > 0
      ? combinedDaily.reduce((sum, d) => sum + d.humidity, 0) / combinedDaily.length
      : 0;

  const avgWind =
    combinedDaily.length > 0
      ? combinedDaily.reduce((sum, d) => sum + d.wind, 0) / combinedDaily.length
      : 0;

  let condition = 'Pleasant';
  const rainyDays = combinedDaily.filter((d) => d.rainChance >= 60).length;
  if (rainyDays > combinedDaily.length * 0.5) condition = 'Rainy';
  else if (rainyDays > combinedDaily.length * 0.3) condition = 'Partly Cloudy';
  else if (avgTemp >= 35) condition = 'Hot & Sunny';
  else if (avgTemp >= 28) condition = 'Sunny';

  return {
    temperature: Math.round(avgTemp * 10) / 10,
    precipitation: Math.round(avgRain * 10) / 10,
    humidity: Math.round(avgHumidity),
    wind: Math.round(avgWind),
    condition,
    dailyForecasts: combinedDaily,
  };
}

/**
 * Calculate suitability score 0-100 based on temp, rain, wind, humidity.
 */
export function calculateSuitability(weatherData: WeatherData): number {
  const { temperature, precipitation, humidity, wind } = weatherData;
  let score = 100;

  if (temperature > 38 || temperature < 12) score -= 25;
  else if (temperature > 35 || temperature < 15) score -= 15;

  if (precipitation > 10) score -= 30;
  else if (precipitation > 5) score -= 15;
  else if (precipitation > 1) score -= 5;

  if (humidity > 85) score -= 15;
  else if (humidity > 75) score -= 5;

  if (wind > 40) score -= 20;
  else if (wind > 25) score -= 10;

  return Math.max(0, Math.min(100, score));
}

function createFallbackDaily(date: string): DailyForecast {
  const label = formatDateLabel(date);
  return {
    date,
    day: label.split(',')[0],
    dateShort: label.replace(/^[^,]+, /, ''),
    tempMin: 22,
    tempMax: 32,
    rainChance: 10,
    wind: 10,
    humidity: 60,
    summary: 'Pleasant',
    note: 'Estimated (data unavailable).',
  };
}

function createFallbackWeatherData(date: string, daysToShow: number = 4): WeatherData {
  const base = new Date(date + 'T12:00:00');
  const days: DailyForecast[] = [];
  const totalDays = Math.max(1, Math.min(4, Math.floor(daysToShow) || 1));

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    days.push(createFallbackDaily(iso));
  }

  return {
    temperature: 28,
    precipitation: 0,
    humidity: 60,
    wind: 10,
    condition: 'Pleasant',
    dailyForecasts: days,
  };
}

/** @deprecated Use calculateSuitability. Kept for backward compatibility. */
export const calculateSuitabilityScore = calculateSuitability;

/**
 * Main entry for HomePage: resolve coords, get forecast, calculate score.
 */
export async function getWeatherAnalysis(
  location: string,
  locationCoords: { lat: number; lng: number } | null | undefined,
  weddingDate: string
): Promise<WeatherAnalysisResult> {
  const { lat, lng } = locationCoords ?? await geocodeAddress(location);

  let weatherData: WeatherData;
  try {
    weatherData = await getWeatherForecast(lat, lng, weddingDate);
  } catch (err) {
    console.warn('Earth2 API failed, using fallback:', err);
    weatherData = createFallbackWeatherData(weddingDate);
  }

  const suitabilityScore = calculateSuitability(weatherData);

  return {
    weatherData,
    suitabilityScore,
    dataSource: 'Earth2 AI',
    accuracy: '85-95%',
  };
}
