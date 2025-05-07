// filepath: c:\DevDriverRepo\landing-page-psiblog-vscode-insiders\components\landing-page\WorkSection.tsx
import { useWhatsAppModal } from "../whatsapp-modal-context";
import { useState, useEffect } from "react";

// Componente decorativo para separação visual
const Divider = () => (
  <div className="flex justify-center my-4">
    <div className="flex items-center space-x-1">
      <div className="h-1 w-1 rounded-full bg-[#C19A6B]"></div>
      <div className="h-1 w-3 rounded-full bg-[#C19A6B]"></div>
      <div className="h-1 w-1 rounded-full bg-[#C19A6B]"></div>
    </div>
  </div>
);

// Componente para os ícones personalizados da lista
const ListIcon = ({ type }: { type: 'discover' | 'understand' }) => (
  <div className="bg-[#C19A6B] rounded-full min-w-[28px] h-7 flex items-center justify-center mr-3 shadow-sm transition-all duration-300">
    {type === 'discover' ? (
      <span className="text-white text-xs">✦</span> // Ícone para descoberta
    ) : (
      <span className="text-white text-xs">✧</span> // Ícone para entendimento
    )}
  </div>
);

// Componente WorkSection: Apresenta o vídeo sobre o trabalho do psicólogo
const WorkSection = () => {
  const { openModal } = useWhatsAppModal();
  const [isHovered, setIsHovered] = useState(false);  return (
    <section id="trabalho" className="py-14 md:py-24 bg-[#F5F2EE]">
      <div className="container mx-auto px-6 sm:px-8 md:px-[10%]">
        {/* Título da seção com decoração */}
        <div className="mb-4 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-light pb-3 text-[#583B1F] inline-block border-b border-[#583B1F]">
            Conheça Meu Trabalho
          </h2>
          <div className="mt-4 md:mt-6">
            <h3 className="text-xl md:text-2xl text-[#735B43] font-light">Abordagem integrada e personalizada</h3>
          </div>
        </div>

        {/* Grid para layout do texto e vídeo */}
        <div className="mt-10 grid gap-10 md:grid-cols-2 items-center">          {/* Coluna de Texto e Lista */}
          <div className="md:order-1 order-1 space-y-8"> {/* Ordem no grid: texto primeiro */}
            <p className="text-[#735B43] text-base md:text-lg font-light leading-relaxed">
              Neste vídeo, compartilho minha jornada como psicólogo e apresento as abordagens terapêuticas que
              fundamentam meu trabalho: a Abordagem Centrada na Pessoa, a Focalização e o Mindfulness. Explico como
              estas técnicas se complementam para criar um processo terapêutico integrado e personalizado.
            </p>
            
            <Divider />
            
            {/* Lista de pontos chave */}
            <ul className="space-y-6 md:space-y-8">
              <li className="flex items-start group">
                <ListIcon type="discover" />
                <p className="text-[#735B43] text-base md:text-lg font-light leading-relaxed group-hover:text-[#583B1F] transition-colors duration-300">
                  Descubra como a integração de diferentes abordagens pode potencializar seu processo terapêutico.
                </p>
              </li>
              <li className="flex items-start group">
                <ListIcon type="understand" />
                <p className="text-[#735B43] text-base md:text-lg font-light leading-relaxed group-hover:text-[#583B1F] transition-colors duration-300">
                  Entenda como podemos trabalhar juntos em sua jornada de autoconhecimento e bem-estar.
                </p>
              </li>
            </ul>
            
            <Divider />            {/* Botão de CTA - Visível apenas em Desktop */}
            <button
              type="button"
              onClick={openModal}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`hidden md:inline-flex items-center px-7 py-3 text-base bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-all duration-300 rounded-md mt-2 shadow-sm hover:shadow-md ${isHovered ? 'translate-y-[-2px]' : ''}`}
            >
              <span>Vamos iniciar sua jornada terapêutica?</span>
              <svg 
                className={`ml-2 w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>          {/* Coluna do Vídeo e Botão Mobile */}
          <div className="md:order-2 order-2"> {/* Ordem no grid: vídeo depois */}
            {/* Container do vídeo com sombra */}
            <div className="relative">
              {/* Elemento decorativo no fundo */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#C19A6B] opacity-10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#C19A6B] opacity-10 rounded-full"></div>
              
              {/* Container principal do vídeo */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-xl border border-[#C19A6B]/10 relative z-10">
                {/* Título do vídeo */}
                <div className="mb-3 pb-2 border-b border-[#C19A6B]/20">
                  <p className="text-[#583B1F] font-medium text-sm">Abordagem Terapêutica • Daniel Dantas</p>
                </div>
                
                {/* Wrapper responsivo para manter a proporção do vídeo */}
                <div className="relative h-0 pb-[56.25%] rounded-lg overflow-hidden"> {/* Proporção 16:9 */}
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/8r22CAuoyPc" // URL do vídeo do YouTube
                    title="Conheça Meu Trabalho - Daniel Dantas"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>            {/* Botão de CTA - Visível apenas em Mobile */}
            <div className="mt-6 md:hidden text-center">
              <button
                type="button"
                onClick={openModal}
                className="inline-flex items-center px-5 py-2 text-sm bg-[#583B1F] text-[#F8F5F0] active:bg-[#735B43] transition-all duration-300 rounded-md shadow-sm"
              >
                <span>Iniciar jornada terapêutica</span>
                <svg 
                  className="ml-1 w-3.5 h-3.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
