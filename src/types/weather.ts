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
  /** API source for this day: "Open-Meteo Forecast" | "Open-Meteo Historical Average" */
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
