import { WeatherData, ForecastData, HourlyForecast, DailyForecast } from '../types/weather';

/**
 * Open-Meteo API - free, open-source, no API key required.
 * @see https://open-meteo.com/en/docs
 */

const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search';
const CACHE_DURATION = 60 * 1000;

interface CachedData {
  data: unknown;
  timestamp: number;
}

const memoryCache = new Map<string, CachedData>();

function getCachedData<T>(key: string): T | null {
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
}

function setCachedData(key: string, data: unknown): void {
  memoryCache.set(key, { data, timestamp: Date.now() });
}

/** Map Open-Meteo WMO weather code to condition label and OpenWeatherMap-style icon (for existing UI). */
function wmoToConditionAndIcon(code: number): { condition: string; icon: string } {
  const map: Record<number, { condition: string; icon: string }> = {
    0: { condition: 'Clear', icon: '01d' },
    1: { condition: 'Mainly clear', icon: '01d' },
    2: { condition: 'Partly cloudy', icon: '02d' },
    3: { condition: 'Overcast', icon: '04d' },
    45: { condition: 'Fog', icon: '50d' },
    48: { condition: 'Fog', icon: '50d' },
    51: { condition: 'Drizzle', icon: '09d' },
    52: { condition: 'Drizzle', icon: '09d' },
    53: { condition: 'Drizzle', icon: '09d' },
    56: { condition: 'Freezing drizzle', icon: '09d' },
    57: { condition: 'Freezing drizzle', icon: '09d' },
    61: { condition: 'Rain', icon: '10d' },
    62: { condition: 'Rain', icon: '10d' },
    63: { condition: 'Rain', icon: '10d' },
    66: { condition: 'Freezing rain', icon: '10d' },
    67: { condition: 'Freezing rain', icon: '10d' },
    71: { condition: 'Snow', icon: '13d' },
    72: { condition: 'Snow', icon: '13d' },
    73: { condition: 'Snow', icon: '13d' },
    77: { condition: 'Snow grains', icon: '13d' },
    80: { condition: 'Rain showers', icon: '09d' },
    81: { condition: 'Rain showers', icon: '09d' },
    82: { condition: 'Rain showers', icon: '09d' },
    85: { condition: 'Snow showers', icon: '13d' },
    86: { condition: 'Snow showers', icon: '13d' },
    95: { condition: 'Thunderstorm', icon: '11d' },
    96: { condition: 'Thunderstorm', icon: '11d' },
    99: { condition: 'Thunderstorm', icon: '11d' },
  };
  return map[code] ?? { condition: 'Unknown', icon: '01d' };
}

/** Convert wind from km/h (Open-Meteo) to m/s (used by UI). */
function kmhToMs(kmh: number): number {
  return kmh / 3.6;
}

interface OpenMeteoCurrent {
  time: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  pressure_msl: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  visibility?: number;
}

interface OpenMeteoForecastResponse {
  current?: OpenMeteoCurrent;
  current_units?: { wind_speed_10m: string };
  hourly?: {
    time: number[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    weather_code: number[];
    precipitation_probability?: number[];
    precipitation?: number[];
    wind_speed_10m: number[];
  };
  daily?: {
    time: number[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max: number[];
    relative_humidity_2m_mean?: number[];
  };
}

export async function getCurrentWeather(
  lat: number,
  lon: number,
  cityId: string
): Promise<WeatherData> {
  const cacheKey = `current_${lat}_${lon}`;
  const cached = getCachedData<WeatherData>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,visibility',
    timeformat: 'unixtime',
  });

  const response = await fetch(`${FORECAST_BASE}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data: OpenMeteoForecastResponse = await response.json();
  const cur = data.current;
  if (!cur) throw new Error('No current weather in response');

  const { condition, icon } = wmoToConditionAndIcon(cur.weather_code);
  const windSpeedMs = data.current_units?.wind_speed_10m === 'km/h'
    ? kmhToMs(cur.wind_speed_10m)
    : cur.wind_speed_10m;

  const weatherData: WeatherData = {
    cityId,
    temperature: cur.temperature_2m,
    feelsLike: cur.apparent_temperature,
    condition,
    icon,
    humidity: cur.relative_humidity_2m,
    windSpeed: windSpeedMs,
    windDirection: cur.wind_direction_10m,
    pressure: cur.pressure_msl,
    visibility: cur.visibility,
    timestamp: Date.now(),
  };

  setCachedData(cacheKey, weatherData);
  return weatherData;
}

export async function getForecast(
  lat: number,
  lon: number,
  cityId: string
): Promise<ForecastData> {
  const cacheKey = `forecast_${lat}_${lon}`;
  const cached = getCachedData<ForecastData>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly:
      'temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,precipitation,wind_speed_10m',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_mean',
    timeformat: 'unixtime',
    forecast_days: '7',
  });

  const response = await fetch(`${FORECAST_BASE}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }

  const data: OpenMeteoForecastResponse = await response.json();
  const hourly = data.hourly;
  const daily = data.daily;
  if (!hourly || !daily) throw new Error('Missing hourly or daily in response');

  const hourlyList: HourlyForecast[] = (hourly.time ?? [])
    .slice(0, 24)
    .map((_, i) => {
      const code = hourly.weather_code?.[i] ?? 0;
      const { condition, icon } = wmoToConditionAndIcon(code);
      const windKmh = hourly.wind_speed_10m?.[i] ?? 0;
      return {
        time: (hourly.time![i] ?? 0) * 1000,
        temperature: hourly.temperature_2m?.[i] ?? 0,
        condition,
        icon,
        precipitation: hourly.precipitation_probability?.[i] ?? 0,
        windSpeed: kmhToMs(windKmh),
        humidity: hourly.relative_humidity_2m?.[i] ?? 0,
      };
    });

  const dailyList: DailyForecast[] = (daily.time ?? []).slice(0, 7).map((_, i) => {
    const code = daily.weather_code?.[i] ?? 0;
    const { condition, icon } = wmoToConditionAndIcon(code);
    const windKmh = daily.wind_speed_10m_max?.[i] ?? 0;
    return {
      date: (daily.time![i] ?? 0) * 1000,
      tempMax: daily.temperature_2m_max?.[i] ?? 0,
      tempMin: daily.temperature_2m_min?.[i] ?? 0,
      condition,
      icon,
      precipitation: daily.precipitation_probability_max?.[i] ?? 0,
      humidity: daily.relative_humidity_2m_mean?.[i] ?? 0,
      windSpeed: kmhToMs(windKmh),
    };
  });

  const forecastData: ForecastData = {
    cityId,
    hourly: hourlyList,
    daily: dailyList,
  };

  setCachedData(cacheKey, forecastData);
  return forecastData;
}

interface GeocodingResult {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code?: string;
  }>;
}

export async function searchCities(
  query: string
): Promise<Array<{ name: string; country: string; lat: number; lon: number }>> {
  if (query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: '5',
  });

  const response = await fetch(`${GEOCODING_BASE}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to search cities');
  }

  const data: GeocodingResult = await response.json();
  const results = data.results ?? [];

  return results.map((r) => ({
    name: r.name,
    country: r.country ?? r.country_code ?? '',
    lat: r.latitude,
    lon: r.longitude,
  }));
}
