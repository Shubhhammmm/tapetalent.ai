import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TemperatureUnit } from '../types/weather';

interface SettingsState {
  temperatureUnit: TemperatureUnit;
  loading: boolean;
}

const SETTINGS_STORAGE_KEY = 'weather_app_settings';

interface StoredSettings {
  temperatureUnit: TemperatureUnit;
}

const initialState: SettingsState = {
  temperatureUnit: 'celsius',
  loading: false,
};

const loadFromStorage = (): StoredSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { temperatureUnit: 'celsius' };
  } catch {
    return { temperatureUnit: 'celsius' };
  }
};

const saveToStorage = (settings: StoredSettings): void => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export const loadPreferences = createAsyncThunk('settings/load', async () => {
  // Small delay to simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100));
  const settings = loadFromStorage();
  return settings.temperatureUnit;
});

export const updateTemperatureUnit = createAsyncThunk(
  'settings/updateUnit',
  async (unit: TemperatureUnit) => {
    const settings = loadFromStorage();
    settings.temperatureUnit = unit;
    saveToStorage(settings);
    return unit;
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPreferences.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadPreferences.fulfilled, (state, action) => {
        state.temperatureUnit = action.payload as TemperatureUnit;
        state.loading = false;
      })
      .addCase(loadPreferences.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateTemperatureUnit.fulfilled, (state, action) => {
        state.temperatureUnit = action.payload;
      });
  },
});

export default settingsSlice.reducer;
