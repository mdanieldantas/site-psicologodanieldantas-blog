'use client';

import React from 'react';

const ScrollDownButton = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      aria-label="Rolar para ver mais conteúdo" 
      onClick={handleScroll}
      className="w-10 h-16 text-[#C19A6B] animate-bounce cursor-pointer hover:text-[#735B43] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C19A6B] focus:ring-opacity-50 rounded-full p-2 hover:bg-white/10"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full drop-shadow-md"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  );
};

export default ScrollDownButton;
