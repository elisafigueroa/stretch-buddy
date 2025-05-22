import React, { useState, useEffect } from 'react';
import { useBreakReminder } from '../context/BreakReminderContext';
import { useExerciseProgress } from '../context/ExerciseProgressContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/BreakReminderModal.css';

function BreakReminderModal() {
  const { 
    showReminder, 
    handleSnooze, 
    handleComplete,
    currentExercise,
    settings,
    availableExercises
  } = useBreakReminder();
  
  const { recordExercise, getRecommendations } = useExerciseProgress();
  const { theme } = useTheme();
  
  const [exerciseDuration, setExerciseDuration] = useState(0);
  const [isExercising, setIsExercising] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [sorenessLevel, setSorenessLevel] = useState(null);
  const [showSorenessPrompt, setShowSorenessPrompt] = useState(false);
  
  useEffect(() => {
    if (availableExercises) {
      const recommended = getRecommendations(availableExercises);
      setRecommendations(recommended);
    }
  }, [availableExercises, getRecommendations]);
  
  useEffect(() => {
    let timer;
    if (isExercising) {
      timer = setInterval(() => {
        setExerciseDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExercising]);
  
  if (!showReminder || !currentExercise) return null;
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'gentle':
        return 'var(--success-color, #10b981)';
      case 'moderate':
        return 'var(--warning-color, #f59e0b)';
      case 'advanced':
        return 'var(--danger-color, #ef4444)';
      default:
        return 'var(--text-secondary)';
    }
  };
  
  const handleStartExercise = () => {
    setIsExercising(true);
  };
  
  const handleFinishExercise = () => {
    setIsExercising(false);
    setShowSorenessPrompt(true);
  };
  
  const handleSorenessSubmit = () => {
    recordExercise(currentExercise.id, exerciseDuration, currentExercise.type, sorenessLevel);
    setShowSorenessPrompt(false);
    handleComplete();
  };
  
  const handleSkipSoreness = () => {
    recordExercise(currentExercise.id, exerciseDuration, currentExercise.type);
    setShowSorenessPrompt(false);
    handleComplete();
  };
  
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="modal-overlay">
      <div className={`modal-content ${theme}`}>
        <h2>Time for a Break!</h2>
        
        <div className="exercise-card">
          <div className="exercise-header">
            <h3>{currentExercise.name}</h3>
            <span 
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(currentExercise.difficulty) }}
            >
              {currentExercise.difficulty}
            </span>
          </div>
          
          <p className="exercise-instructions">{currentExercise.instructions}</p>
          
          <div className="exercise-modifications">
            <strong>Hypermobility Modifications:</strong>
            <p>{currentExercise.modifications}</p>
          </div>
          
          <p className="exercise-benefits">
            <strong>Benefits:</strong> {currentExercise.benefits}
          </p>
          
          <div className="exercise-tags">
            {currentExercise.tags.map(tag => (
              <span key={tag} className="exercise-tag">{tag}</span>
            ))}
          </div>
        </div>
        
        {recommendations.length > 0 && (
          <div className="exercise-recommendations">
            <h4>You might also like:</h4>
            <div className="recommendations-list">
              {recommendations.map(exercise => (
                <div key={exercise.id} className="recommendation-item">
                  <span className="recommendation-name">{exercise.name}</span>
                  <span className="recommendation-type">{exercise.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="break-reminder-actions">
          {!isExercising ? (
            <>
              <button 
                className="break-reminder-button snooze"
                onClick={handleSnooze}
              >
                Snooze ({settings.snoozeDuration / 60} min)
              </button>
              
              <button 
                className="break-reminder-button start"
                onClick={handleStartExercise}
              >
                Start Exercise
              </button>
            </>
          ) : showSorenessPrompt ? (
            <div className="soreness-prompt">
              <h4>How did that feel?</h4>
              <div className="soreness-scale">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    className={`soreness-button ${sorenessLevel === level ? 'active' : ''}`}
                    onClick={() => setSorenessLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="soreness-labels">
                <span>Easy</span>
                <span>Challenging</span>
              </div>
              <div className="soreness-actions">
                <button 
                  className="break-reminder-button skip"
                  onClick={handleSkipSoreness}
                >
                  Skip
                </button>
                <button 
                  className="break-reminder-button submit"
                  onClick={handleSorenessSubmit}
                  disabled={sorenessLevel === null}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="exercise-timer">
              <span className="timer-display">{formatDuration(exerciseDuration)}</span>
              <button 
                className="break-reminder-button complete"
                onClick={handleFinishExercise}
              >
                Complete Exercise
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BreakReminderModal; 