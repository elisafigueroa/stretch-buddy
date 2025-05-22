import React, { useState, useEffect } from 'react';
import { testExercises } from '../data/testExercises';
import { testLog, logTestResult, verifyTestOutcomes } from '../data/testLog';
import { aiService } from '../services/aiRecommendationService';
import { useExerciseProgress } from '../context/ExerciseProgressContext';

function AITestPanel() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [sorenessRating, setSorenessRating] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [testResults, setTestResults] = useState({});
  const [currentTest, setCurrentTest] = useState(null);
  const { getOverallStats } = useExerciseProgress();

  // Track model state changes
  useEffect(() => {
    if (currentTest) {
      const modelStats = aiService.getModelStats();
      const results = {
        modelLoaded: modelStats.isLoaded,
        trainingHistoryEmpty: modelStats.trainingHistory.length === 0,
        recommendationsPresent: recommendations.length > 0,
        trainingHistoryUpdated: modelStats.trainingHistory.length > 0,
        recommendationsChanged: recommendations.length > 0,
        lossDecreased: modelStats.trainingHistory.length > 1 && 
          modelStats.trainingHistory[modelStats.trainingHistory.length - 1].loss < 
          modelStats.trainingHistory[modelStats.trainingHistory.length - 2].loss
      };

      const verification = verifyTestOutcomes(testLog[currentTest], results);
      setTestResults(prev => ({
        ...prev,
        [currentTest]: verification
      }));

      logTestResult(testLog[currentTest], results);
    }
  }, [currentTest, recommendations]);

  const handleExerciseSelect = async (exercise) => {
    setSelectedExercise(exercise);
    const userStats = getOverallStats();
    const recs = await aiService.getRecommendations(testExercises, userStats);
    setRecommendations(recs);
  };

  const handleSorenessSubmit = async (rating) => {
    if (!selectedExercise) return;
    
    setSorenessRating(rating);
    const userStats = getOverallStats();
    await aiService.trainModel(selectedExercise, userStats, rating);
    
    // Get updated recommendations
    const recs = await aiService.getRecommendations(testExercises, userStats);
    setRecommendations(recs);
  };

  const handleReset = async () => {
    await aiService.resetModel();
    setSelectedExercise(null);
    setSorenessRating(null);
    setRecommendations([]);
    setCurrentTest('resetBehavior');
  };

  const startTest = (testName) => {
    setCurrentTest(testName);
    setTestResults(prev => ({
      ...prev,
      [testName]: { started: true }
    }));
  };

  return (
    <div className="ai-test-panel">
      <h3>AI System Test Panel</h3>
      
      <div className="test-controls">
        <h4>Test Cases</h4>
        <div className="test-buttons">
          {Object.keys(testLog).map(testName => (
            <button
              key={testName}
              className={`test-button ${currentTest === testName ? 'active' : ''}`}
              onClick={() => startTest(testName)}
            >
              {testLog[testName].description}
            </button>
          ))}
        </div>
      </div>

      {currentTest && testResults[currentTest] && (
        <div className="test-results">
          <h4>Test Results</h4>
          <div className="result-details">
            {testResults[currentTest].details?.map(detail => (
              <div 
                key={detail.check}
                className={`result-item ${detail.passed ? 'passed' : 'failed'}`}
              >
                <span className="check">{detail.check}</span>
                <span className="status">{detail.passed ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="test-exercises">
        <h4>Test Exercises</h4>
        <div className="exercise-list">
          {testExercises.map(exercise => (
            <button
              key={exercise.id}
              className={`exercise-button ${selectedExercise?.id === exercise.id ? 'active' : ''}`}
              onClick={() => handleExerciseSelect(exercise)}
            >
              {exercise.name}
            </button>
          ))}
        </div>
      </div>

      {selectedExercise && (
        <div className="exercise-details">
          <h4>Selected Exercise</h4>
          <p><strong>Name:</strong> {selectedExercise.name}</p>
          <p><strong>Type:</strong> {selectedExercise.type}</p>
          <p><strong>Difficulty:</strong> {selectedExercise.difficulty}</p>
          <p><strong>Duration:</strong> {selectedExercise.duration / 60} minutes</p>
          
          {!sorenessRating && (
            <div className="soreness-rating">
              <h4>Rate Soreness (1-5)</h4>
              <div className="rating-buttons">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleSorenessSubmit(rating)}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="recommendations">
          <h4>AI Recommendations</h4>
          <div className="recommendation-list">
            {recommendations.map((rec, index) => (
              <div key={rec.id} className="recommendation-item">
                <span className="rank">#{index + 1}</span>
                <span className="name">{rec.name}</span>
                <span className="score">Score: {rec.aiScore.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="test-actions">
        <button className="reset-button" onClick={handleReset}>
          Reset AI Model
        </button>
      </div>
    </div>
  );
}

export default AITestPanel; 