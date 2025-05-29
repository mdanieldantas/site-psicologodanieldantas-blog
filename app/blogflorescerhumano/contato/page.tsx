"use client";

// app/blogflorescerhumano/contato/page.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Facebook, Instagram, Youtube, Home, ChevronRight } from 'lucide-react';
import BannerImage from '../components/BannerImage';

export default function ContatoPage() {
  
  // Informações de contato
  const contactInfo = {
    phone: "+55 (85) 98601-3431",
    email: "contatomarcosdgomes@gmail.com",
    address: "Brazil, Fortaleza-CE",
    facebookUrl: "https://www.facebook.com/psicologodanieldantas",
    instagramUrl: "https://www.instagram.com/psidanieldantas",
    youtubeUrl: "https://www.youtube.com/@psidanieldantas",
  };
    return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Banner Section */}      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-[#583B1F]">
        <BannerImage 
          bannerPath="/blogflorescerhumano/banners-blog/banner-contato.webp"
          fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
          alt="Banner da página de contato do Blog Florescer Humano"
          className="brightness-75 z-0"
        />
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/70 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-20">
          <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg font-['Old_Roman']">
              Entre em Contato
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Tem dúvidas, sugestões ou gostaria de propor uma parceria? Adoraríamos ouvir você!
            </p>
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
                className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                <Home className="h-4 w-4 mr-1" />                Início
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li>
              <Link 
                href="/blogflorescerhumano" 
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >                Blog
              </Link>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li className="text-[#583B1F] font-medium">
              Contato
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Grid de cards com espaçamento uniforme */}        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Apenas as Informações de Contato */}
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#C19A6B]/20">
            <h2 className="text-2xl md:text-3xl font-['Old_Roman'] mb-4 md:mb-6 text-[#583B1F] border-b border-[#C19A6B]/20 pb-3">Fale Conosco</h2>
            <p className="text-[#735B43] mb-6 md:mb-8 text-sm md:text-base">
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
                    className="text-[#735B43] hover:text-[#C19A6B] transition-colors text-xs md:text-sm break-all"
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
                  <p className="text-[#735B43] text-xs md:text-sm">{contactInfo.address}</p>
                </div>
              </li>
            </ul>
            
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-[#583B1F]">Redes Sociais</h3>
            <div className="flex space-x-3 md:space-x-4">              <Link
                href={contactInfo.facebookUrl}                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#583B1F] w-9 h-9 md:w-11 md:h-11 rounded-full hover:bg-[#735B43] transition-colors shadow-md flex items-center justify-center"
              >
                <Facebook className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </Link>              <Link
                href={contactInfo.instagramUrl}                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#583B1F] w-9 h-9 md:w-11 md:h-11 rounded-full hover:bg-[#735B43] transition-colors shadow-md flex items-center justify-center"
              >
                <Instagram className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </Link>              <Link
                href={contactInfo.youtubeUrl}                target="_blank" 
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
