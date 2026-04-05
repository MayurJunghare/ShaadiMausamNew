/**
 * Weather service: Open-Meteo archive (historical averages) for all requested days.
 */
import axios from 'axios';
import type {
  WeatherData,
  WeatherAnalysisResult,
  DailyForecast,
} from '../types/weather';
import { geocodeAddress } from './geocodeService';

const OPEN_METEO_ARCHIVE_BASE = 'https://archive-api.open-meteo.com/v1/archive';

function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Historical averages from Open-Meteo archive for specific calendar dates.
 * Same month/day over the last ~10 years: avg temp, humidity, wind; rain chance from % of rainy years.
 */
async function getOpenMeteoHistoricalAverages(
  latitude: number,
  longitude: number,
  targetDates: string[]
): Promise<DailyForecast[]> {
  const results: DailyForecast[] = [];

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  for (const isoTarget of targetDates) {
    const target = new Date(isoTarget + 'T12:00:00');
    const month = target.getMonth() + 1;
    const day = target.getDate();

    const nowYear = new Date().getFullYear();
    const endYear = nowYear - 1;
    const startYear = endYear - 9;

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
    }
  }

  return results;
}

/**
 * Forecast for the selected date range using Open-Meteo historical averages for each day.
 */
export async function getWeatherForecast(
  latitude: number,
  longitude: number,
  startDate: string,
  daysToShow: number = 4
): Promise<WeatherData> {
  const roundedLat = Math.round(latitude * 10) / 10;
  const roundedLon = Math.round(longitude * 10) / 10;

  console.log('[weatherService] getWeatherForecast (Open-Meteo historical)', {
    latitude,
    longitude,
    roundedLat,
    roundedLon,
    startDate,
    daysToShow,
  });

  const start = new Date(startDate + 'T12:00:00');

  const dates: string[] = [];
  for (let i = 0; i < daysToShow; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const openMeteoDays = await getOpenMeteoHistoricalAverages(roundedLat, roundedLon, dates);

  const combinedDaily: DailyForecast[] = dates.map((iso) => {
    const chosen = openMeteoDays.find((day) => day.date === iso);
    if (!chosen) {
      console.warn('[weatherService] No historical data for', iso);
      return createFallbackDaily(iso);
    }
    return chosen;
  });

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
  const { lat, lng } = locationCoords ?? (await geocodeAddress(location));

  let weatherData: WeatherData;
  try {
    weatherData = await getWeatherForecast(lat, lng, weddingDate);
  } catch (err) {
    console.warn('Weather forecast failed, using fallback:', err);
    weatherData = createFallbackWeatherData(weddingDate);
  }

  const suitabilityScore = calculateSuitability(weatherData);

  return {
    weatherData,
    suitabilityScore,
    dataSource: 'Open-Meteo Historical Average',
    accuracy: 'Based on ~10 years of same calendar date',
  };
}
