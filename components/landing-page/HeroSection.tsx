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
  return (
    <section ref={ref} id="inicio" className="relative min-h-screen flex items-center pt-10 md:pt-12">      {/* Imagem de fundo com opacidade média para equilíbrio visual */}
      {/* Aplicado opacity-30 por padrão (mobile) e md:opacity-35 para telas maiores */}
      <div className="absolute inset-0 z-0 opacity-30 md:opacity-35">
        <Image 
          src="/hero-sofa.png" 
          alt="Sofá de terapia" 
          fill 
          priority 
          className="object-cover transition-transform duration-[4000ms] ease-in-out transform scale-[1.02]" 
        />
      </div>
      
      {/* Overlay equilibrado - valor intermediário para melhor harmonia */}
      <div className="absolute inset-0 bg-[#F8F5F0]/40 z-[1]"></div>
        {/* Conteúdo principal da seção Hero (mantém z-[5]) */}
      <div className="relative z-[5] container mx-auto px-[5%] md:px-[10%] pt-25">
        {/* Layout flexível: coluna em mobile, linha em desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">          {/* Coluna da imagem - visível sempre, primeiro em mobile e segundo em desktop */}
          <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
            <div className="relative group">
              {/* Container principal com animação e efeitos */}
              <div className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full border-4 border-[#C19A6B] shadow-xl 
                  relative z-10 overflow-hidden transition-all duration-500 
                  hover:shadow-2xl hover:scale-[1.02] hover:border-[#D1AA7B]">
                
                {/* Avatar do Radix UI para melhor gerenciamento de imagem */}
                <AvatarPrimitive.Root className="w-full h-full relative">
                  <AvatarPrimitive.Image 
                    src="/hero-daniel-psi-2.jpg"
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
              
              {/* Elemento decorativo de fundo */}
              <div className="absolute -bottom-3 -right-3 w-[280px] h-[280px] md:w-[350px] md:h-[350px] 
                  rounded-full border-2 border-[#C19A6B]/30 z-0 
                  transition-all duration-500 group-hover:scale-[1.1]"></div>
            </div>
          </div>          {/* Coluna do texto - segundo em mobile e primeiro em desktop */}          <div className="lg:max-w-[55%] order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">
              <span className="text-[#583B1F] block">Psicólogo</span>
              <span className="text-[#583B1F] font-medium">Daniel Dantas</span>
            </h1>
            
            <p className="text-xl text-[#735B43] border-b border-[#583B1F] pb-6 mb-6 md:pb-12 md:mb-12">
              Psicólogo Clínico Online - Criando um espaço de acolhimento e transformação para sua jornada de
              autoconhecimento, onde quer que você esteja.
            </p>
            
            {/* Botão de chamada para ação */}
            <button
              type="button"
              onClick={openModal}
              className="mt-4 md:mt-8 px-8 py-3 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] group 
                relative overflow-hidden rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span className="relative z-10 inline-flex items-center transition-transform duration-300 group-hover:scale-110">
                Vamos conversar? <Heart className="ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100 scale-0 group-hover:scale-100" />
              </span>
              <span className="absolute inset-0 bg-[#735B43] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </button>
          </div>
        </div>
      </div>
      {/* Ícone de seta para baixo indicando scroll */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-[5]">
        <a href="#sobre" className="text-[#583B1F] animate-bounce">
          <ChevronDown size={32} />
        </a>
      </div>
    </section>
  );
});

// Define um nome de exibição para o componente para facilitar a depuração
HeroSection.displayName = "HeroSection";

export default HeroSection;
