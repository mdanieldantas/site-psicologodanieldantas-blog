"use client"

// Importações de bibliotecas e ícones
import { useState, useEffect, useRef } from "react"
import { Suspense } from 'react';

// Importações de Componentes da Página
import SchemaMarkup from "./schema-markup"
import HeroSection from '@/components/landing-page/HeroSection';

// Importações dos Componentes de Seção Refatorados
import Header from "@/components/landing-page/Header";
import MobileMenu from "@/components/landing-page/MobileMenu";
import AboutSection from "@/components/landing-page/AboutSection";
import WorkSection from "@/components/landing-page/WorkSection";
import ChallengesSection from "@/components/landing-page/ChallengesSection";
import ServicesSection from "@/components/landing-page/ServicesSection";
import FakeBlogPreviewSection from '@/components/landing-page/FakeBlogPreviewSection'; // Importação descomentada e correta
import FaqSection from "@/components/landing-page/FaqSection";
import ContactSection from "@/components/landing-page/ContactSection";
import Footer from "@/components/landing-page/Footer";
import WaveTransition from '@/components/wave-transition'; // Importação corrigida

import WhatsAppButton from "@/components/whatsapp-button";
import { WhatsAppModalProvider } from '@/components/whatsapp-modal-context';
import CookieConsentBanner from '@/components/cookie-consent';

// Dados dos posts do blog (mantidos aqui ou movidos para um local de dados)
// NOTA: Idealmente, esses dados viriam de uma API ou CMS.
const featuredPosts = [
  {
    slug: "importancia-empatia-terapia-humanista", // Usar slug como ID é mais comum
    title: "A importância da empatia na terapia humanista",
    excerpt:
      "Explorando como a empatia genuína forma a base da relação terapêutica na abordagem centrada na pessoa de Carl Rogers...",
    imageUrl: "/importância-da-empatia-image-blog.png",
  },
  {
    slug: "focalizacao-sabedoria-corpo",
    title: "Focalização: conectando-se com a sabedoria do corpo",
    excerpt:
      "Como a técnica de Focalização desenvolvida por Eugene Gendlin pode nos ajudar a acessar conhecimentos implícitos através das sensações corporais...",
    imageUrl: "/Focalização-conectando-se-image-blog.png",
  },
  {
    slug: "mindfulness-autorregulacao-emocional",
    title: "Mindfulness e autorregulação emocional",
    excerpt:
      "Práticas de atenção plena que podem ajudar no processo de regulação das emoções e redução do estresse no dia a dia...",
    imageUrl: "/Mindfulness-e-autorregulação-image-blog.png",
  },
]

