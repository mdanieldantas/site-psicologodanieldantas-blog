import Image from "next/image";
import { ChevronDown } from "lucide-react";
import React from "react";
import { useWhatsAppModal } from "../whatsapp-modal-context";

// Componente HeroSection: A primeira seção visível da página
// Usamos forwardRef para permitir que o componente pai passe uma ref para o elemento <section>
const HeroSection = React.forwardRef<HTMLElement>((props, ref) => {
  const { openModal } = useWhatsAppModal();
  return (
    <section ref={ref} id="inicio" className="relative min-h-screen flex items-center pt-24">
      {/* Imagem de fundo com opacidade condicional */}
      {/* Aplicado opacity-20 por padrão (mobile) e md:opacity-30 para telas maiores */}
      <div className="absolute inset-0 z-0 opacity-20 md:opacity-30">
        <Image src="/hero-sofa.png" alt="Sofá de terapia" fill priority className="object-cover" />
      </div>
      {/* Overlay Gradiente (Mobile-Only) - Menos forte */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/30 via-black/10 to-transparent md:bg-none"></div>

      {/* Conteúdo principal da seção Hero (mantém z-[5]) */}
      <div className="relative z-[5] container mx-auto px-[15%] pt-25 ">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">Psicólogo Daniel Dantas</h1>
          <p className="text-xl text-[#735B43] border-b border-[#583B1F] pb-12 mb-12 max-w-[70vh]">
            Psicólogo Clínico Online - Criando um espaço de acolhimento e transformação para sua jornada de
            autoconhecimento, onde quer que você esteja.
          </p>
          {/* Botão de chamada para ação */}
          <button
            type="button"
            onClick={openModal}
            className="mt-8 px-8 py-3 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md inline-block"
          >
            Vamos conversar?
          </button>
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
