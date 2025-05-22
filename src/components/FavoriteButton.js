import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';

export function FavoriteButton({ stretchId }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(stretchId);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(stretchId);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 z-10 ${
          favorite 
            ? 'bg-red-500 text-white scale-110' 
            : 'bg-white text-gray-400 hover:bg-gray-100'
        }`}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill={favorite ? 'currentColor' : 'none'}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={favorite ? 0 : 2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>
      
      {showTooltip && (
        <div className="absolute top-12 right-2 bg-gray-800 text-white text-sm py-1 px-2 rounded z-20 whitespace-nowrap">
          {favorite ? 'Remove from favorites' : 'Add to favorites'}
        </div>
      )}
    </div>
  );
} 