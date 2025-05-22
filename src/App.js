import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider } from './context/AudioContext';
import { BreakReminderProvider } from './context/BreakReminderContext';
import { ExerciseProgressProvider } from './context/ExerciseProgressContext';
import { RoutineProvider } from './context/RoutineContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ExerciseProgressDashboard from './components/ExerciseProgressDashboard';
import BreakReminderSettings from './components/BreakReminderSettings';
import RoutineGenerator from './components/RoutineGenerator';
import './App.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AudioProvider>
          <BreakReminderProvider>
            <ExerciseProgressProvider>
              <RoutineProvider>
                <div className="App">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/progress" element={<ExerciseProgressDashboard />} />
                      <Route path="/settings" element={<BreakReminderSettings />} />
                      <Route path="/routine" element={<RoutineGenerator />} />
                    </Routes>
                  </main>
                </div>
              </RoutineProvider>
            </ExerciseProgressProvider>
          </BreakReminderProvider>
        </AudioProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
