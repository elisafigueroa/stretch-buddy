import React, { useState } from 'react';
import { routines } from '../data/routines';
import { useTheme } from '../context/ThemeContext';

function RoutineList({ onSelectRoutine }) {
  const { isDarkMode } = useTheme();
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const allTags = [...new Set(routines.flatMap(routine => routine.tags))];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const filteredRoutines = routines.filter(routine => {
    const matchesTag = selectedTag === 'all' || routine.tags.includes(selectedTag);
    const matchesDifficulty = selectedDifficulty === 'all' || routine.difficulty === selectedDifficulty;
    return matchesTag && matchesDifficulty;
  });

  return (
    <div className="routine-list">
      <div className="filters">
        <div className="tag-filter">
          <button
            className={`filter-button ${selectedTag === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTag('all')}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`filter-button ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="difficulty-filter">
          <button
            className={`filter-button ${selectedDifficulty === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty('all')}
          >
            All Levels
          </button>
          {difficulties.map(difficulty => (
            <button
              key={difficulty}
              className={`filter-button ${selectedDifficulty === difficulty ? 'active' : ''}`}
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      <div className="routine-grid">
        {filteredRoutines.map(routine => (
          <div
            key={routine.id}
            className="routine-card"
            onClick={() => onSelectRoutine(routine)}
          >
            <h3>{routine.name}</h3>
            <p>{routine.description}</p>
            <div className="routine-meta">
              <span className="duration">{routine.duration} min</span>
              <span className="difficulty">{routine.difficulty}</span>
            </div>
            <div className="routine-tags">
              {routine.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoutineList; 