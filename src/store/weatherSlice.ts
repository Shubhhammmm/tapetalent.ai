import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData, ForecastData, City } from '../types/weather';
import { getCurrentWeather, getForecast } from '../services/weatherApi';

interface WeatherState {
  currentWeather: Record<string, WeatherData>;
  forecasts: Record<string, ForecastData>;
  loading: Record<string, boolean>;
  error: string | null;
}

const initialState: WeatherState = {
  currentWeather: {},
  forecasts: {},
  loading: {},
  error: null,
};

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (city: City) => {
    const [current, forecast] = await Promise.all([
      getCurrentWeather(city.latitude, city.longitude, city.id),
      getForecast(city.latitude, city.longitude, city.id),
    ]);
    return { cityId: city.id, current, forecast };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state, action) => {
        state.loading[action.meta.arg.id] = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        const { cityId, current, forecast } = action.payload;
        state.currentWeather[cityId] = current;
        state.forecasts[cityId] = forecast;
        state.loading[cityId] = false;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading[action.meta.arg.id] = false;
        state.error = action.error.message || 'Failed to fetch weather data';
      });
  },
});

export const { clearError } = weatherSlice.actions;
export default weatherSlice.reducer;
