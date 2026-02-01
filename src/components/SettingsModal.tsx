import { X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateTemperatureUnit } from '../store/settingsSlice';
import { TemperatureUnit } from '../types/weather';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const { temperatureUnit } = useAppSelector((state) => state.settings);

  const handleUnitChange = async (unit: TemperatureUnit) => {
    try {
      await dispatch(updateTemperatureUnit(unit)).unwrap();
    } catch (error) {
      console.error('Failed to update temperature unit:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Temperature Unit</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleUnitChange('celsius')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  temperatureUnit === 'celsius'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Celsius (°C)
              </button>
              <button
                onClick={() => handleUnitChange('fahrenheit')}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  temperatureUnit === 'fahrenheit'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fahrenheit (°F)
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
