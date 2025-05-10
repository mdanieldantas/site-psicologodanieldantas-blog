'use client';

import React, { useEffect, useState } from 'react';

export default function ProgressBar() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      setWidth(scrolled);
    };

    // Verificar o scroll inicial
    handleScroll();

    // Adicionar o evento de scroll
    window.addEventListener('scroll', handleScroll);

    // Limpar o evento ao desmontar
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-green-500 z-50" 
      style={{ width: `${width}%` }}
    />
  );
}
