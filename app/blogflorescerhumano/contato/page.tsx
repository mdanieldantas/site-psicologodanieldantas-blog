// app/blogflorescerhumano/contato/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ContatoFormulario from './components/ContatoFormulario';

export const metadata: Metadata = {
  title: 'Contato | Blog Florescer Humano',
  description: 'Entre em contato com o Blog Florescer Humano para dúvidas, sugestões ou parcerias. Adoraríamos ouvir você!',
  alternates: {
    canonical: '/blogflorescerhumano/contato',
  },
  openGraph: {
    title: 'Contato | Blog Florescer Humano',
    description: 'Envie sua mensagem para o Blog Florescer Humano.',
    url: '/blogflorescerhumano/contato',
    siteName: 'Blog Florescer Humano',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contato | Blog Florescer Humano',
    description: 'Envie sua mensagem para o Blog Florescer Humano.',
  },
};

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
      {/* Hero Banner Section */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <Image
          src="/blogflorescerhumano/banners-blog/banner-contato.webp"
          alt="Banner da página de contato do Blog Florescer Humano"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          className="brightness-75"
        />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/70 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
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
                <HomeIcon className="h-4 w-4 mr-1" />
                Início
              </Link>
            </li>
            <ChevronRightIcon className="h-4 w-4 text-[#735B43]/60" />
            <li>
              <Link 
                href="/blogflorescerhumano" 
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            <ChevronRightIcon className="h-4 w-4 text-[#735B43]/60" />
            <li className="text-[#583B1F] font-medium">
              Contato
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Stats Section */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#C19A6B]/20">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-[#583B1F] font-['Old_Roman']">
                  Nossa Equipe está à sua Disposição
                </p>
                <p className="text-[#735B43]">
                  Estamos prontos para responder suas dúvidas e ouvir suas sugestões
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          {/* Informações de Contato */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-[#C19A6B]/20 h-full"> 
            <h2 className="text-3xl font-['Old_Roman'] mb-6 text-[#583B1F] border-b border-[#C19A6B]/20 pb-3">Fale Conosco</h2>
            <p className="text-[#735B43] mb-8">
              Tem alguma dúvida, sugestão, ou gostaria de propor uma parceria?
              Envie um e-mail para o endereço abaixo que entraremos em contato o mais breve possível.
            </p>

            <h3 className="text-xl font-semibold mb-4 text-[#583B1F]">Informações de Contato</h3>
            <ul className="space-y-6 mb-8">
              <li className="flex items-start">
                <div className="bg-[#C19A6B] p-2 rounded-full mr-4 mt-1 flex-shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="block font-medium text-[#583B1F] mb-1">Telefone</span>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\D/g, '')}`}
                    className="text-[#735B43] hover:text-[#C19A6B] transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-[#C19A6B] p-2 rounded-full mr-4 mt-1 flex-shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="block font-medium text-[#583B1F] mb-1">E-mail</span>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-[#735B43] hover:text-[#C19A6B] transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-[#C19A6B] p-2 rounded-full mr-4 mt-1 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="block font-medium text-[#583B1F] mb-1">Endereço</span>
                  <p className="text-[#735B43]">{contactInfo.address}</p>
                </div>
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-4 text-[#583B1F]">Redes Sociais</h3>
            <div className="flex space-x-4">
              <Link
                href={contactInfo.facebookUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#583B1F] p-3 rounded-full hover:bg-[#735B43] transition-colors shadow-md"
              >
                <Facebook className="h-5 w-5 text-white" />
              </Link>
              <Link
                href={contactInfo.instagramUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#583B1F] p-3 rounded-full hover:bg-[#735B43] transition-colors shadow-md"
              >
                <Instagram className="h-5 w-5 text-white" />
              </Link>
              <Link
                href={contactInfo.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#583B1F] p-3 rounded-full hover:bg-[#735B43] transition-colors shadow-md"
              >
                <Youtube className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Formulário de Contato */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-[#C19A6B]/20">
            <h2 className="text-3xl font-['Old_Roman'] mb-6 text-[#583B1F] border-b border-[#C19A6B]/20 pb-3">Envie sua Mensagem</h2>
            {/* Renderiza o Client Component */}
            <ContatoFormulario contactInfo={contactInfo} />
          </div>
        </div>
      </main>
    </div>
  );
}
