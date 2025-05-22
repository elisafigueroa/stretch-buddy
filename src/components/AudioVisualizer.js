import React, { useEffect, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

function AudioVisualizer({ size = 200, color = '#4CAF50' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const { isPlaying, isMuted } = useAudio();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    // Create audio context and analyzer
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;
    
    // Get audio element and connect it to analyzer
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);
    }
    
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!isPlaying || isMuted) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      
      analyzer.getByteFrequencyData(dataArray);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate average frequency
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      const scale = average / 128; // Normalize to 0-1 range
      
      // Draw pulsing ring
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = size * 0.4;
      const pulseRadius = baseRadius * (1 + scale * 0.2);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // Draw inner glow
      const gradient = ctx.createRadialGradient(
        centerX, centerY, baseRadius,
        centerX, centerY, pulseRadius
      );
      gradient.addColorStop(0, `${color}33`); // 20% opacity
      gradient.addColorStop(1, `${color}00`); // 0% opacity
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      audioContext.close();
    };
  }, [size, color, isPlaying, isMuted]);
  
  return (
    <canvas
      ref={canvasRef}
      className="audio-visualizer"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}

export default AudioVisualizer; 