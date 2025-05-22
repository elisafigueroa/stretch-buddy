import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';

function AudioControls() {
  const { isPlaying, play, pause, volume, setVolume, isMuted, toggleMute } = useAudio();
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const handleVolumeChange = (e) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="audio-controls">
      <button
        className="audio-toggle"
        onClick={isPlaying ? pause : play}
        title={isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {isPlaying ? '🔊' : '🔈'}
      </button>
      
      <button
        className="mute-toggle"
        onClick={toggleMute}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      <div 
        className="volume-container"
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
      >
        {showVolumeSlider && (
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        )}
      </div>
    </div>
  );
}

export default AudioControls; 