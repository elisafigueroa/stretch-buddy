import React, { useState } from 'react';
import { useExerciseProgress } from '../context/ExerciseProgressContext';
import { aiService } from '../services/aiRecommendationService';
import { exercises } from '../data/exercises';
import { useNavigate } from 'react-router-dom';
import { useRoutine } from '../context/RoutineContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/RoutineGenerator.css';

function RoutineGenerator() {
  const [generatedRoutine, setGeneratedRoutine] = useState(null);
  const [timeAvailable, setTimeAvailable] = useState(10); // minutes
  const [isGenerating, setIsGenerating] = useState(false);
  const { getOverallStats } = useExerciseProgress();
  const navigate = useNavigate();

  const generateRoutine = async () => {
    setIsGenerating(true);
    try {
      const userStats = getOverallStats();
      const recommendations = await aiService.getRecommendations(exercises, userStats);
      
      // Filter exercises based on time available
      const timeBudget = timeAvailable * 60; // convert to seconds
      let currentTime = 0;
      const selectedExercises = [];
      
      for (const exercise of recommendations) {
        if (currentTime + exercise.duration <= timeBudget) {
          selectedExercises.push(exercise);
          currentTime += exercise.duration;
        }
      }

      setGeneratedRoutine({
        exercises: selectedExercises,
        totalDuration: currentTime,
        targetAreas: selectedExercises.map(ex => ex.type).filter((v, i, a) => a.indexOf(v) === i)
      });
    } catch (error) {
      console.error('Error generating routine:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startRoutine = () => {
    if (generatedRoutine) {
      // Store the routine in localStorage for the timer component
      localStorage.setItem('currentRoutine', JSON.stringify(generatedRoutine));
      // Navigate to the timer view
      navigate('/timer');
    }
  };

  return (
    <div className="routine-generator">
      <h2>Smart Daily Routine</h2>
      
      <div className="time-selector">
        <label>Time Available:</label>
        <select 
          value={timeAvailable} 
          onChange={(e) => setTimeAvailable(Number(e.target.value))}
        >
          <option value={5}>5 minutes</option>
          <option value={10}>10 minutes</option>
          <option value={15}>15 minutes</option>
          <option value={20}>20 minutes</option>
          <option value={30}>30 minutes</option>
        </select>
      </div>

      <button 
        className="generate-button"
        onClick={generateRoutine}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Routine'}
      </button>

      {generatedRoutine && (
        <div className="routine-display">
          <h3>Your Personalized Routine</h3>
          <p className="routine-summary">
            {generatedRoutine.exercises.length} exercises • {Math.round(generatedRoutine.totalDuration / 60)} minutes
          </p>
          
          <div className="target-areas">
            <h4>Focus Areas:</h4>
            <div className="area-tags">
              {generatedRoutine.targetAreas.map(area => (
                <span key={area} className="area-tag">{area}</span>
              ))}
            </div>
          </div>

          <div className="exercise-list">
            {generatedRoutine.exercises.map((exercise, index) => (
              <div key={exercise.id} className="exercise-item">
                <span className="exercise-number">{index + 1}</span>
                <div className="exercise-details">
                  <h4>{exercise.name}</h4>
                  <p>{exercise.duration} seconds</p>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="start-routine-button"
            onClick={startRoutine}
          >
            Start Routine
          </button>
        </div>
      )}
    </div>
  );
}

export default RoutineGenerator; 