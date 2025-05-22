import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('stretchBuddyFavorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stretchBuddyFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (stretchId) => {
    setFavorites(prev => {
      if (prev.includes(stretchId)) {
        return prev.filter(id => id !== stretchId);
      }
      return [...prev, stretchId];
    });
  };

  const isFavorite = (stretchId) => {
    return favorites.includes(stretchId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 