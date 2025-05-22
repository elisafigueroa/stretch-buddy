import React, { useState, useEffect } from 'react';
import { aiService } from '../services/aiRecommendationService';
import { useExerciseProgress } from '../context/ExerciseProgressContext';

function AIMonitor() {
  const [modelStats, setModelStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { getOverallStats } = useExerciseProgress();

  useEffect(() => {
    // Update stats every 5 seconds
    const interval = setInterval(() => {
      setModelStats(aiService.getModelStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleResetModel = async () => {
    if (window.confirm('Are you sure you want to reset the AI model? This will clear all training history.')) {
      await aiService.resetModel();
      setModelStats(aiService.getModelStats());
    }
  };

  if (!isVisible) {
    return (
      <button 
        className="ai-monitor-toggle"
        onClick={() => setIsVisible(true)}
      >
        AI Monitor
      </button>
    );
  }

  const userStats = getOverallStats();

  return (
    <div className="ai-monitor">
      <div className="ai-monitor-header">
        <h3>AI Model Monitor</h3>
        <button 
          className="ai-monitor-close"
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>

      <div className="ai-monitor-content">
        <div className="model-status">
          <h4>Model Status</h4>
          <p>Loaded: {modelStats?.isLoaded ? '✅' : '❌'}</p>
          <p>Feature Size: {modelStats?.featureSize}</p>
          <p>Training Records: {modelStats?.trainingHistory?.length || 0}</p>
        </div>

        <div className="user-stats">
          <h4>User Stats</h4>
          <p>Daily Streak: {userStats.dailyStreak}</p>
          <p>Average Soreness: {userStats.averageSoreness.toFixed(1)}</p>
          <p>Missed Sessions: {userStats.missedSessions}</p>
        </div>

        {modelStats?.lastPredictions?.length > 0 && (
          <div className="last-predictions">
            <h4>Last Predictions</h4>
            <div className="prediction-bars">
              {modelStats.lastPredictions.map((score, index) => (
                <div 
                  key={index}
                  className="prediction-bar"
                  style={{ 
                    height: `${score * 100}%`,
                    backgroundColor: `hsl(${120 * score}, 70%, 50%)`
                  }}
                  title={`Score: ${score.toFixed(3)}`}
                />
              ))}
            </div>
          </div>
        )}

        {modelStats?.trainingHistory?.length > 0 && (
          <div className="training-history">
            <h4>Recent Training</h4>
            <div className="history-list">
              {modelStats.trainingHistory.slice(-5).map((record, index) => (
                <div key={index} className="history-item">
                  <span className="history-exercise">{record.exercise}</span>
                  <span className="history-soreness">Soreness: {record.soreness}</span>
                  <span className="history-loss">Loss: {record.loss.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ai-monitor-actions">
          <button 
            className="reset-model-button"
            onClick={handleResetModel}
          >
            Reset Model
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIMonitor; 