import React, { createContext, useContext, useState } from 'react';

const RoutineContext = createContext();

export function RoutineProvider({ children }) {
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [routines, setRoutines] = useState([]);

  const startRoutine = (routine) => {
    setCurrentRoutine(routine);
  };

  const endRoutine = () => {
    setCurrentRoutine(null);
  };

  const addRoutine = (routine) => {
    setRoutines(prev => [...prev, routine]);
  };

  const removeRoutine = (routineId) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
  };

  return (
    <RoutineContext.Provider value={{
      currentRoutine,
      routines,
      startRoutine,
      endRoutine,
      addRoutine,
      removeRoutine
    }}>
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine() {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutine must be used within a RoutineProvider');
  }
  return context;
} 