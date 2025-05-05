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
  };

  return (
    <div
      className={`fixed bottom-8 left-8 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
    >
      <button
        onClick={scrollToPreviousSection}
        className="group h-[52px] w-[32px] bg-[#583B1F] hover:bg-[#735B43] rounded-[20px] flex items-center justify-center shadow-lg transition-colors duration-300"
        aria-label="Rolar para seção anterior"
      >
        <MoveUp className="text-[#F8F5F0] w-4 h-4 group-hover:text-white" />
      </button>
    </div>
  );
}
