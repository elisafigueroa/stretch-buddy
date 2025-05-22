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
    <div className="stats-card">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-blue-600">{getStreakMessage()}</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center transform hover:scale-105 transition-transform">
          <div className="text-3xl font-bold text-gray-800 mb-1">{stats.todayStretches}</div>
          <div className="text-sm text-gray-600 font-medium">Today's Stretches</div>
        </div>
        
        <div className="text-center transform hover:scale-105 transition-transform">
          <div className="text-3xl font-bold text-gray-800 mb-1">{formatTime(stats.todayTime)}</div>
          <div className="text-sm text-gray-600 font-medium">Today's Time</div>
        </div>
        
        <div className="text-center transform hover:scale-105 transition-transform">
          <div className="text-3xl font-bold text-gray-800 mb-1">{stats.totalStretches}</div>
          <div className="text-sm text-gray-600 font-medium">Total Stretches</div>
        </div>
        
        <div className="text-center transform hover:scale-105 transition-transform">
          <div className="text-3xl font-bold text-gray-800 mb-1">{formatTime(stats.totalTime)}</div>
          <div className="text-sm text-gray-600 font-medium">Total Time</div>
        </div>
      </div>

      {stats.streak > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Current Streak</span>
            <span className="text-sm font-medium text-blue-600">{stats.streak} days</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${Math.min((stats.streak / 7) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 