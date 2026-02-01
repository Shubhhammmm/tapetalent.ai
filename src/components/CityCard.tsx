import { Droplets, Wind, Heart, Trash2 } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { TemperatureUnit } from '../types/weather';

interface CityCardProps {
  cityName: string;
  country: string;
  weather: WeatherData | undefined;
  loading: boolean;
  isFavorite: boolean;
  temperatureUnit: TemperatureUnit;
  onRemove: () => void;
  onClick: () => void;
}

function getWeatherIcon(icon: string) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

function convertTemp(temp: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp;
}

export function CityCard({
  cityName,
  country,
  weather,
  loading,
  isFavorite,
  temperatureUnit,
  onRemove,
  onClick,
}: CityCardProps) {
  if (loading || !weather) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-16 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const temp = convertTemp(weather.temperature, temperatureUnit);
  const unitSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-3 right-3 flex gap-2">
        {isFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove favorite"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        {isFavorite && <Heart className="w-5 h-5 text-red-500 fill-red-500" />}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">{cityName}</h3>
        <p className="text-sm text-gray-500">{country}</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <img src={getWeatherIcon(weather.icon)} alt={weather.condition} className="w-16 h-16" />
          <div>
            <div className="text-4xl font-bold text-gray-900">
              {Math.round(temp)}
              {unitSymbol}
            </div>
            <div className="text-sm text-gray-600">{weather.condition}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          <div>
            <div className="text-xs text-gray-500">Humidity</div>
            <div className="text-sm font-semibold text-gray-900">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-gray-500" />
          <div>
            <div className="text-xs text-gray-500">Wind</div>
            <div className="text-sm font-semibold text-gray-900">{weather.windSpeed.toFixed(1)} m/s</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-center">Click for detailed forecast</div>
    </div>
  );
}
