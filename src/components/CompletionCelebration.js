import React, { useEffect, useState } from 'react';

export function CompletionCelebration({ onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full mx-4 transform transition-all duration-500 hover:scale-105">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-blue-600 mb-3">Great job!</h2>
          <p className="text-gray-600 mb-6 text-lg">
            You've completed your stretch. Keep up the good work!
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Continue
          </button>
        </div>

        {/* Confetti animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: 0.7,
                fontSize: `${1 + Math.random() * 1.5}rem`
              }}
            >
              {['🎉', '✨', '🌟', '💪', '🎯', '🏆', '⭐', '🎊'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 