import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Header from './components/Header';
import Footer from './components/Footer';
import { MainContent } from './components/MainContent';
import BreakReminderModal from './components/BreakReminderModal';
import BreakReminderSettings from './components/BreakReminderSettings';
import { ExerciseProgressProvider } from './context/ExerciseProgressContext';
import ExerciseProgressDashboard from './components/ExerciseProgressDashboard';
import RoutineGenerator from './components/RoutineGenerator';
import ExerciseTimer from './components/ExerciseTimer';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Router>
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
                              <Routes>
                                <Route path="/" element={
                                  <>
                                    <MainContent />
                                    <ExerciseProgressDashboard />
                                    <BreakReminderSettings />
                                    <BreakReminderModal />
                                    <RoutineGenerator />
                                  </>
                                } />
                                <Route path="/timer" element={<ExerciseTimer />} />
                              </Routes>
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
      </Router>
    </ErrorBoundary>
  );
}

export default App;
