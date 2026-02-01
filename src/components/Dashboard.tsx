import { useEffect, useState } from 'react';
import { CloudOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWeatherData } from '../store/weatherSlice';
import { loadFavorites, removeFavorite } from '../store/favoritesSlice';
import { loadPreferences } from '../store/settingsSlice';
import { Header } from './Header';
import { SearchBar } from './SearchBar';
import { CityCard } from './CityCard';
import { DetailedView } from './DetailedView';
import { SettingsModal } from './SettingsModal';

const REFRESH_INTERVAL = 60000;

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { cities } = useAppSelector((state) => state.favorites);
  const { currentWeather, forecasts, loading } = useAppSelector((state) => state.weather);
  const { temperatureUnit } = useAppSelector((state) => state.settings);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    dispatch(loadFavorites());
    dispatch(loadPreferences());
  }, [dispatch]);

  useEffect(() => {
    if (cities.length > 0) {
      cities.forEach((city) => {
        dispatch(fetchWeatherData(city));
      });

      const interval = setInterval(() => {
        cities.forEach((city) => {
          dispatch(fetchWeatherData(city));
        });
      }, REFRESH_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [cities, dispatch]);

  const handleRemoveFavorite = async (cityId: string) => {
    try {
      await dispatch(removeFavorite(cityId)).unwrap();
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  const selectedCity = cities.find((city) => city.id === selectedCityId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onOpenSettings={() => setShowSettings(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <SearchBar />
        </div>

        {cities.length === 0 ? (
          <div className="text-center py-16">
            <CloudOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cities added yet</h3>
            <p className="text-gray-600">Search for a city above to add it to your dashboard</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <CityCard
                key={city.id}
                cityName={city.name}
                country={city.country}
                weather={currentWeather[city.id]}
                loading={loading[city.id]}
                isFavorite={true}
                temperatureUnit={temperatureUnit}
                onRemove={() => handleRemoveFavorite(city.id)}
                onClick={() => setSelectedCityId(city.id)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedCityId && selectedCity && currentWeather[selectedCityId] && forecasts[selectedCityId] && (
        <DetailedView
          cityName={selectedCity.name}
          country={selectedCity.country}
          weather={currentWeather[selectedCityId]}
          forecast={forecasts[selectedCityId]}
          temperatureUnit={temperatureUnit}
          onClose={() => setSelectedCityId(null)}
        />
      )}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
