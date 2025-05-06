import Image from "next/image";
import { ChevronDown } from "lucide-react";
import React from "react";
import { useWhatsAppModal } from "../whatsapp-modal-context";

// Componente HeroSection: A primeira seção visível da página
// Usamos forwardRef para permitir que o componente pai passe uma ref para o elemento <section>
const HeroSection = React.forwardRef<HTMLElement>((props, ref) => {
  const { openModal } = useWhatsAppModal();
  return (
    <section ref={ref} id="inicio" className="relative min-h-screen flex items-center pt-24">      {/* Imagem de fundo com opacidade condicional */}
      {/* Aplicado opacity-20 por padrão (mobile) e md:opacity-30 para telas maiores */}
      <div className="absolute inset-0 z-0 opacity-20 md:opacity-30">
        <Image src="/hero-sofa.png" alt="Sofá de terapia" fill priority className="object-cover" />
      </div>
        {/* Conteúdo principal da seção Hero (mantém z-[5]) */}
      <div className="relative z-[5] container mx-auto px-[5%] md:px-[10%] pt-25">
        {/* Layout flexível: coluna em mobile, linha em desktop */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
          {/* Coluna da imagem - visível sempre, primeiro em mobile e segundo em desktop */}
          <div className="w-full lg:w-auto flex justify-center order-1 lg:order-2">
            <div className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px] rounded-full overflow-hidden border-4 border-[#C19A6B] shadow-xl">
              <Image 
                src="/hero-daniel-psi-2.jpg"
                alt="Psicólogo Daniel Dantas"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 280px, 350px"
              />
            </div>
          </div>
          {/* Coluna do texto - segundo em mobile e primeiro em desktop */}
          <div className="lg:max-w-[55%] order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">Psicólogo Daniel Dantas</h1>
            <p className="text-xl text-[#735B43] border-b border-[#583B1F] pb-6 mb-6 md:pb-12 md:mb-12">
              Psicólogo Clínico Online - Criando um espaço de acolhimento e transformação para sua jornada de
              autoconhecimento, onde quer que você esteja.
            </p>
            {/* Botão de chamada para ação */}
            <button
              type="button"
              onClick={openModal}
              className="mt-4 md:mt-8 px-8 py-3 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md inline-block"
            >
              Vamos conversar?
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
