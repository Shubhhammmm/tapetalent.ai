export interface City {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

export interface WeatherData {
  cityId: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  dewPoint?: number;
  uvIndex?: number;
  visibility?: number;
  timestamp: number;
}

export interface HourlyForecast {
  time: number;
  temperature: number;
  condition: string;
  icon: string;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export interface DailyForecast {
  date: number;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface ForecastData {
  cityId: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
