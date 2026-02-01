import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HourlyForecast } from '../types/weather';

interface PrecipitationChartProps {
  data: HourlyForecast[];
}

export function PrecipitationChart({ data }: PrecipitationChartProps) {
  const chartData = data.map((item) => ({
    time: new Date(item.time).toLocaleTimeString('en-US', { hour: 'numeric' }),
    precipitation: Math.round(item.precipitation),
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Precipitation Probability</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} unit="%" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [`${value}%`, 'Precipitation']}
          />
          <Bar dataKey="precipitation" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
