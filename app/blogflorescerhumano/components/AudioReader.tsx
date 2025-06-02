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
      <div className="bg-[#F8F5F0]/50 border border-[#E8E6E2] rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-[#7D6E63]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-[#7D6E63] text-sm">
            Recurso de áudio não disponível neste navegador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F0] border border-[#C19A6B]/20 rounded-lg p-6 mb-8 font-sans shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#F8F5F0] to-[#C19A6B]/10 rounded-full border-[0.5px] border-[#C19A6B]/30 shadow-sm">
          <svg className="w-4.5 h-4.5 text-[#C19A6B]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.314zM15 8.25a.75.75 0 01-.75-.75 3.5 3.5 0 000 7 .75.75 0 01.75-.75.75.75 0 000-1.5 2 2 0 000-4 .75.75 0 01.75-.75z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#583B1F]">
          Ouvir Artigo
        </h3>
      </div>      {/* Controles Principais */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <button
          onClick={lerTexto}
          disabled={!conteudo || totalParagrafos === 0}
          className="px-6 py-2.5 bg-[#583B1F] text-white rounded-lg font-medium 
                     transition-all duration-300 transform hover:scale-105 
                     hover:-translate-y-1 shadow-lg hover:shadow-xl 
                     hover:bg-[#735B43] flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
        >
          {isPlaying ? (
            isPaused ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Continuar
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pausar
              </>
            )
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Reproduzir
            </>
          )}
        </button>

        {(isPlaying || paragrafoAtual > 0) && (
          <>
            <button
              onClick={pararLeitura}
              className="px-4 py-2.5 bg-white text-[#583B1F] border border-[#583B1F] 
                         rounded-lg font-medium transition-all duration-300 transform 
                         hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl 
                         hover:bg-[#F8F5F0] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v6a1 1 0 11-2 0V7zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V7z" clipRule="evenodd" />
              </svg>
              Parar
            </button>
            
            <button
              onClick={reiniciarLeitura}
              className="px-4 py-2.5 bg-white text-[#C19A6B] border border-[#C19A6B] 
                         rounded-lg font-medium transition-all duration-300 transform 
                         hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl 
                         hover:bg-[#F8F5F0] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reiniciar
            </button>
          </>
        )}
      </div>

      {/* Barra de Progresso */}
      {totalParagrafos > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-sm text-[#7D6E63] mb-2">
            <span>Progresso</span>
            <span>{paragrafoAtual + 1} de {totalParagrafos} parágrafos</span>
          </div>
          <div className="w-full bg-[#E8E6E2] rounded-full h-2 mb-3">
            <div 
              className="bg-gradient-to-r from-[#C19A6B] to-[#583B1F] h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
          
          {/* Controles de Navegação */}
          <div className="flex items-center justify-between">
            <button
              onClick={paragrafoAnterior}
              disabled={paragrafoAtual === 0}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#583B1F] 
                         border border-[#E8E6E2] rounded-md hover:bg-[#F8F5F0] 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Anterior
            </button>
            
            <div className="flex items-center gap-3">
              <label className="text-sm text-[#7D6E63] flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={modoNavegacao === 'paragrafo'}
                  onChange={(e) => setModoNavegacao(e.target.checked ? 'paragrafo' : 'continuo')}
                  disabled={isPlaying}
                  className="rounded border-[#C19A6B] text-[#C19A6B] focus:ring-[#C19A6B]"
                />
                Modo parágrafo
              </label>
            </div>
            
            <button
              onClick={proximoParagrafo}
              disabled={paragrafoAtual >= totalParagrafos - 1}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#583B1F] 
                         border border-[#E8E6E2] rounded-md hover:bg-[#F8F5F0] 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Preview do Parágrafo Atual */}
      {textoAtual && (
        <div className="mb-5 p-4 bg-white/80 border border-[#C19A6B]/20 rounded-lg">
          <h4 className="text-sm font-medium text-[#583B1F] mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Parágrafo atual:
          </h4>
          <p className="text-sm text-[#7D6E63] leading-relaxed line-clamp-3">
            {textoAtual.substring(0, 200)}{textoAtual.length > 200 ? '...' : ''}
          </p>
        </div>
      )}

      {/* Configurações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#7D6E63] mb-2">
            Idioma/Voz:
          </label>
          <select
            value={vozSelecionada}
            onChange={(e) => setVozSelecionada(e.target.value)}
            disabled={isPlaying}
            className="w-full px-3 py-2 border border-[#E8E6E2] rounded-md 
                       bg-white text-[#583B1F] focus:border-[#C19A6B] 
                       focus:ring-1 focus:ring-[#C19A6B] outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div>
          <label className="block text-sm font-medium text-[#7D6E63] mb-2">
            Velocidade: {velocidade}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={velocidade}
            onChange={(e) => setVelocidade(parseFloat(e.target.value))}
            disabled={isPlaying}
            className="w-full h-2 bg-[#E8E6E2] rounded-lg appearance-none cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #C19A6B 0%, #C19A6B ${((velocidade - 0.5) / 1.5) * 100}%, #E8E6E2 ${((velocidade - 0.5) / 1.5) * 100}%, #E8E6E2 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-[#7D6E63] mt-1">
            <span>Lento</span>
            <span>Normal</span>
            <span>Rápido</span>
          </div>
        </div>
      </div>      {/* Status da leitura */}
      {isPlaying && (
        <div className="mt-4 p-3 bg-[#C19A6B]/10 rounded-lg border border-[#C19A6B]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#C19A6B] rounded-full animate-pulse"></div>
              <span className="text-sm text-[#583B1F] font-medium">
                {isPaused ? 'Pausado' : 'Reproduzindo...'}
              </span>
            </div>
            <div className="text-xs text-[#7D6E63]">
              {Math.round(progresso)}% concluído
            </div>
          </div>
          <p className="text-xs text-[#7D6E63] mt-1">
            Idioma: {vozSelecionada} • Velocidade: {velocidade}x • 
            Modo: {modoNavegacao === 'continuo' ? 'Contínuo' : 'Por parágrafo'}
          </p>
        </div>
      )}      {/* Informação sobre o recurso */}
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
