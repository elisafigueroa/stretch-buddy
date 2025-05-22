import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { stretches } from '../data/stretches';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export function DetailedStats() {
  const { stats } = useProgress();
  const [timeRange, setTimeRange] = useState('week'); // 'week' or 'month'

  // Calculate weekly/monthly data
  const getTimeRangeData = () => {
    const now = new Date();
    const data = [];
    const days = timeRange === 'week' ? 7 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      data.push({
        date: dateStr,
        dayName,
        stretches: stats.dailyTracking[dateStr]?.stretches || 0,
        time: Math.round((stats.dailyTracking[dateStr]?.time || 0) / 60), // Convert to minutes
      });
    }
    
    return data;
  };

  // Calculate category distribution
  const getCategoryDistribution = () => {
    const distribution = {};
    stats.completedStretches.forEach(stretchId => {
      const stretch = stretches.find(s => s.id === stretchId);
      if (stretch) {
        distribution[stretch.category] = (distribution[stretch.category] || 0) + 1;
      }
    });
    return Object.entries(distribution).map(([category, count]) => ({
      name: category,
      value: count,
    }));
  };

  const timeRangeData = getTimeRangeData();
  const categoryData = getCategoryDistribution();

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Custom tooltip for the line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">Stretches: {payload[0].value}</p>
          <p className="text-green-600">Time: {payload[1].value}m</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Detailed Statistics</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-full ${
              timeRange === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-full ${
              timeRange === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Daily Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeRangeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="dayName" 
                  stroke="#666"
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#0088FE"
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#00C49F"
                  tick={{ fill: '#666' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="stretches"
                  stroke="#0088FE"
                  strokeWidth={2}
                  dot={{ fill: '#0088FE', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="time"
                  stroke="#00C49F"
                  strokeWidth={2}
                  dot={{ fill: '#00C49F', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Stretch Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} stretches`, 'Count']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #f0f0f0',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.streak}</div>
          <div className="text-gray-600">Day Streak</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(stats.totalTime / 60)}m
          </div>
          <div className="text-gray-600">Total Time</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalStretches}
          </div>
          <div className="text-gray-600">Total Stretches</div>
        </div>
      </div>
    </div>
  );
} 