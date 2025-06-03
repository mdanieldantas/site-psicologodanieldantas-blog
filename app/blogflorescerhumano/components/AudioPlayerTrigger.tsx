'use client';
import { useState } from 'react';
import FloatingAudioPlayer from './FloatingAudioPlayer';

interface AudioPlayerTriggerProps {
  conteudo: string;
  titulo?: string;
  className?: string;
}

export default function AudioPlayerTrigger({ 
  conteudo, 
  titulo, 
  className = '' 
}: AudioPlayerTriggerProps) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  return (
    <>
      {/* Botão trigger compacto */}
      <button
        onClick={() => setIsPlayerVisible(true)}
        className={`group flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#583B1F] to-[#6B7B3F] text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${className}`}
      >
        <div className="relative">
          <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.314zM15 8.25a.75.75 0 01-.75-.75 3.5 3.5 0 000 7 .75.75 0 01.75-.75.75.75 0 000-1.5 2 2 0 000-4 .75.75 0 01.75-.75z"/>
          </svg>
          {/* Indicador de ondas sonoras */}
          <div className="absolute -right-1 -top-1 w-2 h-2 bg-[#6B7B3F] rounded-full animate-pulse"></div>
        </div>
        
        <div className="text-left">
          <div className="text-sm font-semibold">🎧 Ouvir Artigo</div>
          <div className="text-xs opacity-90">Reprodução inteligente</div>
        </div>
        
        <svg className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>      {/* Floating Player */}
      <FloatingAudioPlayer
        conteudo={conteudo}
        titulo={titulo}
        isVisible={isPlayerVisible}
        onClose={() => setIsPlayerVisible(false)}
        startExpanded={true}
      />
    </>
  );
}
