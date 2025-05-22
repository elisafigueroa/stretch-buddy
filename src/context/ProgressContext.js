import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [stats, setStats] = useState(() => {
    const savedStats = localStorage.getItem('stretchBuddyStats');
    return savedStats ? JSON.parse(savedStats) : {
      totalStretches: 0,
      totalTime: 0,
      streak: 0,
      lastStretchDate: null,
      todayStretches: 0,
      todayTime: 0
    };
  });

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stretchBuddyStats', JSON.stringify(stats));
  }, [stats]);

  // Check and update streak daily
  useEffect(() => {
    const today = new Date().toDateString();
    const lastDate = stats.lastStretchDate ? new Date(stats.lastStretchDate).toDateString() : null;

    if (lastDate !== today) {
      // If last stretch was yesterday, increment streak
      if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
        setStats(prev => ({
          ...prev,
          streak: prev.streak + 1,
          lastStretchDate: today,
          todayStretches: 0,
          todayTime: 0
        }));
      } 
      // If last stretch was before yesterday, reset streak
      else if (lastDate && lastDate !== today) {
        setStats(prev => ({
          ...prev,
          streak: 0,
          lastStretchDate: today,
          todayStretches: 0,
          todayTime: 0
        }));
      }
    }
  }, [stats.lastStretchDate]);

  const recordStretch = (duration) => {
    const today = new Date().toDateString();
    const isNewDay = stats.lastStretchDate !== today;

    setStats(prev => ({
      ...prev,
      totalStretches: prev.totalStretches + 1,
      totalTime: prev.totalTime + duration,
      lastStretchDate: today,
      todayStretches: isNewDay ? 1 : prev.todayStretches + 1,
      todayTime: isNewDay ? duration : prev.todayTime + duration
    }));
  };

  const getStreakMessage = () => {
    if (stats.streak === 0) return "Start your streak today!";
    if (stats.streak === 1) return "First day of your streak!";
    if (stats.streak < 7) return `${stats.streak} day streak! Keep it up!`;
    if (stats.streak < 30) return `Amazing ${stats.streak} day streak!`;
    return `Incredible ${stats.streak} day streak! You're a stretching master!`;
  };

  return (
    <ProgressContext.Provider value={{ stats, recordStretch, getStreakMessage }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
} 