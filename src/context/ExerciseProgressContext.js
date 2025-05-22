import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { aiService } from '../services/aiRecommendationService';

const ExerciseProgressContext = createContext();

const DEFAULT_PROGRESS = {
  exercises: {}, // { exerciseId: { completions: 0, totalDuration: 0, lastCompleted: null, soreness: [] } }
  dailyStreak: 0,
  lastCompletedDate: null,
  preferredDifficulty: 'gentle',
  progressionReady: false,
  lastExerciseType: null, // Track the last exercise type performed
  exerciseStreak: {}, // Track consecutive days of each exercise type
  sorenessHistory: [], // Track overall soreness levels
  missedSessions: [] // Track missed exercise sessions
};

export function ExerciseProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('exerciseProgress');
    return savedProgress ? JSON.parse(savedProgress) : DEFAULT_PROGRESS;
  });
  
  // Initialize AI service
  useEffect(() => {
    aiService.loadModel();
  }, []);
  
  // Save progress to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('exerciseProgress', JSON.stringify(progress));
  }, [progress]);
  
  // Record exercise completion with soreness
  const recordExercise = useCallback(async (exerciseId, duration, exerciseType, sorenessLevel = null) => {
    setProgress(prev => {
      const now = new Date().toISOString();
      const today = now.split('T')[0];
      const lastDate = prev.lastCompletedDate ? prev.lastCompletedDate.split('T')[0] : null;
      
      // Update exercise stats
      const exerciseStats = prev.exercises[exerciseId] || {
        completions: 0,
        totalDuration: 0,
        lastCompleted: null,
        soreness: []
      };
      
      const updatedExercises = {
        ...prev.exercises,
        [exerciseId]: {
          ...exerciseStats,
          completions: exerciseStats.completions + 1,
          totalDuration: exerciseStats.totalDuration + duration,
          lastCompleted: now,
          soreness: sorenessLevel !== null 
            ? [...exerciseStats.soreness, { level: sorenessLevel, date: now }]
            : exerciseStats.soreness
        }
      };
      
      // Update daily streak
      let newStreak = prev.dailyStreak;
      if (lastDate !== today) {
        newStreak = lastDate && new Date(today) - new Date(lastDate) === 86400000
          ? prev.dailyStreak + 1
          : 1;
      }
      
      // Update exercise type streak
      const exerciseStreak = { ...prev.exerciseStreak };
      if (exerciseType) {
        if (lastDate === today) {
          exerciseStreak[exerciseType] = (exerciseStreak[exerciseType] || 0) + 1;
        } else {
          exerciseStreak[exerciseType] = 1;
        }
      }
      
      // Update soreness history
      const sorenessHistory = sorenessLevel !== null
        ? [...prev.sorenessHistory, { level: sorenessLevel, date: now, exerciseId }]
        : prev.sorenessHistory;
      
      const newProgress = {
        ...prev,
        exercises: updatedExercises,
        dailyStreak: newStreak,
        lastCompletedDate: now,
        lastExerciseType: exerciseType,
        exerciseStreak,
        sorenessHistory
      };
      
      // Train AI model with new data if soreness level is provided
      if (sorenessLevel !== null) {
        const exercise = {
          id: exerciseId,
          type: exerciseType,
          duration,
          difficulty: prev.preferredDifficulty
        };
        
        const userStats = {
          averageSoreness: sorenessLevel,
          dailyStreak: newStreak,
          missedSessions: prev.missedSessions.length,
          exerciseStreak: exerciseStreak,
          lastExerciseType: exerciseType,
          preferredDifficulty: prev.preferredDifficulty
        };
        
        aiService.trainModel(exercise, userStats, sorenessLevel)
          .then(() => aiService.saveModel())
          .catch(console.error);
      }
      
      return newProgress;
    });
  }, []);
  
  // Record missed session
  const recordMissedSession = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      missedSessions: [...prev.missedSessions, new Date().toISOString()]
    }));
  }, []);
  
  // Check if user is ready to progress to next difficulty
  const checkProgression = useCallback(() => {
    const currentDifficulty = progress.preferredDifficulty;
    if (currentDifficulty === 'advanced') return false;
    
    // Count exercises completed at current difficulty
    const currentExercises = Object.entries(progress.exercises)
      .filter(([_, stats]) => stats.completions > 0)
      .length;
    
    // Require at least 5 different exercises completed
    // and a 3-day streak before suggesting progression
    return currentExercises >= 5 && progress.dailyStreak >= 3;
  }, [progress]);
  
  // Update preferred difficulty
  const updateDifficulty = useCallback((newDifficulty) => {
    setProgress(prev => ({
      ...prev,
      preferredDifficulty: newDifficulty,
      progressionReady: false
    }));
  }, []);
  
  // Get exercise recommendations with AI enhancement
  const getRecommendations = useCallback(async (availableExercises) => {
    if (!availableExercises || availableExercises.length === 0) return [];
    
    try {
      // Get user stats for AI model
      const userStats = {
        averageSoreness: progress.sorenessHistory.length > 0
          ? progress.sorenessHistory.reduce((sum, entry) => sum + entry.level, 0) / progress.sorenessHistory.length
          : 0,
        dailyStreak: progress.dailyStreak,
        missedSessions: progress.missedSessions.length,
        exerciseStreak: progress.exerciseStreak,
        lastExerciseType: progress.lastExerciseType,
        preferredDifficulty: progress.preferredDifficulty
      };
      
      // Get AI-enhanced recommendations
      const recommendations = await aiService.getRecommendations(availableExercises, userStats);
      
      // If AI recommendations are available, use them
      if (recommendations.length > 0) {
        return recommendations;
      }
      
      // Fallback to basic recommendations if AI fails
      return availableExercises
        .sort((a, b) => {
          const aStats = progress.exercises[a.id] || { completions: 0 };
          const bStats = progress.exercises[b.id] || { completions: 0 };
          return aStats.completions - bStats.completions;
        })
        .slice(0, 3);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return availableExercises.slice(0, 3);
    }
  }, [progress]);
  
  // Get exercise stats
  const getExerciseStats = useCallback((exerciseId) => {
    return progress.exercises[exerciseId] || {
      completions: 0,
      totalDuration: 0,
      lastCompleted: null,
      soreness: []
    };
  }, [progress.exercises]);
  
  // Get overall stats
  const getOverallStats = useCallback(() => {
    const totalExercises = Object.keys(progress.exercises).length;
    const totalCompletions = Object.values(progress.exercises)
      .reduce((sum, stats) => sum + stats.completions, 0);
    const totalDuration = Object.values(progress.exercises)
      .reduce((sum, stats) => sum + stats.totalDuration, 0);
    
    // Calculate average soreness
    const sorenessEntries = progress.sorenessHistory;
    const averageSoreness = sorenessEntries.length > 0
      ? sorenessEntries.reduce((sum, entry) => sum + entry.level, 0) / sorenessEntries.length
      : 0;
    
    return {
      totalExercises,
      totalCompletions,
      totalDuration,
      dailyStreak: progress.dailyStreak,
      lastExerciseType: progress.lastExerciseType,
      exerciseStreak: progress.exerciseStreak,
      averageSoreness,
      missedSessions: progress.missedSessions.length
    };
  }, [progress]);
  
  return (
    <ExerciseProgressContext.Provider value={{
      progress,
      recordExercise,
      recordMissedSession,
      checkProgression,
      updateDifficulty,
      getRecommendations,
      getExerciseStats,
      getOverallStats
    }}>
      {children}
    </ExerciseProgressContext.Provider>
  );
}

export function useExerciseProgress() {
  const context = useContext(ExerciseProgressContext);
  if (!context) {
    throw new Error('useExerciseProgress must be used within an ExerciseProgressProvider');
  }
  return context;
} 