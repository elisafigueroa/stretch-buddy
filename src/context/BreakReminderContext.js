import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAudio } from './AudioContext';
import { breakExercises } from '../data/breakExercises';

const BreakReminderContext = createContext();

const DEFAULT_SETTINGS = {
  interval: 45 * 60, // 45 minutes in seconds
  snoozeDuration: 5 * 60, // 5 minutes in seconds
  enabled: true,
  notificationsEnabled: false,
  lastExerciseId: null, // Track last exercise to avoid repetition
  preferredDifficulty: 'gentle', // Default to gentle exercises
  lastExerciseType: null // Track last exercise type for better variety
};

export function BreakReminderProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('breakReminderSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });
  
  const [timeLeft, setTimeLeft] = useState(settings.interval);
  const [isActive, setIsActive] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const { playSoundEffect } = useAudio();
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('breakReminderSettings', JSON.stringify(settings));
  }, [settings]);
  
  // Select a random exercise based on preferences
  const selectRandomExercise = useCallback(() => {
    // Filter exercises by difficulty and avoid last exercise
    const availableExercises = breakExercises.filter(ex => 
      ex.id !== settings.lastExerciseId &&
      ex.difficulty === settings.preferredDifficulty
    );
    
    // If no exercises available at preferred difficulty, fall back to gentle
    const exercises = availableExercises.length > 0 
      ? availableExercises 
      : breakExercises.filter(ex => 
          ex.id !== settings.lastExerciseId &&
          ex.difficulty === 'gentle'
        );
    
    // Try to avoid repeating exercise type
    const typeFiltered = exercises.filter(ex => 
      ex.type !== settings.lastExerciseType
    );
    
    const finalExercises = typeFiltered.length > 0 ? typeFiltered : exercises;
    const randomIndex = Math.floor(Math.random() * finalExercises.length);
    const exercise = finalExercises[randomIndex];
    
    setSettings(prev => ({
      ...prev,
      lastExerciseId: exercise.id,
      lastExerciseType: exercise.type
    }));
    
    return exercise;
  }, [settings.lastExerciseId, settings.lastExerciseType, settings.preferredDifficulty]);
  
  // Handle countdown
  useEffect(() => {
    if (settings.enabled) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleReminder();
            return settings.interval;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [settings.enabled, settings.interval, handleReminder]);
  
  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
    
    try {
      const permission = await Notification.requestPermission();
      setSettings(prev => ({
        ...prev,
        notificationsEnabled: permission === 'granted'
      }));
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);
  
  // Handle reminder
  const handleReminder = useCallback(() => {
    const exercise = selectRandomExercise();
    setCurrentExercise(exercise);
    setShowReminder(true);
    playSoundEffect('stretchStart');
    
    if (settings.notificationsEnabled) {
      new Notification('Time for a Break!', {
        body: `Try this ${exercise.difficulty} exercise: ${exercise.name}`,
        icon: '/logo192.png'
      });
    }
  }, [settings.notificationsEnabled, playSoundEffect, selectRandomExercise]);
  
  // Handle snooze
  const handleSnooze = useCallback(() => {
    setShowReminder(false);
    setTimeLeft(settings.snoozeDuration);
    setIsActive(true);
  }, [settings.snoozeDuration]);
  
  // Handle complete
  const handleComplete = useCallback(() => {
    setShowReminder(false);
    setTimeLeft(settings.interval);
    setIsActive(true);
  }, [settings.interval]);
  
  // Update settings
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    
    // Reset timer if interval changed
    if (newSettings.interval) {
      setTimeLeft(newSettings.interval);
    }
  }, []);
  
  // Toggle reminder
  const toggleReminder = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
    
    if (settings.enabled) {
      setTimeLeft(settings.interval);
    }
  }, [settings.enabled, settings.interval]);
  
  return (
    <BreakReminderContext.Provider value={{
      settings,
      timeLeft,
      isActive,
      showReminder,
      currentExercise,
      updateSettings,
      toggleReminder,
      handleSnooze,
      handleComplete,
      requestNotificationPermission
    }}>
      {children}
    </BreakReminderContext.Provider>
  );
}

export function useBreakReminder() {
  const context = useContext(BreakReminderContext);
  if (!context) {
    throw new Error('useBreakReminder must be used within a BreakReminderProvider');
  }
  return context;
}