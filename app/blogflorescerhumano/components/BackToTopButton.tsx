'use client';

import React, { useEffect, useState } from 'react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Controlar visibilidade baseado na posição de rolagem
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Verificar a rolagem inicial
    toggleVisibility();
    
    // Adicionar o evento de scroll
    window.addEventListener('scroll', toggleVisibility);
    
    // Limpar o evento ao desmontar
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Função para rolar para o topo
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <button 
      className={`fixed bottom-8 right-8 bg-[#C19A6B] text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:bg-[#735B43] focus:outline-none focus:ring-2 focus:ring-[#C19A6B] focus:ring-opacity-50 ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
