import { X, Droplets, Wind, Eye, Gauge } from 'lucide-react';
import { WeatherData, ForecastData } from '../types/weather';
import { TemperatureUnit } from '../types/weather';
import { TemperatureChart } from './TemperatureChart';
import { PrecipitationChart } from './PrecipitationChart';
import { WindChart } from './WindChart';

interface DetailedViewProps {
  cityName: string;
  country: string;
  weather: WeatherData;
  forecast: ForecastData;
  temperatureUnit: TemperatureUnit;
  onClose: () => void;
}

function convertTemp(temp: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp;
}

function getWeatherIcon(icon: string) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export function DetailedView({
  cityName,
  country,
  weather,
  forecast,
  temperatureUnit,
  onClose,
}: DetailedViewProps) {
  const unitSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-50 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {cityName}, {country}
            </h2>
            <p className="text-sm text-gray-500 mt-1">Detailed weather analytics</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Conditions</h3>
            <div className="flex items-center gap-6">
              <img src={getWeatherIcon(weather.icon)} alt={weather.condition} className="w-24 h-24" />
              <div>
                <div className="text-5xl font-bold text-gray-900">
                  {Math.round(convertTemp(weather.temperature, temperatureUnit))}
                  {unitSymbol}
                </div>
                <div className="text-xl text-gray-600 mt-1">{weather.condition}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Feels like {Math.round(convertTemp(weather.feelsLike, temperatureUnit))}
                  {unitSymbol}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Droplets className="w-8 h-8 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-500">Humidity</div>
                  <div className="text-lg font-semibold text-gray-900">{weather.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Wind className="w-8 h-8 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Wind Speed</div>
                  <div className="text-lg font-semibold text-gray-900">{weather.windSpeed.toFixed(1)} m/s</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Gauge className="w-8 h-8 text-green-500" />
                <div>
                  <div className="text-xs text-gray-500">Pressure</div>
                  <div className="text-lg font-semibold text-gray-900">{weather.pressure} hPa</div>
                </div>
              </div>
              {weather.visibility && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-8 h-8 text-gray-500" />
                  <div>
                    <div className="text-xs text-gray-500">Visibility</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {(weather.visibility / 1000).toFixed(1)} km
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {forecast.daily.map((day, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <img src={getWeatherIcon(day.icon)} alt={day.condition} className="w-12 h-12 mx-auto" />
                  <div className="text-sm font-semibold text-gray-900">
                    {Math.round(convertTemp(day.tempMax, temperatureUnit))}°
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.round(convertTemp(day.tempMin, temperatureUnit))}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          <TemperatureChart data={forecast.hourly} temperatureUnit={temperatureUnit} />
          <PrecipitationChart data={forecast.hourly} />
          <WindChart data={forecast.hourly} />
        </div>
      </div>
    </div>
  );
}
