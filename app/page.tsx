"use client"

// Importações de bibliotecas e ícones
import { useState, useEffect, useRef } from "react"

// Importações de Componentes da Página
import SchemaMarkup from "./schema-markup"

// Importações dos Componentes de Seção Refatorados
import Header from "@/components/landing-page/Header";
import MobileMenu from "@/components/landing-page/MobileMenu";
import HeroSection from "@/components/landing-page/HeroSection";
import AboutSection from "@/components/landing-page/AboutSection";
import WorkSection from "@/components/landing-page/WorkSection";
import ChallengesSection from "@/components/landing-page/ChallengesSection";
import ServicesSection from "@/components/landing-page/ServicesSection";
import FaqSection from "@/components/landing-page/FaqSection";
import BlogPreviewSection from "@/components/landing-page/BlogPreviewSection";
import ContactSection from "@/components/landing-page/ContactSection";
import ScrollTopButton from "@/components/landing-page/ScrollTopButton";
import Footer from "@/components/landing-page/Footer";
// Corrigido: Importa usando o nome do arquivo (minúsculo) e a sintaxe padrão
import WhatsAppButton from "@/components/whatsapp-button";

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
export default function LandingPage() {
  // Estados para controle da UI
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null) // Referência para a seção Hero

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
      // Mostra o botão ScrollTop após rolar 300px
      setShowScrollTop(window.scrollY > 300)

      // Verifica se o scroll passou da seção Hero (com uma pequena margem)
      if (heroRef.current) {
        // Considera que passou do hero se o scroll for maior que 2 pixels (ajustável)
        setScrolledPastHero(window.scrollY > 2)
      } else {
        // Fallback caso a ref não esteja pronta, considera que passou após 50px
        setScrolledPastHero(window.scrollY > 50)
      }
    }

    window.addEventListener("scroll", handleScroll) // Adiciona listener de scroll
    return () => {
      window.removeEventListener("scroll", handleScroll) // Limpa o listener ao desmontar
    }
  }, []) // Dependência vazia, executa apenas uma vez na montagem e limpeza

  // Função para rolar a página para o topo suavemente
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
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
        <BlogPreviewSection posts={featuredPosts} />

        {/* Componente Seção FAQ */}
        <FaqSection />

        {/* Componente Seção Contato */}
        <ContactSection />
      </main>

      {/* Componente Footer */}
      <Footer />

      {/* Componente Botão Scroll Top (renderizado condicionalmente) */}
      <ScrollTopButton
        show={showScrollTop}
        scrollToTop={scrollToTop}
      />

      {/* Botão Flutuante do WhatsApp */}
      <WhatsAppButton />
    </div>
  )
}

