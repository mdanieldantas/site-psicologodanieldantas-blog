import Image from "next/image";
import { ChevronDown, Heart } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useWhatsAppModal } from "../whatsapp-modal-context";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

// Componente HeroSection: A primeira seção visível da página
// Usamos forwardRef para permitir que o componente pai passe uma ref para o elemento <section>
const HeroSection = React.forwardRef<HTMLElement>((props, ref) => {
  const { openModal } = useWhatsAppModal();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Definir um pequeno atraso para iniciar a animação após o carregamento
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section ref={ref} id="inicio" className="relative min-h-screen flex items-center pt-4 md:pt-6 pb-12 md:pb-0 overflow-hidden">
      {/* Imagem de fundo com opacidade média para equilíbrio visual */}
      {/* Aplicado opacity-30 por padrão (mobile) e md:opacity-35 para telas maiores */}
      <div className="absolute inset-0 z-0 opacity-30 md:opacity-35">
        <Image 
          src="/hero-sofa.png" 
          alt="Sofá de terapia" 
          fill 
          priority 
          className="object-cover transition-transform duration-[4000ms] ease-in-out transform scale-[1.02] filter brightness-[0.95] contrast-[1.05]" 
        />
      </div>
      
      {/* Overlay equilibrado - valor intermediário para melhor harmonia */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F8F5F0]/60 to-[#F8F5F0]/40 z-[1]"></div>
      
      {/* Conteúdo principal da seção Hero (mantém z-[5]) */}
      <div className="relative z-[5] container mx-auto px-4 sm:px-[5%] md:px-[10%] pt-10 md:pt-14 w-full">
        {/* Layout flexível: coluna em mobile, linha em desktop */}        {/* Layout flexível: coluna em mobile, linha em desktop */}
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12 
          ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
          
          {/* Coluna da imagem - visível sempre, primeiro em mobile e segundo em desktop */}
          <div className={`w-full lg:w-auto flex justify-center order-1 lg:order-2 mt-4 md:mt-8
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} 
            transition-all duration-1000 delay-300`}>
            <div className="relative group">
              {/* Container principal com animação e efeitos */}              <div className="w-[260px] h-[260px] md:w-[350px] md:h-[350px] rounded-full border-4 border-[#C19A6B] shadow-xl 
                  relative z-10 overflow-hidden transition-all duration-500 
                  hover:shadow-2xl hover:scale-[1.02] hover:border-[#D1AA7B]">
                
                {/* Avatar do Radix UI para melhor gerenciamento de imagem */}
                <AvatarPrimitive.Root className="w-full h-full relative">
                  <AvatarPrimitive.Image 
                    src="/hero-daniel-psi-2.webp"
                    alt="Psicólogo Daniel Dantas"
                    className="object-cover w-full h-full"
                  />
                  <AvatarPrimitive.Fallback 
                    className="flex items-center justify-center w-full h-full bg-[#F5F2EE] text-[#583B1F]"
                  >
                    DD
                  </AvatarPrimitive.Fallback>
                </AvatarPrimitive.Root>
              </div>
              
              {/* Elemento decorativo de fundo */}              <div className="absolute -bottom-3 -right-3 w-[260px] h-[260px] md:w-[350px] md:h-[350px] 
                  rounded-full border-2 border-[#C19A6B]/30 z-0 
                  transition-all duration-500 group-hover:scale-[1.1]"></div>
            </div>
          </div>            {/* Coluna do texto - segundo em mobile e primeiro em desktop */}          <div className={`-mt-8 md:-mt-14 lg:mt-0 lg:max-w-[55%] order-2 lg:order-1 w-full px-1
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} 
            transition-all duration-1000 delay-100`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-3 tracking-tight relative">
              <span className="text-[#583B1F] block">Psicólogo</span>
              <span className="text-[#583B1F] font-medium">Daniel Dantas</span>
              <span className="absolute left-0 bottom-0 w-16 h-1 bg-[#C19A6B] rounded-full mt-2 transform translate-y-2"></span>
            </h1>
              <p className="text-lg md:text-xl text-[#583B1F] border-b border-[#583B1F]/30 pb-5 mb-5 md:pb-6 md:mb-6 leading-relaxed drop-shadow-sm font-light">
              Psicólogo Clínico Online - <span className="font-normal">Criando um espaço de acolhimento e transformação</span> para sua jornada de
              autoconhecimento, onde quer que você esteja.
            </p>
              {/* Elementos de credibilidade */}
            <div className={`flex flex-col md:flex-row gap-4 md:gap-8 mb-4 md:mb-5 text-[#583B1F]/90 text-sm
              ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} 
              transition-all duration-1000 delay-300`}>              <div className="flex items-center transition-all duration-500 hover:translate-x-1">
                <div className="mr-2 bg-[#C19A6B]/20 p-2 rounded-full transition-all duration-300 group-hover:bg-[#C19A6B]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#583B1F]">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                </div>
                <span>CRP: 11/11854</span>
              </div>              
              {/* <div className="flex items-center transition-all duration-500 hover:translate-x-1">
                <div className="mr-2 bg-[#C19A6B]/20 p-2 rounded-full transition-all duration-300 group-hover:bg-[#C19A6B]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#583B1F]">
                    <circle cx="12" cy="8" r="5"></circle>
                    <path d="M20 21a8 8 0 1 0-16 0"></path>
                  </svg>
                </div>
                <span>+8 anos de experiência</span>
              </div> */}

              {/* <div className="flex items-center transition-all duration-500 hover:translate-x-1">
                <div className="mr-2 bg-[#C19A6B]/20 p-2 rounded-full transition-all duration-300 group-hover:bg-[#C19A6B]/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#583B1F]">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                  </svg>
                </div>
                <span>Formação pela Unifanor Wyden </span>
              </div> */}

            </div>
            
            {/* Botão de chamada para ação aprimorado */}
            <button
              type="button"
              onClick={openModal}
              className={`mt-2 md:mt-4 mb-10 md:mb-16 px-8 py-3 font-medium bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] group 
                relative overflow-hidden rounded-md transition-all duration-300 shadow-md hover:shadow-lg
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-1000 delay-500`}
            >
              <span className="relative z-10 inline-flex items-center transition-transform duration-300 group-hover:scale-110">
                Vamos conversar? <Heart className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100 scale-0 group-hover:scale-100 animate-pulse" />
              </span>
              <span className="absolute inset-0 bg-[#735B43] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </button>
          </div>
        </div>
      </div>
        {/* Indicador de rolagem refinado - visível em todas as resoluções */}
      <div className={`absolute bottom-10 md:bottom-14 left-0 right-0 flex justify-center z-[5] 
        ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-700`}>
        <a 
          href="#sobre" 
          className="text-[#583B1F] group flex flex-col items-center"
          aria-label="Role para baixo para saber mais"
        >
          <span className="text-xs mb-1 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            Role para saber mais
          </span>
          <div className="bg-[#F8F5F0]/70 backdrop-blur-sm p-1.5 rounded-full shadow-sm animate-bounce transition-all duration-300 group-hover:shadow-md group-hover:bg-[#F8F5F0]">
            <ChevronDown size={20} />
          </div>
        </a>
      </div>
    </section>
  );
});

// Define um nome de exibição para o componente para facilitar a depuração
HeroSection.displayName = "HeroSection";

export default HeroSection;
