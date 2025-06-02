'use client';
import { useState, useEffect } from 'react';

interface AudioReaderProps {
  conteudo: string;
  titulo?: string;
}

export default function AudioReader({ conteudo, titulo }: AudioReaderProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [vozes, setVozes] = useState<SpeechSynthesisVoice[]>([]);
  const [vozSelecionada, setVozSelecionada] = useState<string>('pt-BR');
  const [velocidade, setVelocidade] = useState(0.9);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  
  // Estados para progresso e navegação
  const [paragrafos, setParagrafos] = useState<string[]>([]);
  const [paragrafoAtual, setParagrafoAtual] = useState(0);
  const [totalParagrafos, setTotalParagrafos] = useState(0);
  const [modoNavegacao, setModoNavegacao] = useState<'continuo' | 'paragrafo'>('continuo');
  const [progresso, setProgresso] = useState(0);
  const [textoAtual, setTextoAtual] = useState('');useEffect(() => {
    // Verificar suporte do navegador
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      
      const carregarVozes = () => {
        const vozesDisponiveis = window.speechSynthesis.getVoices();
        setVozes(vozesDisponiveis);
      };

      carregarVozes();
      window.speechSynthesis.addEventListener('voiceschanged', carregarVozes);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', carregarVozes);
        // Limpar qualquer síntese ativa ao desmontar
        try {
          window.speechSynthesis.cancel();
        } catch (error) {
          console.warn('Erro ao limpar síntese no cleanup:', error);
        }
      };
    }
  }, []);  // Processar conteúdo em parágrafos
  useEffect(() => {
    if (conteudo) {
      const textoLimpo = limparTexto(conteudo);
      // Dividir em parágrafos mais inteligentemente
      const paras = textoLimpo
        .split(/(?:\n\s*\n|\. (?=[A-Z][a-z])|\?\s+(?=[A-Z])|\!\s+(?=[A-Z]))/)
        .map(p => p.trim())
        .filter(p => p.length > 30) // Filtrar parágrafos muito pequenos
        .map(p => p.endsWith('.') || p.endsWith('!') || p.endsWith('?') ? p : p + '.');
      
      setParagrafos(paras);
      setTotalParagrafos(paras.length);
      setParagrafoAtual(0);
      setProgresso(0);
      
      // Inicializar o texto atual com o primeiro parágrafo
      if (paras.length > 0) {
        setTextoAtual(paras[0]);
      }
    }
  }, [conteudo]);

  // Limpar texto HTML para áudio
  const limparTexto = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, '') // Remove tags HTML
      .replace(/&nbsp;/g, ' ') // Substitui &nbsp; por espaço
      .replace(/&amp;/g, '&') // Substitui &amp; por &
      .replace(/&lt;/g, '<') // Substitui &lt; por <
      .replace(/&gt;/g, '>') // Substitui &gt; por >
      .replace(/&quot;/g, '"') // Substitui &quot; por "
      .replace(/&#39;/g, "'") // Substitui &#39; por '
      .replace(/\s+/g, ' ') // Remove espaços extras
      .trim();
  };

  // Ler parágrafo específico
  const lerParagrafo = (indice: number) => {
    if (!isSupported || indice >= paragrafos.length || indice < 0) return;

    window.speechSynthesis.cancel(); // Cancela qualquer leitura anterior
    
    const paragrafoTexto = paragrafos[indice];
    const textoCompleto = indice === 0 && titulo 
      ? `${titulo}. ${paragrafoTexto}` 
      : paragrafoTexto;
    
    setTextoAtual(paragrafoTexto);
    setParagrafoAtual(indice);
    
    const utterance = new SpeechSynthesisUtterance(textoCompleto);
    
    // Configurar voz se disponível
    const voz = vozes.find(v => v.lang === vozSelecionada);
    if (voz) {
      utterance.voice = voz;
    }
    
    utterance.lang = vozSelecionada;
    utterance.rate = velocidade;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      if (modoNavegacao === 'continuo' && indice < paragrafos.length - 1) {
        // Continuar para o próximo parágrafo automaticamente
        setTimeout(() => lerParagrafo(indice + 1), 500);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentUtterance(null);
        if (indice === paragrafos.length - 1) {
          setProgresso(100);
        }
      }
    };
    
    utterance.onerror = (event) => {
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        console.error('Erro na síntese de voz:', event.error);
      }
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };
    
    utterance.onpause = () => {
      setIsPaused(true);
    };
    
    utterance.onresume = () => {
      setIsPaused(false);
    };
    
    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
    
    // Atualizar progresso
    const novoProgresso = totalParagrafos > 0 ? ((indice + 1) / totalParagrafos) * 100 : 0;
    setProgresso(novoProgresso);
  };  const lerTexto = () => {
    if (!isSupported || !conteudo) return;

    if (isPlaying && !isPaused) {
      // Pausar
      try {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } catch (error) {
        console.warn('Erro ao pausar:', error);
        pararLeitura();
      }
    } else if (isPaused) {
      // Continuar
      try {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } catch (error) {
        console.warn('Erro ao retomar:', error);
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentUtterance(null);
      }
    } else {
      // Iniciar nova leitura baseada no modo
      if (modoNavegacao === 'paragrafo') {
        lerParagrafo(paragrafoAtual);
      } else {
        // Modo contínuo - começa do parágrafo atual
        lerParagrafo(paragrafoAtual);
      }
    }
  };

  // Navegar para parágrafo anterior
  const paragrafoAnterior = () => {
    if (paragrafoAtual > 0) {
      const novoIndice = paragrafoAtual - 1;
      if (isPlaying) {
        lerParagrafo(novoIndice);
      } else {
        setParagrafoAtual(novoIndice);
        setTextoAtual(paragrafos[novoIndice]);
        const novoProgresso = totalParagrafos > 0 ? ((novoIndice + 1) / totalParagrafos) * 100 : 0;
        setProgresso(novoProgresso);
      }
    }
  };

  // Navegar para próximo parágrafo
  const proximoParagrafo = () => {
    if (paragrafoAtual < paragrafos.length - 1) {
      const novoIndice = paragrafoAtual + 1;
      if (isPlaying) {
        lerParagrafo(novoIndice);
      } else {
        setParagrafoAtual(novoIndice);
        setTextoAtual(paragrafos[novoIndice]);
        const novoProgresso = totalParagrafos > 0 ? ((novoIndice + 1) / totalParagrafos) * 100 : 0;
        setProgresso(novoProgresso);
      }
    }
  };  const pararLeitura = () => {
    if (!isSupported) return;
    
    try {
      window.speechSynthesis.cancel();
    } catch (error) {
      console.warn('Erro ao cancelar síntese:', error);
    }
    
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentUtterance(null);
    setParagrafoAtual(0);
    setProgresso(0);
    setTextoAtual('');
  };

  // Reiniciar do início
  const reiniciarLeitura = () => {
    pararLeitura();
    setParagrafoAtual(0);
    setProgresso(0);
    setTextoAtual('');
  };
  // Não renderizar se não houver suporte
  if (!isSupported) {
    return (
      <div className="bg-gradient-to-br from-[#F8F5F0] to-[#E8E6E2]/30 border border-[#E8E6E2] rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#A57C3A]/20 to-[#583B1F]/10 rounded-full">
            <svg className="w-6 h-6 text-[#7D6E63]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h4 className="font-sans font-medium text-[#583B1F] mb-1">Recurso Indisponível</h4>
            <p className="text-[#7D6E63] text-sm leading-relaxed">
              A síntese de voz não está disponível neste navegador.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F8F5F0] border border-[#E8E6E2]/50 rounded-xl p-8 mb-10 font-sans shadow-lg shadow-[#583B1F]/5 backdrop-blur-sm">      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative group">
          <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#A57C3A] to-[#583B1F] rounded-xl shadow-lg shadow-[#583B1F]/20 transition-all duration-500 ${isPlaying ? 'scale-110 shadow-xl shadow-[#583B1F]/30' : 'group-hover:scale-105'}`}>
            <svg className={`w-6 h-6 text-white transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.314zM15 8.25a.75.75 0 01-.75-.75 3.5 3.5 0 000 7 .75.75 0 01.75-.75.75.75 0 000-1.5 2 2 0 000-4 .75.75 0 01.75-.75z"/>
            </svg>
          </div>
          {/* Status indicator com animação melhorada */}
          {isPlaying && (
            <div className="absolute -top-1 -right-1 transition-all duration-300 ease-out">
              <div className="w-4 h-4 bg-[#6B7B3F] rounded-full border-2 border-white shadow-sm animate-pulse">
                <div className="absolute inset-0 rounded-full bg-[#6B7B3F] animate-ping opacity-30"></div>
              </div>
            </div>
          )}
          {/* Indicador de pause */}
          {isPaused && (
            <div className="absolute -top-1 -right-1 transition-all duration-300 ease-out">
              <div className="w-4 h-4 bg-[#A57C3A] rounded-full border-2 border-white shadow-sm">
                <div className="absolute inset-1 rounded-full bg-white"></div>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="font-sans text-xl font-semibold text-[#583B1F] transition-colors duration-300">
            Ouvir Artigo
          </h3>
          <p className={`text-sm transition-all duration-500 ${isPlaying ? 'text-[#6B7B3F] font-medium' : 'text-[#7D6E63]'}`}>
            {isPlaying 
              ? (isPaused ? 'Reprodução pausada' : 'Reproduzindo...') 
              : 'Reprodução inteligente por parágrafos'
            }
          </p>
        </div>
      </div>      {/* Controles Principais */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <button
          onClick={lerTexto}
          disabled={!conteudo || totalParagrafos === 0}
          className="group relative px-8 py-3 bg-[#583B1F] text-white rounded-xl font-medium 
                     transition-all duration-300 transform hover:scale-105 active:scale-95
                     hover:-translate-y-1 shadow-lg hover:shadow-xl 
                     hover:bg-[#6B7B3F] flex items-center gap-3
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0
                     disabled:hover:bg-[#583B1F] focus:outline-none focus:ring-2 focus:ring-[#A57C3A] focus:ring-offset-2
                     min-h-[48px] text-base overflow-hidden"
        >
          {/* Ripple effect background */}
          <div className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 rounded-xl transition-transform duration-300 origin-center"></div>
          
          <div className="relative z-10">
            {isPlaying ? (
              isPaused ? (
                <>
                  <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-active:scale-90" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">Continuar reprodução</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-active:scale-90" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only">Pausar reprodução</span>
                </>
              )
            ) : (
              <>
                <svg className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-active:scale-90" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Iniciar reprodução</span>
              </>
            )}
          </div>
          <span className="font-medium relative z-10 transition-all duration-300">
            {isPlaying ? (isPaused ? 'Continuar' : 'Pausar') : 'Reproduzir'}
          </span>
          
          {/* Loading indicator para transições */}
          {isPlaying && !isPaused && (
            <div className="absolute top-0 left-0 h-1 bg-[#6B7B3F]/40 rounded-t-xl animate-pulse" style={{width: `${progresso}%`}}></div>
          )}
        </button>

        {(isPlaying || paragrafoAtual > 0) && (
          <div className="flex flex-wrap items-center gap-3 animate-in slide-in-from-left-5 duration-500">
            <button
              onClick={pararLeitura}
              className="group relative px-6 py-3 bg-white text-[#583B1F] border-2 border-[#583B1F] 
                         rounded-xl font-medium transition-all duration-300 transform 
                         hover:scale-105 active:scale-95 hover:-translate-y-1 shadow-lg hover:shadow-xl 
                         hover:bg-[#F8F5F0] flex items-center gap-2 overflow-hidden
                         focus:outline-none focus:ring-2 focus:ring-[#A57C3A] focus:ring-offset-2
                         min-h-[48px]"
            >
              <div className="absolute inset-0 bg-[#583B1F]/10 transform scale-0 group-active:scale-100 rounded-xl transition-transform duration-200"></div>
              <svg className="w-4 h-4 transition-all duration-300 group-hover:scale-110 group-active:scale-90 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10">Parar</span>
            </button>
            
            <button
              onClick={reiniciarLeitura}
              className="group relative px-6 py-3 bg-white text-[#A57C3A] border-2 border-[#A57C3A] 
                         rounded-xl font-medium transition-all duration-300 transform 
                         hover:scale-105 active:scale-95 hover:-translate-y-1 shadow-lg hover:shadow-xl 
                         hover:bg-[#F8F5F0] flex items-center gap-2 overflow-hidden
                         focus:outline-none focus:ring-2 focus:ring-[#583B1F] focus:ring-offset-2
                         min-h-[48px]"
            >
              <div className="absolute inset-0 bg-[#A57C3A]/10 transform scale-0 group-active:scale-100 rounded-xl transition-transform duration-200"></div>
              <svg className="w-4 h-4 transition-all duration-500 group-hover:rotate-180 group-active:scale-90 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10">Reiniciar</span>            </button>
          </div>
        )}
      </div>      {/* Barra de Progresso */}
      {totalParagrafos > 0 && (
        <div className="mb-8 animate-in fade-in-50 duration-700">
          <div className="flex items-center justify-between text-sm text-[#7D6E63] mb-3">
            <span className="font-medium transition-colors duration-300">Progresso da Leitura</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-500 ${
              isPlaying 
                ? 'bg-[#6B7B3F]/20 text-[#6B7B3F] animate-pulse' 
                : 'bg-[#E8E6E2] text-[#583B1F]'
            }`}>
              {paragrafoAtual + 1} de {totalParagrafos} parágrafos
            </span>
          </div>
          
          <div className="relative w-full bg-[#E8E6E2] rounded-full h-3 mb-6 shadow-inner overflow-hidden group">
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div 
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-[#A57C3A] to-[#6B7B3F] rounded-full transition-all duration-1000 ease-out shadow-sm overflow-hidden"
              style={{ width: `${progresso}%` }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full animate-pulse"></div>
              
              {/* Progress indicator */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md border-2 border-[#583B1F] transition-all duration-500">
                {isPlaying && (
                  <div className="absolute inset-0 rounded-full bg-[#6B7B3F] animate-ping opacity-30"></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Controles de Navegação */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={paragrafoAnterior}
              disabled={paragrafoAtual === 0}
              className="group flex items-center gap-2 px-4 py-2 text-sm text-[#583B1F] 
                         border-2 border-[#E8E6E2] rounded-lg hover:bg-[#F8F5F0] hover:border-[#A57C3A]
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:bg-transparent disabled:hover:border-[#E8E6E2]
                         focus:outline-none focus:ring-2 focus:ring-[#A57C3A] focus:ring-offset-2
                         min-h-[40px] transform hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4 transition-all duration-300 group-hover:-translate-x-1 group-active:scale-90" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Anterior</span>
            </button>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-white/70 rounded-lg border border-[#E8E6E2] backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
              <input
                type="checkbox"
                id="modo-navegacao"
                checked={modoNavegacao === 'paragrafo'}
                onChange={(e) => setModoNavegacao(e.target.checked ? 'paragrafo' : 'continuo')}
                disabled={isPlaying}
                className="w-4 h-4 rounded border-2 border-[#A57C3A] text-[#A57C3A] focus:ring-[#A57C3A] focus:ring-offset-1 disabled:opacity-50 transition-all duration-300"
              />
              <label 
                htmlFor="modo-navegacao" 
                className="text-sm font-medium text-[#7D6E63] cursor-pointer select-none transition-colors duration-300 hover:text-[#583B1F]"
              >
                Modo parágrafo
              </label>
            </div>
            
            <button
              onClick={proximoParagrafo}
              disabled={paragrafoAtual >= totalParagrafos - 1}
              className="group flex items-center gap-2 px-4 py-2 text-sm text-[#583B1F] 
                         border-2 border-[#E8E6E2] rounded-lg hover:bg-[#F8F5F0] hover:border-[#A57C3A]
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:bg-transparent disabled:hover:border-[#E8E6E2]
                         focus:outline-none focus:ring-2 focus:ring-[#A57C3A] focus:ring-offset-2
                         min-h-[40px] transform hover:scale-105 active:scale-95"
            >
              <span className="font-medium">Próximo</span>
              <svg className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-active:scale-90" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}      {/* Preview do Parágrafo Atual */}
      {textoAtual && (
        <div className="mb-5 p-4 bg-gradient-to-r from-white/90 to-[#F8F5F0]/80 border border-[#C19A6B]/20 rounded-lg shadow-sm hover:shadow-md transition-all duration-500 animate-in slide-in-from-top-3">
          <h4 className="text-sm font-medium text-[#583B1F] mb-2 flex items-center gap-2 transition-colors duration-300">
            <svg className={`w-4 h-4 transition-all duration-500 ${isPlaying ? 'text-[#6B7B3F] animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="transition-all duration-300">
              {isPlaying && !isPaused ? '🔊 Reproduzindo agora:' : 'Parágrafo atual:'}
            </span>
          </h4>
          <p className="text-sm text-[#7D6E63] leading-relaxed line-clamp-3 transition-all duration-500 hover:text-[#583B1F]">
            {textoAtual.substring(0, 200)}{textoAtual.length > 200 ? '...' : ''}
          </p>
          
          {/* Indicador visual de leitura */}
          {isPlaying && !isPaused && (
            <div className="mt-3 pt-3 border-t border-[#E8E6E2]">
              <div className="flex items-center gap-2 text-xs text-[#6B7B3F]">
                <div className="w-2 h-2 bg-[#6B7B3F] rounded-full animate-pulse"></div>
                <span className="font-medium animate-in fade-in duration-1000">
                  Este parágrafo está sendo reproduzido
                </span>
              </div>
            </div>
          )}
        </div>
      )}      {/* Configurações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="group">
          <label className="block text-sm font-medium text-[#7D6E63] mb-2 transition-colors duration-300 group-hover:text-[#583B1F]">
            🌐 Idioma/Voz:
          </label>
          <select
            value={vozSelecionada}
            onChange={(e) => setVozSelecionada(e.target.value)}
            disabled={isPlaying}
            className="w-full px-3 py-2 border border-[#E8E6E2] rounded-md 
                       bg-white text-[#583B1F] focus:border-[#6B7B3F] 
                       focus:ring-2 focus:ring-[#6B7B3F]/20 outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 hover:border-[#A57C3A]
                       hover:shadow-sm"
          >
            <option value="pt-BR">🇧🇷 Português (Brasil)</option>
            <option value="pt-PT">🇵🇹 Português (Portugal)</option>
            <option value="en-US">🇺🇸 English (US)</option>
            <option value="en-GB">🇬🇧 English (UK)</option>
            <option value="es-ES">🇪🇸 Español (España)</option>
            <option value="es-MX">🇲🇽 Español (México)</option>
            <option value="fr-FR">🇫🇷 Français</option>
            <option value="it-IT">🇮🇹 Italiano</option>
            <option value="de-DE">🇩🇪 Deutsch</option>
          </select>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-[#7D6E63] mb-2 transition-colors duration-300 group-hover:text-[#583B1F]">
            ⚡ Velocidade: <span className="text-[#6B7B3F] font-semibold">{velocidade}x</span>
          </label>
          <div className="relative">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={velocidade}
              onChange={(e) => setVelocidade(parseFloat(e.target.value))}
              disabled={isPlaying}
              className="w-full h-2 bg-[#E8E6E2] rounded-lg appearance-none cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:shadow-sm transition-shadow duration-300"
              style={{
                background: `linear-gradient(to right, #6B7B3F 0%, #6B7B3F ${((velocidade - 0.5) / 1.5) * 100}%, #E8E6E2 ${((velocidade - 0.5) / 1.5) * 100}%, #E8E6E2 100%)`
              }}
            />
            {/* Thumb indicator */}
            <div 
              className="absolute top-1/2 w-4 h-4 bg-white border-2 border-[#6B7B3F] rounded-full transform -translate-y-1/2 pointer-events-none shadow-sm transition-all duration-300"
              style={{ left: `calc(${((velocidade - 0.5) / 1.5) * 100}% - 8px)` }}
            >
              <div className="absolute inset-0 rounded-full bg-[#6B7B3F]/20 animate-ping"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-[#7D6E63] mt-1">
            <span className="flex items-center gap-1">🐌 Lento</span>
            <span className="flex items-center gap-1">🚶 Normal</span>
            <span className="flex items-center gap-1">🏃 Rápido</span>
          </div>
        </div>
      </div>{/* Status da leitura */}
      {isPlaying && (
        <div className="mt-4 p-3 bg-gradient-to-r from-[#6B7B3F]/10 to-[#A57C3A]/10 rounded-lg border border-[#6B7B3F]/20 animate-in slide-in-from-bottom-5 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                isPaused 
                  ? 'bg-[#A57C3A] animate-pulse' 
                  : 'bg-[#6B7B3F] animate-ping'
              }`}>
                {!isPaused && (
                  <div className="absolute w-2 h-2 rounded-full bg-[#6B7B3F] animate-pulse opacity-70"></div>
                )}
              </div>
              <span className={`text-sm font-medium transition-all duration-300 ${
                isPaused ? 'text-[#A57C3A]' : 'text-[#6B7B3F]'
              }`}>
                {isPaused ? (
                  <span className="flex items-center gap-1">
                    ⏸️ Pausado
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    🔊 Reproduzindo...
                  </span>
                )}
              </span>
            </div>
            <div className="text-xs text-[#7D6E63] font-medium">
              <span className="inline-block animate-in fade-in duration-700">
                {Math.round(progresso)}% concluído
              </span>
            </div>
          </div>
          <p className="text-xs text-[#7D6E63] mt-1 transition-opacity duration-500 opacity-80 hover:opacity-100">
            🌐 Idioma: {vozSelecionada} • ⚡ Velocidade: {velocidade}x • 
            📖 Modo: {modoNavegacao === 'continuo' ? 'Contínuo' : 'Por parágrafo'}
          </p>
        </div>
      )}{/* Informação sobre o recurso */}
      <div className="mt-4 p-3 bg-white/50 rounded-lg border border-[#E8E6E2]">
        <div className="flex items-start gap-2">
          <svg className="w-4 h-4 text-[#C19A6B] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-xs text-[#7D6E63] leading-relaxed">
              Esta funcionalidade usa a tecnologia de síntese de voz do seu navegador. 
              {totalParagrafos > 0 && (
                <> O artigo foi dividido em {totalParagrafos} parágrafos para melhor navegação.</>
              )}
              {' '}A qualidade e as vozes disponíveis podem variar conforme o dispositivo e sistema operacional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
