import React from 'react';
import { useBreakReminder } from '../context/BreakReminderContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/BreakReminderSettings.css';

function BreakReminderSettings() {
  const { 
    isEnabled, 
    toggleReminder, 
    interval, 
    setInterval,
    breakDuration,
    setBreakDuration
  } = useBreakReminder();
  const { theme } = useTheme();

  return (
    <div className={`break-reminder-settings ${theme}`}>
      <h3>Break Reminder Settings</h3>
      <div className="settings-group">
        <label>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={toggleReminder}
          />
          Enable Break Reminders
        </label>
      </div>
      
      {isEnabled && (
        <>
          <div className="settings-group">
            <label>
              Reminder Interval (minutes):
              <input
                type="number"
                min="1"
                max="120"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
              />
            </label>
          </div>
          
          <div className="settings-group">
            <label>
              Break Duration (minutes):
              <input
                type="number"
                min="1"
                max="30"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}

export default BreakReminderSettings; 