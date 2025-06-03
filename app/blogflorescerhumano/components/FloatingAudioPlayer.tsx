'use client';
import { useState, useEffect, useRef } from 'react';
import { useDraggable } from '@/hooks/use-draggable';
import AudioReader from './AudioReader';

interface FloatingAudioPlayerProps {
  conteudo: string;
  titulo?: string;
  isVisible?: boolean;
  onClose?: () => void;
  startExpanded?: boolean;
}

export default function FloatingAudioPlayer({ 
  conteudo, 
  titulo, 
  isVisible = true,
  onClose,
  startExpanded = true
}: FloatingAudioPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(startExpanded);
  const [isMinimized, setIsMinimized] = useState(false);

  // Força estado expandido quando o player é aberto
  useEffect(() => {
    if (isVisible && startExpanded) {
      setIsExpanded(true);
    }
  }, [isVisible, startExpanded]);

  const { elementRef, position, isDragging, handlers } = useDraggable({
    initialPosition: { 
      x: typeof window !== 'undefined' ? window.innerWidth - 340 : 20, 
      y: 20 
    },
    snapToCorners: true,
    persistPosition: true,
    storageKey: 'audio-player-position'
  });

  if (!isVisible) return null;

  // Versão minimizada (apenas ícone)
  if (isMinimized) {
    return (
      <div
        ref={elementRef}
        className={`fixed z-50 transition-all duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: position.x,
          top: position.y,
          transform: isDragging ? 'scale(1.05)' : 'scale(1)'
        }}
        {...handlers}
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 bg-gradient-to-br from-[#A57C3A] to-[#583B1F] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.314z"/>
          </svg>
        </button>
      </div>
    );
  }

  // Versão compacta (header + botões principais)
  if (!isExpanded) {
    return (
      <div
        ref={elementRef}
        className={`fixed z-50 bg-gradient-to-br from-[#FFFFFF] to-[#F8F5F0] border border-[#E8E6E2]/50 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300 ${
          isDragging ? 'cursor-grabbing scale-105' : 'cursor-grab'
        }`}
        style={{
          left: position.x,
          top: position.y,
          width: '320px'
        }}
      >
        {/* Handle para arrastar */}
        <div 
          className="px-4 py-3 border-b border-[#E8E6E2]/30 flex items-center justify-between"
          {...handlers}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#A57C3A] to-[#583B1F] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.314z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-[#583B1F] text-sm">Ouvir Artigo</h4>
              <p className="text-xs text-[#7D6E63]">Clique para reproduzir</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Botão expandir */}
            <button
              onClick={() => setIsExpanded(true)}
              className="p-1.5 text-[#7D6E63] hover:text-[#583B1F] hover:bg-[#F8F5F0] rounded-lg transition-all duration-200"
              title="Expandir controles"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Botão minimizar */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-[#7D6E63] hover:text-[#583B1F] hover:bg-[#F8F5F0] rounded-lg transition-all duration-200"
              title="Minimizar"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Botão fechar */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-[#7D6E63] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Fechar player"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>        {/* Controles básicos */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsExpanded(true)}
              className="px-4 py-2 bg-[#583B1F] text-white rounded-lg font-medium hover:bg-[#6B7B3F] transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Reproduzir
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="px-3 py-2 text-[#583B1F] border border-[#E8E6E2] rounded-lg hover:bg-[#F8F5F0] transition-all duration-300 text-sm"
            >
              Mais controles
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Versão expandida (modal com todos os controles)
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={() => setIsExpanded(false)}
      />
      
      {/* Modal expandido */}
      <div
        className="fixed z-50 bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Header do modal */}
        <div className="flex items-center justify-between p-4 border-b border-[#E8E6E2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A57C3A] to-[#583B1F] rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.314z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#583B1F]">Player de Áudio</h3>
              <p className="text-sm text-[#7D6E63]">Controles completos</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 text-[#7D6E63] hover:text-[#583B1F] hover:bg-[#F8F5F0] rounded-lg transition-all duration-200"
              title="Minimizar controles"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11 9H15a1 1 0 010 2h-4v4a1 1 0 01-2 0v-4H5a1 1 0 010-2h4V5a1 1 0 012 0v4z" clipRule="evenodd" transform="rotate(45 10 10)" />
              </svg>
            </button>
          </div>
        </div>

        {/* Conteúdo do modal - AudioReader completo */}
        <div className="p-4">
          <AudioReader conteudo={conteudo} titulo={titulo} />
        </div>
      </div>
    </>
  );
}
