import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext();

const AUDIO_TRACKS = {
  // Ambient tracks
  calm: '/audio/calm-ambient.mp3',
  upbeat: '/audio/upbeat-ambient.mp3',
  meditation: '/audio/meditation-ambient.mp3',
  
  // Transition sounds
  transition: '/audio/transition-chime.mp3',
  
  // Stretch sounds
  stretchStart: '/audio/stretch-start.mp3',
  stretchEnd: '/audio/stretch-end.mp3',
  restStart: '/audio/rest-start.mp3',
  routineComplete: '/audio/routine-complete.mp3'
};

const FADE_DURATION = 1000; // 1 second fade

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('audioVolume');
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });
  const [isMuted, setIsMuted] = useState(() => {
    const savedMute = localStorage.getItem('audioMuted');
    return savedMute ? JSON.parse(savedMute) : false;
  });
  const [currentTrack, setCurrentTrack] = useState('calm');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const audioRef = useRef(new Audio());
  const sfxRefs = useRef({
    transition: new Audio(AUDIO_TRACKS.transition),
    stretchStart: new Audio(AUDIO_TRACKS.stretchStart),
    stretchEnd: new Audio(AUDIO_TRACKS.stretchEnd),
    restStart: new Audio(AUDIO_TRACKS.restStart),
    routineComplete: new Audio(AUDIO_TRACKS.routineComplete)
  });

  const fadeTimeoutRef = useRef(null);

  // Initialize sound effects
  useEffect(() => {
    Object.values(sfxRefs.current).forEach(audio => {
      audio.volume = volume;
      audio.muted = isMuted;
    });
  }, [volume, isMuted]);

  // Handle volume changes
  useEffect(() => {
    if (!isMuted) {
      audioRef.current.volume = volume;
      Object.values(sfxRefs.current).forEach(audio => {
        audio.volume = volume;
      });
    }
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume, isMuted]);

  // Handle mute changes
  useEffect(() => {
    audioRef.current.muted = isMuted;
    Object.values(sfxRefs.current).forEach(audio => {
      audio.muted = isMuted;
    });
    localStorage.setItem('audioMuted', isMuted.toString());
  }, [isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    const audio = audioRef.current;
    const sfx = sfxRefs.current;

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      if (sfx) {
        Object.values(sfx).forEach(sound => {
          sound.pause();
          sound.currentTime = 0;
        });
      }
    };
  }, []);

  const fadeOut = (audio) => {
    return new Promise((resolve) => {
      const startVolume = audio.volume;
      const startTime = Date.now();

      const fade = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / FADE_DURATION, 1);
        
        audio.volume = startVolume * (1 - progress);
        
        if (progress < 1) {
          fadeTimeoutRef.current = requestAnimationFrame(fade);
        } else {
          resolve();
        }
      };

      fade();
    });
  };

  const fadeIn = (audio, targetVolume) => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      audio.volume = 0;

      const fade = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / FADE_DURATION, 1);
        
        audio.volume = targetVolume * progress;
        
        if (progress < 1) {
          fadeTimeoutRef.current = requestAnimationFrame(fade);
        } else {
          resolve();
        }
      };

      fade();
    });
  };

  const playSoundEffect = async (effectName) => {
    if (isMuted || !sfxRefs.current[effectName]) return;
    
    try {
      const audio = sfxRefs.current[effectName];
      audio.currentTime = 0;
      await audio.play();
    } catch (error) {
      console.error(`Error playing sound effect ${effectName}:`, error);
    }
  };

  const changeTrack = async (trackName) => {
    if (!AUDIO_TRACKS[trackName] || trackName === currentTrack) return;
    
    setIsTransitioning(true);
    
    try {
      // Fade out current track
      await fadeOut(audioRef.current);
      audioRef.current.pause();
      
      // Play transition sound
      await playSoundEffect('transition');
      
      // Change track and fade in
      audioRef.current.src = AUDIO_TRACKS[trackName];
      await audioRef.current.play();
      await fadeIn(audioRef.current, isMuted ? 0 : volume);
      
      setCurrentTrack(trackName);
    } catch (error) {
      console.error('Error changing track:', error);
    } finally {
      setIsTransitioning(false);
    }
  };

  const play = async () => {
    if (isPlaying) return;
    
    try {
      if (!audioRef.current.src) {
        audioRef.current.src = AUDIO_TRACKS[currentTrack];
      }
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pause = async () => {
    if (!isPlaying) return;
    
    try {
      await fadeOut(audioRef.current);
      audioRef.current.pause();
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const setVolumeLevel = (newVolume) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      volume,
      isMuted,
      currentTrack,
      isTransitioning,
      play,
      pause,
      toggleMute,
      setVolumeLevel,
      changeTrack,
      playSoundEffect
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
} 