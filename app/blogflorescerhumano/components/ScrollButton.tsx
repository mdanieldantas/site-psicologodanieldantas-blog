'use client';

import { useState, useEffect } from 'react';
import { MoveUp } from 'lucide-react';

export default function ScrollButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToPreviousSection = () => {
    const currentPosition = window.scrollY;
    const sections = document.querySelectorAll('section');
    let targetPosition = 0;

    for (const section of Array.from(sections).reverse()) {
      const sectionTop = section.offsetTop;
      if (sectionTop < currentPosition - 100) {
        targetPosition = sectionTop;
        break;
      }
    }

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  };  const [scrollActive, setScrollActive] = useState(true);

  // Efeito para controlar a opacidade do botão baseado na atividade de scroll
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScrollActivity = () => {
      setScrollActive(true);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollActive(false);
      }, 2500);
    };
    
    window.addEventListener('scroll', handleScrollActivity);
    
    // Inicia o timeout para diminuir a opacidade após montar
    handleScrollActivity();
    
    return () => {
      window.removeEventListener('scroll', handleScrollActivity);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <button
      onClick={scrollToPreviousSection}
      className={`fixed bottom-10 left-0 z-[60] py-1.5 px-4 bg-[#583B1F]/40 text-white text-xs font-light rounded-r-md shadow-sm hover:bg-[#735B43]/60 transition-all duration-300 flex items-center ${
        isVisible ? 'translate-x-0' : '-translate-x-full pointer-events-none'
      }`}
      style={{ opacity: scrollActive ? 0.9 : 0.3 }}
      aria-label="Voltar para a seção anterior"
    >
      <span className="mr-1 text-[10px]">↑</span>
      <span>voltar</span>
    </button>
  );
}
