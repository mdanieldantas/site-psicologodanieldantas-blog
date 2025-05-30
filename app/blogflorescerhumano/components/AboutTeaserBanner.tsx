import React from "react";
import Link from "next/link";
import ButtonBlog from "./ButtonBlog";

/**
 * Componente de Banner para a seção "Sobre" da página inicial
 * Exibe uma introdução breve sobre a história/missão do blog e direciona para a página completa
 */
const AboutTeaserBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-[#F8F5F0] to-[#F8F5F0]/80">
      <div className="container mx-auto px-2 sm:px-4 max-w-[1440px]">
        {/* Container principal */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 lg:p-16 xl:p-20 shadow-xl border border-[#A57C3A]/10 w-full mx-auto relative">
          {/* Linha decorativa superior */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#A57C3A] to-transparent"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-6">
            {/* Coluna de imagem */}
            <div className="w-full md:w-1/2 lg:w-1/2">
              <div className="bg-[#F8F5F0] p-4 md:p-6 lg:p-8 xl:p-10 rounded-xl shadow-xl mx-auto flex items-center justify-center">
                {/* Imagem do Autor */}
                <img
                  src="/blogflorescerhumano/autores/autores-aquarela-daniel.webp"
                  alt="Daniel Dantas - Psicólogo"
                  className="w-full h-auto object-contain scale-110 transform"
                  loading="eager"
                />
              </div>
            </div>

            {/* Coluna de texto */}
            <div className="w-full md:w-1/2 lg:w-1/2 text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-[#583B1F] font-normal mb-4 lg:mb-6 font-[&quot;Old Roman&quot;] relative inline-block">
                Nossa História
                <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#A57C3A] rounded-full"></span>
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-[#583B1F]/80 mb-6 lg:mb-8 leading-relaxed">
                O Florescer Humano nasceu da minha paixão pela psicologia humanista
                e pelo potencial de crescimento inerente a cada pessoa. Ao longo dos
                anos, tenho dedicado minha jornada profissional a compreender os
                processos que nos levam ao autoconhecimento e desenvolvimento
                pessoal genuíno.
              </p>

              <p className="text-base md:text-lg lg:text-xl text-[#583B1F]/80 mb-8 lg:mb-10 leading-relaxed">
                Conheça mais sobre minha trajetória, valores e a filosofia que
                fundamenta este espaço de reflexão e crescimento pessoal.
              </p>              {/* CTA Button */}
              <Link href="/blogflorescerhumano/sobre">
                <ButtonBlog
                  variant="primary"
                  className="inline-flex items-center text-lg lg:text-xl group"
                >
                  Conheça Nossa História
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 lg:h-7 lg:w-7 ml-3 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </ButtonBlog>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaserBanner;
