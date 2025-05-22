import React from 'react';
import { useProgress } from '../context/ProgressContext';

export function ProgressStats() {
  const { stats, getStreakMessage } = useProgress();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    if (hours > 0) {
      return `${hours}h ${mins % 60}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-blue-600">{getStreakMessage()}</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.todayStretches}</div>
          <div className="text-sm text-gray-600">Today's Stretches</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{formatTime(stats.todayTime)}</div>
          <div className="text-sm text-gray-600">Today's Time</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.totalStretches}</div>
          <div className="text-sm text-gray-600">Total Stretches</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{formatTime(stats.totalTime)}</div>
          <div className="text-sm text-gray-600">Total Time</div>
        </div>
      </div>
    </div>
  );
} 