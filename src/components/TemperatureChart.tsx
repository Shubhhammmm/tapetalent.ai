import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyForecast } from '../types/weather';
import { TemperatureUnit } from '../types/weather';

interface TemperatureChartProps {
  data: HourlyForecast[];
  temperatureUnit: TemperatureUnit;
}

function convertTemp(temp: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? (temp * 9) / 5 + 32 : temp;
}

export function TemperatureChart({ data, temperatureUnit }: TemperatureChartProps) {
  const chartData = data.map((item) => ({
    time: new Date(item.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
    temperature: Math.round(convertTemp(item.temperature, temperatureUnit)),
  }));

  const unitSymbol = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">24-Hour Temperature Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} unit={unitSymbol} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value}${unitSymbol}`, 'Temperature']}
          />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
