/** Daily forecast for a single day */
export interface DailyForecast {
  date: string;
  day: string;
  dateShort: string;
  tempMin: number;
  tempMax: number;
  rainChance: number;
  wind: number;
  humidity: number;
  summary: string;
  note?: string;
  /** API source for this day: "Pangu24 AI" | "Open-Meteo Forecast" | "Open-Meteo Historical Average" */
  source?: string;
}

/** Aggregated weather data from any source */
export interface WeatherData {
  temperature: number;
  precipitation: number;
  humidity: number;
  wind: number;
  condition: string;
  dailyForecasts: DailyForecast[];
}

/** Result of getWeatherAnalysis including source metadata */
export interface WeatherAnalysisResult {
  weatherData: WeatherData;
  suitabilityScore: number;
  dataSource: string;
  accuracy: string;
}

/** Earth2 API response shape */
export interface Earth2ForecastResponse {
  forecast: Array<{
    date: string;
    temperature_c: number;
    temperature_max_c: number;
    temperature_min_c: number;
    precipitation_mm: number;
    humidity_percent: number;
    wind_speed_kmh: number;
    condition: string;
  }>;
  temperature: number;
  precipitation: number;
  humidity: number;
  wind: number;
  condition: string;
}
