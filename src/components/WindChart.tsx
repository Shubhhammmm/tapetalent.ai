import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyForecast } from '../types/weather';

interface WindChartProps {
  data: HourlyForecast[];
}

export function WindChart({ data }: WindChartProps) {
  const chartData = data.map((item) => ({
    time: new Date(item.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
    windSpeed: item.windSpeed.toFixed(1),
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Wind Speed Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} unit=" m/s" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: string) => [`${value} m/s`, 'Wind Speed']}
          />
          <Line
            type="monotone"
            dataKey="windSpeed"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
