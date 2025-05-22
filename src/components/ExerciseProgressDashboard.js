import React from 'react';
import { useExerciseProgress } from '../context/ExerciseProgressContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/ExerciseProgressDashboard.css';

function ExerciseProgressDashboard() {
  const { progress, getRecommendations } = useExerciseProgress();
  const { theme } = useTheme();

  return (
    <div className={`exercise-progress-dashboard ${theme}`}>
      <h2>Exercise Progress</h2>
      <div className="progress-stats">
        <div className="stat-card">
          <h3>Total Exercises</h3>
          <p>{progress.totalExercises}</p>
        </div>
        <div className="stat-card">
          <h3>This Week</h3>
          <p>{progress.weeklyExercises}</p>
        </div>
        <div className="stat-card">
          <h3>Streak</h3>
          <p>{progress.currentStreak} days</p>
        </div>
      </div>
      
      <div className="recommendations">
        <h3>Recommended Exercises</h3>
        <ul>
          {getRecommendations().map((exercise, index) => (
            <li key={index}>{exercise.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ExerciseProgressDashboard; 