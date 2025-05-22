import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    darkMode: false,
    soundEnabled: true,
    notificationsEnabled: true,
    breakRemindersEnabled: true,
    breakInterval: 20, // minutes
    exerciseDuration: 30, // seconds
    restDuration: 10, // seconds
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleSound = () => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleNotifications = () => {
    setSettings(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
  };

  const toggleBreakReminders = () => {
    setSettings(prev => ({ ...prev, breakRemindersEnabled: !prev.breakRemindersEnabled }));
  };

  const updateBreakInterval = (minutes) => {
    setSettings(prev => ({ ...prev, breakInterval: minutes }));
  };

  const updateExerciseDuration = (seconds) => {
    setSettings(prev => ({ ...prev, exerciseDuration: seconds }));
  };

  const updateRestDuration = (seconds) => {
    setSettings(prev => ({ ...prev, restDuration: seconds }));
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      toggleDarkMode,
      toggleSound,
      toggleNotifications,
      toggleBreakReminders,
      updateBreakInterval,
      updateExerciseDuration,
      updateRestDuration,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 