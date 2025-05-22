import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import AudioControls from './AudioControls';
import AudioVisualizer from './AudioVisualizer';

function RoutinePlayer({ routine, onComplete }) {
  const { isDarkMode } = useTheme();
  const { play, pause, changeTrack, playSoundEffect } = useAudio();
  const [currentStretchIndex, setCurrentStretchIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showNextUp, setShowNextUp] = useState(false);
  const [nextUpCountdown, setNextUpCountdown] = useState(3);

  const currentStretch = routine.stretches[currentStretchIndex];
  const nextStretch = routine.stretches[currentStretchIndex + 1];

  // Determine the appropriate audio track based on routine type
  const getRoutineAudioTrack = useCallback(() => {
    const routineType = routine.type?.toLowerCase() || 'calm';
    switch (routineType) {
      case 'yoga':
      case 'meditation':
        return 'meditation';
      case 'dynamic':
      case 'cardio':
        return 'upbeat';
      default:
        return 'calm';
    }
  }, [routine.type]);

  const startTimer = useCallback((duration) => {
    setTimeLeft(duration);
    setIsPlaying(true);
    setIsPaused(false);
    play();
    playSoundEffect(isResting ? 'restStart' : 'stretchStart');
  }, [play, playSoundEffect, isResting]);

  const handleComplete = useCallback(() => {
    if (currentStretchIndex < routine.stretches.length - 1) {
      playSoundEffect('stretchEnd');
      setShowNextUp(true);
      setNextUpCountdown(3);
    } else {
      playSoundEffect('routineComplete');
      pause();
      onComplete();
    }
  }, [currentStretchIndex, routine.stretches.length, onComplete, pause, playSoundEffect]);

  const handleNextUpComplete = useCallback(() => {
    setShowNextUp(false);
    setIsResting(true);
    startTimer(routine.restBetween);
  }, [routine.restBetween, startTimer]);

  const handleRestComplete = useCallback(() => {
    setIsResting(false);
    setCurrentStretchIndex(prev => prev + 1);
    startTimer(routine.stretches[currentStretchIndex + 1].duration);
  }, [currentStretchIndex, routine.stretches, startTimer]);

  const handleSkip = useCallback(() => {
    if (isResting) {
      handleRestComplete();
    } else {
      handleComplete();
    }
  }, [isResting, handleRestComplete, handleComplete]);

  const handleRewind = useCallback(() => {
    if (currentStretchIndex > 0) {
      setCurrentStretchIndex(prev => prev - 1);
      startTimer(routine.stretches[currentStretchIndex - 1].duration);
    }
  }, [currentStretchIndex, routine.stretches, startTimer]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
    if (isPaused) {
      play();
    } else {
      pause();
    }
  }, [isPaused, play, pause]);

  // Initialize audio track when routine starts
  useEffect(() => {
    const track = getRoutineAudioTrack();
    changeTrack(track);
  }, [getRoutineAudioTrack, changeTrack]);

  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (isResting) {
            handleRestComplete();
          } else {
            handleComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, isPaused, isResting, handleComplete, handleRestComplete]);

  useEffect(() => {
    if (!showNextUp) return;

    const timer = setInterval(() => {
      setNextUpCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextUpComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showNextUp, handleNextUpComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentStretchIndex + 1) / routine.stretches.length) * 100;

  if (showNextUp) {
    return (
      <div className="routine-player next-up">
        <h2>Next Up</h2>
        <h3>{nextStretch.instructions}</h3>
        <div className="countdown">{nextUpCountdown}</div>
      </div>
    );
  }

  return (
    <div className="routine-player">
      <AudioControls />
      
      <div className="routine-header">
        <h2>{routine.name}</h2>
        <div className="routine-progress">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">
            {currentStretchIndex + 1} of {routine.stretches.length}
          </span>
        </div>
      </div>

      <div className="timer-container" style={{ position: 'relative' }}>
        <AudioVisualizer 
          size={200} 
          color={isDarkMode ? '#4CAF50' : '#2E7D32'} 
        />
        <div className="timer-display">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="stretch-info">
        <h3>{isResting ? 'Rest' : currentStretch.instructions}</h3>
        <p>
          {isResting 
            ? 'Take a moment to breathe'
            : `Hold for ${currentStretch.duration} seconds`
          }
        </p>
      </div>

      <div className="controls">
        <button 
          className="control-button rewind"
          onClick={handleRewind}
          disabled={currentStretchIndex === 0}
        >
          ⏪
        </button>
        
        {isPlaying ? (
          <button 
            className="control-button pause"
            onClick={togglePause}
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
        ) : (
          <button 
            className="control-button start"
            onClick={() => startTimer(currentStretch.duration)}
          >
            {currentStretchIndex === 0 ? 'Start Routine' : 'Continue'}
          </button>
        )}

        <button 
          className="control-button skip"
          onClick={handleSkip}
          disabled={currentStretchIndex === routine.stretches.length - 1 && !isResting}
        >
          ⏩
        </button>
      </div>
    </div>
  );
}

export default RoutinePlayer; 