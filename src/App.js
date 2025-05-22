import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { BreakReminderProvider } from './context/BreakReminderContext';
import { RoutineProvider } from './context/RoutineContext';
import { TimerProvider } from './context/TimerContext';
import { SettingsProvider } from './context/SettingsContext';
import { UserProvider } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MainContent } from './components/MainContent';
import { BreakReminderModal } from './components/BreakReminderModal';
import { BreakReminderSettings } from './components/BreakReminderSettings';
import { ExerciseProgressProvider } from './context/ExerciseProgressContext';
import ExerciseProgressDashboard from './components/ExerciseProgressDashboard';
import AIMonitor from './components/AIMonitor';
import AITestPanel from './components/AITestPanel';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <UserProvider>
            <SettingsProvider>
              <AudioProvider>
                <BreakReminderProvider>
                  <ExerciseProgressProvider>
                    <RoutineProvider>
                      <TimerProvider>
                        <ProgressProvider>
                          <div className="app">
                            <Header />
                            <MainContent />
                            <ExerciseProgressDashboard />
                            <AITestPanel />
                            <BreakReminderSettings />
                            <BreakReminderModal />
                            <AIMonitor />
                            <Footer />
                          </div>
                        </ProgressProvider>
                      </TimerProvider>
                    </RoutineProvider>
                  </ExerciseProgressProvider>
                </BreakReminderProvider>
              </AudioProvider>
            </SettingsProvider>
          </UserProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
