"use client";

// app/blogflorescerhumano/contato/page.tsx
import React from 'react';
import Link from 'next/link';
// import Image from 'next/image'; // Não usado diretamente, BannerImage é usado.
import { Mail, MapPin, Facebook, Instagram, Youtube, Home, ChevronRight } from 'lucide-react';
import BannerImage from '../components/BannerImage';

export default function ContatoPage() {

  const contactInfo = {
    phone: "+55 (85) 98601-3431",
    email: "contatomarcosdgomes@gmail.com",
    address: "Brazil, Fortaleza-CE",
    facebookUrl: "https://www.facebook.com/psicologodanieldantas",
    instagramUrl: "https://www.instagram.com/psidanieldantas",
    youtubeUrl: "https://www.youtube.com/@PsicologoDanielDantas", // Corrigido para um link de YouTube mais provável
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Banner Section - MODELO ADAPTADO */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-[#F8F5F0]">
        {/* Mobile: Banner tradicional */}
        <div className="md:hidden relative h-full">
          <BannerImage
            bannerPath="/blogflorescerhumano/banners-blog/banner-contato.webp"
            fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
            alt="Banner da página de contato do Blog Florescer Humano"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/80 via-[#583B1F]/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
              <div className="w-16 h-1 bg-[#A57C3A] mx-auto mb-6 rounded-full shadow-md"></div>
              <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg font-serif">
                Entre em Contato
              </h1>
              <p className="text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md font-sans">
                Tem dúvidas, sugestões ou gostaria de propor uma parceria? Adoraríamos ouvir você!
              </p>
              <div className="w-16 h-1 bg-[#A57C3A] mx-auto mt-6 rounded-full shadow-md"></div>
            </div>
          </div>
        </div>

        {/* Desktop: Split layout aprimorado */}
        <div className="hidden md:flex h-full">
          {/* Lado esquerdo: Conteúdo com elementos decorativos */}
          <div className="w-1/2 bg-gradient-to-br from-[#583B1F] via-[#5B3E22] to-[#583B1F] flex flex-col justify-center px-8 lg:px-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-[#A57C3A] blur-xl"></div>
              <div className="absolute bottom-8 right-8 w-32 h-32 rounded-full bg-[#6B7B3F] blur-2xl"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-[#A57C3A] blur-lg"></div>
            </div>
            <div className="relative z-10 animate-in fade-in slide-in-from-left-6 duration-1000">
              <div className="flex items-center mb-6">
                <div className="w-12 h-1 bg-[#A57C3A] rounded-full shadow-lg"></div>
                <div className="w-2 h-2 bg-[#A57C3A] rounded-full mx-3 shadow-lg"></div>
                <div className="w-8 h-1 bg-[#A57C3A]/60 rounded-full shadow-lg"></div>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 font-serif leading-tight">
                Entre em Contato
              </h1>
              <p className="text-lg lg:text-xl text-white/90 leading-relaxed font-sans mb-8 max-w-md">
                Tem dúvidas, sugestões ou gostaria de propor uma parceria? Adoraríamos ouvir você!
              </p>
              <div className="flex items-center mt-8">
                <div className="w-8 h-1 bg-[#A57C3A]/60 rounded-full shadow-lg"></div>
                <div className="w-2 h-2 bg-[#A57C3A] rounded-full mx-3 shadow-lg"></div>
                <div className="w-12 h-1 bg-[#A57C3A] rounded-full shadow-lg"></div>
              </div>
            </div>
          </div>

          {/* Lado direito: Imagem com moldura elegante */}
          <div className="w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#A57C3A]/20 via-transparent to-[#6B7B3F]/20 z-10 pointer-events-none"></div>
            <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-[#A57C3A]/30 rounded-lg z-10 pointer-events-none"></div>
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-[#A57C3A] rounded-tl-lg z-20"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-[#A57C3A] rounded-tr-lg z-20"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-[#A57C3A] rounded-bl-lg z-20"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-[#A57C3A] rounded-br-lg z-20"></div>
            <BannerImage
              bannerPath="/blogflorescerhumano/banners-blog/banner-contato.webp"
              fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
              alt="Banner da página de contato do Blog Florescer Humano"
              // Removida a className explícita para teste, o modelo original do BannerImage na direita tinha classes de animação
              // Se BannerImage tiver classes padrão ou internas para animação, elas serão usadas.
              // Se as animações da imagem da direita sumirem, podemos reintroduzir a className:
              // className="animate-in fade-in slide-in-from-right-6 duration-1000 delay-300 hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/5 via-transparent to-[#583B1F]/5"></div>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#C19A6B]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link
                href="/"
                className="flex items-center text-[#5A4632] hover:text-[#6B5139] transition-colors duration-200"
              >
                <Home className="h-4 w-4 mr-1" />
                Início
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-[#5A4632]/60" />
            <li>
              <Link
                href="/blogflorescerhumano"
                className="text-[#5A4632] hover:text-[#6B5139] transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-[#5A4632]/60" />
            <li className="text-[#583B1F] font-medium">
              Contato
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 pb-12">
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#C19A6B]/20">
            <h2 className="text-2xl md:text-3xl font-['Old_Roman'] mb-4 md:mb-6 text-[#583B1F] border-b border-[#C19A6B]/20 pb-3">Fale Conosco</h2>
            <p className="text-[#5A4632] mb-6 md:mb-8 text-sm md:text-base">
              Tem alguma dúvida, sugestão, ou gostaria de propor uma parceria?
              Envie um e-mail para o endereço abaixo que entraremos em contato o mais breve possível.
            </p>

            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[#583B1F]">Informações de Contato</h3>
            <ul className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              <li className="flex items-start">
                <div className="bg-[#C19A6B] p-1.5 md:p-2 rounded-full mr-3 md:mr-4 mt-1 flex-shrink-0">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <span className="block font-medium text-[#583B1F] mb-1 text-sm md:text-base">E-mail</span>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-[#5A4632] hover:text-[#6B5139] transition-colors text-xs md:text-sm break-all"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-[#C19A6B] p-1.5 md:p-2 rounded-full mr-3 md:mr-4 mt-1 flex-shrink-0">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <span className="block font-medium text-[#583B1F] mb-1 text-sm md:text-base">Endereço</span>
                  <p className="text-[#5A4632] text-xs md:text-sm">{contactInfo.address}</p>
                </div>
              </li>
            </ul>

            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[#583B1F]">Redes Sociais</h3>
            <div className="flex space-x-3 md:space-x-4">
              <Link
                href={contactInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#583B1F] w-9 h-9 md:w-11 md:h-11 rounded-full hover:bg-[#735B43] transition-colors shadow-md flex items-center justify-center"
              >
                <Facebook className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </Link>
              <Link
                href={contactInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#583B1F] w-9 h-9 md:w-11 md:h-11 rounded-full hover:bg-[#735B43] transition-colors shadow-md flex items-center justify-center"
              >
                <Instagram className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </Link>
              <Link
                href={contactInfo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#583B1F] w-9 h-9 md:w-11 md:h-11 rounded-full hover:bg-[#735B43] transition-colors shadow-md flex items-center justify-center"
              >
                <Youtube className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



// "use client";

// // app/blogflorescerhumano/contato/page.tsx
// import React, { useState, useEffect } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Mail, MapPin, Facebook, Instagram, Youtube, Home, ChevronRight } from 'lucide-react';
// import BannerImage from '../components/BannerImage';

// export default function ContatoPage() {
  
//   // Informações de contato
//   const contactInfo = {
//     phone: "+55 (85) 98601-3431",
//     email: "contatomarcosdgomes@gmail.com",
//     address: "Brazil, Fortaleza-CE",
//     facebookUrl: "https://www.facebook.com/psicologodanieldantas",
//     instagramUrl: "https://www.instagram.com/psidanieldantas",
//     youtubeUrl: "https://www.youtube.com/@psidanieldantas",
//   };
//     return (
//     <div className="min-h-screen bg-[#F8F5F0]">
//       {/* Hero Banner Section */}      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-[#583B1F]">
//         <BannerImage 
//           bannerPath="/blogflorescerhumano/banners-blog/banner-contato.webp"
//           fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
//           alt="Banner da página de contato do Blog Florescer Humano"
//           className="brightness-75 z-0"
//         />
//         {/* Hero Content Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/70 via-transparent to-transparent z-10" />
//         <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-20">
//           <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg font-['Old_Roman']">
//               Entre em Contato
//             </h1>
//             <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
//               Tem dúvidas, sugestões ou gostaria de propor uma parceria? Adoraríamos ouvir você!
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* Breadcrumb Navigation */}
//       <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#C19A6B]/20 sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-3">
//           <ol className="flex items-center space-x-2 text-sm">
//             <li>
//               <Link 
//                 href="/" 
//                 className="flex items-center text-[#5A4632] hover:text-[#6B5139] transition-colors duration-200"
//               >
//                 <Home className="h-4 w-4 mr-1" />                Início
//               </Link>            </li>
//             <ChevronRight className="h-4 w-4 text-[#5A4632]/60" />
//             <li>
//               <Link 
//                 href="/blogflorescerhumano" 
//                 className="text-[#5A4632] hover:text-[#6B5139] transition-colors duration-200"
//               >                Blog
//               </Link>            </li>
//             <ChevronRight className="h-4 w-4 text-[#5A4632]/60" />
//             <li className="text-[#583B1F] font-medium">
//               Contato
//             </li>
//           </ol>
//         </div>
//       </nav>      {/* Main Content */}
//       <main className="container mx-auto px-4 pt-8 pb-12">
//         {/* Grid de cards com espaçamento uniforme */}        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
//           {/* Apenas as Informações de Contato */}
//           <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#C19A6B]/20">
//             <h2 className="text-2xl md:text-3xl font-['Old_Roman'] mb-4 md:mb-6 text-[#583B1F] border-b border-[#C19A6B]/20 pb-3">Fale Conosco</h2>
//             <p className="text-[#5A4632] mb-6 md:mb-8 text-sm md:text-base">
//               Tem alguma dúvida, sugestão, ou gostaria de propor uma parceria?
//               Envie um e-mail para o endereço abaixo que entraremos em contato o mais breve possível.
//             </p>

//             <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[#583B1F]">Informações de Contato</h3>
//             <ul className="space-y-4 md:space-y-6 mb-6 md:mb-8">
//               <li className="flex items-start">
//                 <div className="bg-[#C19A6B] p-1.5 md:p-2 rounded-full mr-3 md:mr-4 mt-1 flex-shrink-0">
//                   <Mail className="h-4 w-4 md:h-5 md:w-5 text-white" />
//                 </div>
//                 <div>
//                   <span className="block font-medium text-[#583B1F] mb-1 text-sm md:text-base">E-mail</span>
//                   <a
//                     href={`mailto:${contactInfo.email}`}
//                     className="text-[#5A4632] hover:text-[#6B5139] transition-colors text-xs md:text-sm break-all"
//                   >
//                     {contactInfo.email}
//                   </a>
//                 </div>
//               </li>
//               <li className="flex items-start">
//                 <div className="bg-[#C19A6B] p-1.5 md:p-2 rounded-full mr-3 md:mr-4 mt-1 flex-shrink-0">
//                   <MapPin className="h-4 w-4 md:h-5 md:w-5 text-white" />
//                 </div>
//                 <div>
//                   <span className="block font-medium text-[#583B1F] mb-1 text-sm md:text-base">Endereço</span>
//                   <p className="text-[#5A4632] text-xs md:text-sm">{contactInfo.address}</p>
//                 </div>
//               </li>
//             </ul>
            
//             <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[#583B1F]">Redes Sociais</h3>
//             <div className="flex space-x-3 md:space-x-4">              <Link
//                 href={contactInfo.facebookUrl}                target="_blank" 
//                 rel="noopener noreferrer"
//                 className="bg-[#583B1F] w-9 h-9 md:w-11 md:h-11 rounded-full hover:bg-[#735B43] transition-colors shadow-md flex items-center justify-center"
//               >
//                 <Facebook className="h-4 w-4 md:h-5 md:w-5 text-white" />
//               </Link>              <Link
//                 href={contactInfo.instagramUrl}                target="_blank" 
//                 rel="noopener noreferrer"
//                 className="bg-[#583B1F] w-9 h-9 md:w-11 md:h-11 rounded-full hover:bg-[#735B43] transition-colors shadow-md flex items-center justify-center"
//               >
//                 <Instagram className="h-4 w-4 md:h-5 md:w-5 text-white" />
//               </Link>              <Link
//                 href={contactInfo.youtubeUrl}                target="_blank" 
//                 rel="noopener noreferrer"
//                 className="bg-[#583B1F] w-9 h-9 md:w-11 md:h-11 rounded-full hover:bg-[#735B43] transition-colors shadow-md flex items-center justify-center"
//               >
//                 <Youtube className="h-4 w-4 md:h-5 md:w-5 text-white" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
