import React from 'react';
import { useBreakReminder } from '../context/BreakReminderContext';
import { useTheme } from '../context/ThemeContext';

function BreakReminderSettings() {
  const { 
    settings, 
    updateSettings, 
    toggleReminder,
    requestNotificationPermission 
  } = useBreakReminder();
  
  const { isDarkMode } = useTheme();
  
  const handleIntervalChange = (e) => {
    const minutes = parseInt(e.target.value);
    updateSettings({ interval: minutes * 60 });
  };
  
  const handleSnoozeChange = (e) => {
    const minutes = parseInt(e.target.value);
    updateSettings({ snoozeDuration: minutes * 60 });
  };
  
  const handleDifficultyChange = (e) => {
    updateSettings({ preferredDifficulty: e.target.value });
  };
  
  const handleNotificationToggle = async () => {
    if (!settings.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }
    
    updateSettings({ 
      notificationsEnabled: !settings.notificationsEnabled 
    });
  };
  
  return (
    <div className="break-reminder-settings">
      <h3>Break Reminder Settings</h3>
      
      <div className="settings-group">
        <label>
          <span>Reminder Interval</span>
          <select 
            value={settings.interval / 60} 
            onChange={handleIntervalChange}
            disabled={!settings.enabled}
          >
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
          </select>
        </label>
        
        <label>
          <span>Snooze Duration</span>
          <select 
            value={settings.snoozeDuration / 60} 
            onChange={handleSnoozeChange}
            disabled={!settings.enabled}
          >
            <option value="5">5 minutes</option>
            <option value="10">10 minutes</option>
            <option value="15">15 minutes</option>
          </select>
        </label>
        
        <label>
          <span>Exercise Difficulty</span>
          <select 
            value={settings.preferredDifficulty} 
            onChange={handleDifficultyChange}
            disabled={!settings.enabled}
          >
            <option value="gentle">Gentle</option>
            <option value="moderate">Moderate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>
      
      <div className="settings-group">
        <label className="toggle-label">
          <span>Enable Reminders</span>
          <button 
            className={`toggle-button ${settings.enabled ? 'active' : ''}`}
            onClick={toggleReminder}
          >
            {settings.enabled ? 'On' : 'Off'}
          </button>
        </label>
        
        <label className="toggle-label">
          <span>Browser Notifications</span>
          <button 
            className={`toggle-button ${settings.notificationsEnabled ? 'active' : ''}`}
            onClick={handleNotificationToggle}
            disabled={!settings.enabled}
          >
            {settings.notificationsEnabled ? 'On' : 'Off'}
          </button>
        </label>
      </div>
    </div>
  );
}

export default BreakReminderSettings; 