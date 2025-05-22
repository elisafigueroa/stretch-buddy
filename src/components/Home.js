import React from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Home.css';

function Home() {
  const { theme } = useTheme();

  return (
    <div className={`home ${theme}`}>
      <h1>Welcome to Stretch Buddy</h1>
      <p>Your personal stretching and exercise companion</p>
      <div className="features">
        <div className="feature-card">
          <h2>Break Reminders</h2>
          <p>Get gentle reminders to take breaks and stretch throughout your day</p>
        </div>
        <div className="feature-card">
          <h2>Exercise Progress</h2>
          <p>Track your stretching routine and see your progress over time</p>
        </div>
        <div className="feature-card">
          <h2>Custom Routines</h2>
          <p>Create personalized stretching routines tailored to your needs</p>
        </div>
      </div>
    </div>
  );
}

export default Home; 