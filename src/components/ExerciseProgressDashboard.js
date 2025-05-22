import React from 'react';
import { useExerciseProgress } from '../context/ExerciseProgressContext';
import { useTheme } from '../context/ThemeContext';

function ExerciseProgressDashboard() {
  const { 
    progress, 
    getOverallStats,
    checkProgression,
    updateDifficulty 
  } = useExerciseProgress();
  
  const { isDarkMode } = useTheme();
  const stats = getOverallStats();
  const canProgress = checkProgression();
  
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  const handleProgression = () => {
    const nextDifficulty = progress.preferredDifficulty === 'gentle' ? 'moderate' : 'advanced';
    updateDifficulty(nextDifficulty);
  };
  
  return (
    <div className="exercise-progress-dashboard">
      <h3>Your Progress</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.dailyStreak}</span>
          <span className="stat-label">Day Streak</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-value">{stats.totalExercises}</span>
          <span className="stat-label">Exercises Tried</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-value">{stats.totalCompletions}</span>
          <span className="stat-label">Total Completions</span>
        </div>
        
        <div className="stat-card">
          <span className="stat-value">{formatDuration(stats.totalDuration)}</span>
          <span className="stat-label">Total Time</span>
        </div>
      </div>
      
      <div className="current-difficulty">
        <h4>Current Difficulty</h4>
        <div className="difficulty-indicator">
          <span className={`difficulty-dot ${progress.preferredDifficulty === 'gentle' ? 'active' : ''}`} />
          <span className={`difficulty-dot ${progress.preferredDifficulty === 'moderate' ? 'active' : ''}`} />
          <span className={`difficulty-dot ${progress.preferredDifficulty === 'advanced' ? 'active' : ''}`} />
        </div>
        <p className="difficulty-label">
          {progress.preferredDifficulty.charAt(0).toUpperCase() + 
           progress.preferredDifficulty.slice(1)}
        </p>
      </div>
      
      {canProgress && (
        <div className="progression-prompt">
          <p>You're ready to try more challenging exercises!</p>
          <button 
            className="progression-button"
            onClick={handleProgression}
          >
            Progress to {progress.preferredDifficulty === 'gentle' ? 'Moderate' : 'Advanced'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ExerciseProgressDashboard; 