// Componente principal da Landing Page
export default function LandingPage() {  // Estados para controle da UI
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [scrollActive, setScrollActive] = useState(false)
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null) // Referência para a seção Hero
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Efeito para verificar se a tela é mobile ao carregar e redimensionar
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024) // Define breakpoint para mobile (lg)
    }
    checkIfMobile() // Verifica no carregamento inicial
    window.addEventListener("resize", checkIfMobile) // Adiciona listener para redimensionamento
    return () => {
      window.removeEventListener("resize", checkIfMobile) // Limpa o listener ao desmontar
    }
  }, [])
  // Efeito para controlar a visibilidade do botão ScrollTop e o estado do header
  useEffect(() => {
    const handleScroll = () => {
      // Ativa o estado de rolagem
      setScrollActive(true)
      
      // Mostra o botão ScrollTop após rolar 300px
      const shouldShow = window.scrollY > 300
      if (shouldShow) {
        setShowScrollTop(true)
      }

      // Verifica se o scroll passou da seção Hero (com uma pequena margem)
      if (heroRef.current) {
        // Considera que passou do hero se o scroll for maior que 2 pixels (ajustável)
        setScrolledPastHero(window.scrollY > 2)
      } else {
        // Fallback caso a ref não esteja pronta, considera que passou após 50px
        setScrolledPastHero(window.scrollY > 50)
      }
      
      // Limpa qualquer timeout existente
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      
      // Define novo timeout para esconder o botão após 2.5 segundos de inatividade
      scrollTimeoutRef.current = setTimeout(() => {
        setScrollActive(false)
        if (!shouldShow) {
          setShowScrollTop(false)
        }
      }, 2500)
    }

    window.addEventListener("scroll", handleScroll) // Adiciona listener de scroll
    return () => {
      window.removeEventListener("scroll", handleScroll) // Limpa o listener ao desmontar
      // Limpa qualquer timeout pendente
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, []) // Dependência vazia, executa apenas uma vez na montagem e limpeza
  // Array com os IDs das seções em ordem
  const sectionIds = ["inicio", "sobre", "trabalho", "desafios", "servicos", "blog", "faq", "contato"];
  
  // Função para rolar para a seção anterior
  const scrollToPreviousSection = () => {
    // Obtém a posição atual de scroll
    const currentScrollY = window.scrollY;
    
    // Encontra a seção atual comparando posições
    let currentSectionIndex = -1;
    let previousSectionId = "inicio"; // Padrão para o topo
    
    // Percorre as seções em ordem inversa para encontrar a atual
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const sectionElement = document.getElementById(sectionIds[i]);
      if (sectionElement) {
        const sectionTop = sectionElement.offsetTop - 100; // Margem de 100px para considerar a seção atual
        
        if (currentScrollY > sectionTop) {
          currentSectionIndex = i;
          // Se encontrou a seção atual, a anterior é o índice - 1 (ou o topo se for a primeira seção)
          previousSectionId = i > 0 ? sectionIds[i - 1] : "inicio";
          break;
        }
      }
    }
    
    // Rola para a seção anterior ou para o topo
    const previousSection = document.getElementById(previousSectionId);
    if (previousSection) {
      previousSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback para o topo se a seção não for encontrada
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  // Função para abrir/fechar o menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Função para fechar o menu mobile (usada nos links do menu)
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    // Container principal da página
    <div className="min-h-screen bg-[#F8F5F0] font-['Kaisei_Opti'] text-[#583B1F]">
      {/* Componente para adicionar Schema Markup (SEO) */}
      <SchemaMarkup />

      {/* Componente Header fixo */}
      <Header
        isMobile={isMobile}
        scrolledPastHero={scrolledPastHero}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Componente Menu Mobile (renderizado condicionalmente) */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        closeMenu={closeMobileMenu}
      />

      {/* Componente Seção Hero */}
      <HeroSection ref={heroRef} />

      {/* Conteúdo principal da página */}
      <main>
        {/* Componente Seção Sobre Mim */}
        <AboutSection />

        {/* Componente Seção Conheça Meu Trabalho */}
        <WorkSection />

        {/* Componente Seção Desafios */}
        <ChallengesSection />

        {/* Componente Seção Serviços */}
        {/* Passa isMobile para lógica do carrossel interno */}
        <ServicesSection isMobile={isMobile} />

        {/* Componente Seção Prévia do Blog - MOVIDO PARA ANTES DO FAQ */}
        {/* Passa os dados dos posts */}
        {/* <BlogPreviewSection posts={featuredPosts} /> */}
        <FakeBlogPreviewSection /> {/* Uso correto */}

        {/* Componente Seção FAQ */}
        <FaqSection />

        {/* Componente Seção Contato */}
        {/* <ContactSection /> */}
      </main>      {/* Componente Footer */}
      <Footer />      {/* Componente Botão Scroll para Seção Anterior (renderizado condicionalmente) com temporização */}
      {showScrollTop && (
        <button
          onClick={scrollToPreviousSection}
          className="fixed bottom-10 left-0 z-[60] py-1.5 px-4 bg-[#583B1F]/40 text-white text-xs font-light rounded-r-md shadow-sm hover:bg-[#735B43]/60 transition-all duration-300 flex items-center"
          style={{ opacity: scrollActive ? 0.9 : 0.3 }}
          aria-label="Voltar para a seção anterior"
        >
          <span className="mr-1 text-[10px]">↑</span>
          <span>voltar</span>
        </button>
      )}

      {/* Botão Flutuante do WhatsApp */}
      <WhatsAppButton />
    </div>
  )
}

