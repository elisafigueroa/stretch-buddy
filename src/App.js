import React, { useState, useEffect, useCallback } from 'react';
import { stretches, categories } from './data/stretches';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressStats } from './components/ProgressStats';
import { DetailedStats } from './components/DetailedStats';
import { CompletionCelebration } from './components/CompletionCelebration';
import { FavoriteButton } from './components/FavoriteButton';
import { ThemeToggle } from './components/ThemeToggle';
import './App.css';

function StretchApp() {
  const [currentStretch, setCurrentStretch] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  const { recordStretch } = useProgress();
  const { favorites } = useFavorites();

  const filteredStretches = stretches
    .filter(stretch => {
      if (showFavorites) {
        return favorites.includes(stretch.id);
      }
      if (selectedCategory === 'all') {
        return true;
      }
      return stretch.category === selectedCategory;
    });

  const startStretch = (stretch) => {
    setCurrentStretch(stretch);
    setTimer(stretch.duration);
    setIsActive(true);
    setIsPaused(false);
  };

  const endStretch = useCallback((completed = false) => {
    if (isActive && !isPaused) {
      recordStretch(currentStretch.duration - timer);
      if (completed) {
        setShowCelebration(true);
      }
    }
    setIsActive(false);
    setIsPaused(false);
    setCurrentStretch(null);
    setTimer(0);
  }, [isActive, isPaused, recordStretch, currentStretch, timer]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTimer((time) => {
          if (time <= 1) {
            endStretch(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, endStretch]);

  const renderStretchGrid = () => {
    if (showFavorites && favorites.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 animate-bounce">💭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
          <p className="text-gray-600 mb-4">
            Click the heart icon on any stretch to add it to your favorites
          </p>
          <button
            onClick={() => setShowFavorites(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            Browse All Stretches
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStretches.map((stretch) => (
          <div key={stretch.id} className="stretch-card p-4">
            <FavoriteButton stretchId={stretch.id} />
            <img 
              src={stretch.image} 
              alt={stretch.name}
              className="w-full h-48 object-cover mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{stretch.name}</h2>
            <p className="text-gray-600 mb-4">{stretch.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {stretch.tags.map(tag => (
                <span 
                  key={tag}
                  className="tag"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => startStretch(stretch)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Stretch
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <header className="app-header">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-3xl">🧘‍♂️</span>
              Stretch Buddy
            </h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => setShowDetailedStats(!showDetailedStats)}
                className="text-white hover:text-blue-100 transition-colors"
              >
                {showDetailedStats ? 'Hide Stats' : 'Show Stats'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="mb-6">
          <ProgressStats />
        </div>

        {showDetailedStats && <DetailedStats />}
        
        {!currentStretch ? (
          <>
            <div className="category-filter">
              <button
                onClick={() => {
                  setShowFavorites(false);
                  setSelectedCategory('all');
                }}
                className={`category-button ${
                  !showFavorites && selectedCategory === 'all' ? 'active' : ''
                }`}
              >
                All Stretches
              </button>
              <button
                onClick={() => setShowFavorites(true)}
                className={`category-button ${
                  showFavorites ? 'active' : ''
                }`}
              >
                Favorites {favorites.length > 0 && `(${favorites.length})`}
              </button>
              {!showFavorites && categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-button ${
                    selectedCategory === category.id ? 'active' : ''
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {renderStretchGrid()}
          </>
        ) : (
          <div className="stretch-card p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">{currentStretch.name}</h2>
            <img 
              src={currentStretch.image} 
              alt={currentStretch.name}
              className="w-full h-64 object-cover mb-4"
            />
            <p className="text-gray-600 mb-4">{currentStretch.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {currentStretch.tags.map(tag => (
                <span 
                  key={tag}
                  className="tag"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-center">
              <div className={`timer-display ${isActive && !isPaused ? 'timer-active' : ''}`}>
                {formatTime(timer)}
              </div>
              <div className="space-x-4">
                <button
                  onClick={togglePause}
                  className="bg-yellow-600 text-white py-2 px-6 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button
                  onClick={() => endStretch(false)}
                  className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
                >
                  End Stretch
                </button>
              </div>
            </div>
          </div>
        )}

        {showCelebration && (
          <CompletionCelebration onClose={() => setShowCelebration(false)} />
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <FavoritesProvider>
          <StretchApp />
        </FavoritesProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default App;
