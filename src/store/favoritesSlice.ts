import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { City } from '../types/weather';

interface FavoritesState {
  cities: City[];
  loading: boolean;
  error: string | null;
}

const FAVORITES_STORAGE_KEY = 'weather_app_favorites';

const initialState: FavoritesState = {
  cities: [],
  loading: false,
  error: null,
};

const loadFromStorage = (): City[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (cities: City[]): void => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(cities));
};

export const loadFavorites = createAsyncThunk('favorites/load', async () => {
  // Small delay to simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));
  return loadFromStorage();
});

export const addFavorite = createAsyncThunk('favorites/add', async (city: Omit<City, 'id'>) => {
  const newCity: City = {
    ...city,
    id: crypto.randomUUID(),
  };

  const currentCities = loadFromStorage();
  const updatedCities = [newCity, ...currentCities];
  saveToStorage(updatedCities);

  return newCity;
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (cityId: string) => {
  const currentCities = loadFromStorage();
  const updatedCities = currentCities.filter((city) => city.id !== cityId);
  saveToStorage(updatedCities);

  return cityId;
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.cities = action.payload;
        state.loading = false;
      })
      .addCase(loadFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load favorites';
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.cities.unshift(action.payload);
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add favorite';
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.cities = state.cities.filter((city) => city.id !== action.payload);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to remove favorite';
      });
  },
});

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;
