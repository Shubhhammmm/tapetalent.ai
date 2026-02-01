import { useState, useEffect, useRef } from 'react';
import { Search, Heart, Loader2 } from 'lucide-react';
import { searchCities } from '../services/weatherApi';
import { useAppDispatch } from '../store/hooks';
import { addFavorite } from '../store/favoritesSlice';

interface SearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const cities = await searchCities(query);
          setResults(cities);
          setIsOpen(true);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  const handleAddFavorite = async (result: SearchResult) => {
    try {
      await dispatch(
        addFavorite({
          name: result.name,
          latitude: result.lat,
          longitude: result.lon,
          country: result.country,
        })
      ).unwrap();
      setQuery('');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleAddFavorite(result)}
              className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors text-left"
            >
              <div>
                <div className="font-medium text-gray-900">{result.name}</div>
                <div className="text-sm text-gray-500">{result.country}</div>
              </div>
              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
