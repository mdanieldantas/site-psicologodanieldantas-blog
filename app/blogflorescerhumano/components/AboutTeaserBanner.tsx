import React from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Componente de Banner para a seção "Sobre" da página inicial
 * Exibe uma introdução breve sobre a história/missão do blog e direciona para a página completa
 */
const AboutTeaserBanner = () => {
  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-br from-[#F8F5F0] to-[#F8F5F0]/80">
      {/* Elementos decorativos de fundo */}
      <div className="absolute left-0 top-0 w-64 h-64 bg-[#C19A6B]/5 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#583B1F]/5 rounded-full filter blur-3xl translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4">
        {/* Container principal */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-[#C19A6B]/10 max-w-5xl mx-auto">
          {/* Elemento decorativo - linha orgânica */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C19A6B] to-transparent"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Coluna de imagem/ilustração */}
            <div className="w-full md:w-2/5 relative">
              <div className="relative w-full aspect-square max-w-xs mx-auto">
                {/* Forma orgânica no fundo da imagem */}
                <div className="absolute inset-0 rounded-[40%_60%_60%_40%/40%_50%_50%_60%] bg-gradient-to-br from-[#C19A6B]/20 to-[#583B1F]/10 animate-[breathe_8s_ease-in-out_infinite_alternate] shadow-inner"></div>
                
                {/* Imagem principal */}
                <div className="absolute inset-4 overflow-hidden rounded-[40%_60%_50%_50%/45%_45%_55%_55%] border border-[#C19A6B]/20 shadow-lg">
                  <div className="relative w-full h-full">
                    <Image
                      src="/blogflorescerhumano/banners-blog/sobre-banner-image.png"
                      alt="Nossa História"
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 80vw, 300px"
                    />
                  </div>
                </div>
                
                {/* Elementos decorativos - pequenas folhas e formas */}
                <div className="absolute -top-4 -right-2 rotate-45">
                  <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50,10 C70,25 90,40 70,65 C50,90 30,75 20,60 C10,45 30,30 50,10 Z" 
                         fill="none" stroke="#C19A6B" strokeWidth="1.5" opacity="0.6" />
                  </svg>
                </div>
                
                <div className="absolute -bottom-3 -left-2">
                  <svg width="25" height="25" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="10" fill="#C19A6B" opacity="0.4" />
                    <path d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z" fill="#C19A6B" opacity="0.3" transform="rotate(0 50 50)" />
                    <path d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z" fill="#C19A6B" opacity="0.3" transform="rotate(72 50 50)" />
                    <path d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z" fill="#C19A6B" opacity="0.3" transform="rotate(144 50 50)" />
                    <path d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z" fill="#C19A6B" opacity="0.3" transform="rotate(216 50 50)" />
                    <path d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z" fill="#C19A6B" opacity="0.3" transform="rotate(288 50 50)" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Coluna de texto */}
            <div className="w-full md:w-3/5 text-left">
              <h2 className="text-3xl md:text-4xl text-[#583B1F] font-normal mb-3 font-['Old Roman'] relative inline-block">
                Nossa História
                <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-[#C19A6B] rounded-full"></span>
              </h2>
              
              <p className="text-base md:text-lg text-[#583B1F]/80 mb-6 leading-relaxed">
                O Florescer Humano nasceu da minha paixão pela psicologia humanista e pelo potencial de crescimento inerente a cada pessoa. 
                Ao longo dos anos, tenho dedicado minha jornada profissional a compreender os processos que nos levam ao autoconhecimento 
                e desenvolvimento pessoal genuíno.
              </p>
              
              <p className="text-base md:text-lg text-[#583B1F]/80 mb-8 leading-relaxed">
                Conheça mais sobre minha trajetória, valores e a filosofia que fundamenta este espaço de reflexão e crescimento pessoal.
              </p>
              
              {/* CTA Button */}
              <Link
                href="/blogflorescerhumano/sobre"
                className="inline-flex items-center px-6 py-3 bg-[#583B1F] text-white rounded-md hover:bg-[#735B43] transition-all duration-300 transform hover:scale-105 shadow-md group"
              >
                Conheça Nossa História
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeaserBanner;
