const https = require('https');
const fs = require('fs');
const path = require('path');

const AUDIO_FILES = {
  // Ambient tracks
  'calm-ambient.mp3': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=relaxing-mountains-rivers-streams-running-water-18178.mp3',
  'upbeat-ambient.mp3': 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73e3a.mp3?filename=upbeat-fun-energetic-corporate-142766.mp3',
  'meditation-ambient.mp3': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_0a4c1b2b3c.mp3?filename=meditation-zen-garden-18179.mp3',
  
  // Transition sounds
  'transition-chime.mp3': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_0a4c1b2b3c.mp3?filename=notification-sound-7032.mp3',
  
  // Stretch sounds
  'stretch-start.mp3': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_0a4c1b2b3c.mp3?filename=soft-notification-152054.mp3',
  'stretch-end.mp3': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_0a4c1b2b3c.mp3?filename=notification-sound-7032.mp3',
  'rest-start.mp3': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_0a4c1b2b3c.mp3?filename=soft-notification-152054.mp3',
  'routine-complete.mp3': 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_0a4c1b2b3c.mp3?filename=success-1-6297.mp3'
};

const AUDIO_DIR = path.join(__dirname, '../public/audio');

// Create audio directory if it doesn't exist
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Download each audio file
Object.entries(AUDIO_FILES).forEach(([filename, url]) => {
  const filePath = path.join(AUDIO_DIR, filename);
  
  https.get(url, (response) => {
    const file = fs.createWriteStream(filePath);
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}:`, err.message);
  });
}); 