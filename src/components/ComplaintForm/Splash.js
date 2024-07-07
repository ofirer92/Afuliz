import React from 'react';

const Splash = ({ isVisible }) => {
  return (
    <div className={`fixed inset-0 bg-gradient-to-bl from-blue-500 to-purple-600 z-50 flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="text-white text-4xl font-bold animate-pulse">
        ברוכים הבאים לטופס התלונות
      </div>
    </div>
  );
};

export default Splash;