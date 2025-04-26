"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Menu,
  X,
  Heart,
  Users,
  Home,
  Presentation,
  MessageSquare,
  Video,
  Calendar,
  Compass,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
  ArrowUp,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState, useEffect, useRef } from "react"

// Importe os componentes necessários
import SchemaMarkup from "./schema-markup"
import WhatsAppButton from "@/components/whatsapp-button"
import LazyMap from "@/components/lazy-map"
import ContactForm from "@/components/contact-form"
import WaveTransition from "@/components/wave-transition"

// Array de posts do blog com temas específicos
const featuredPosts = [
  {
    id: 1,
    title: "A importância da empatia na terapia humanista",
    excerpt:
      "Explorando como a empatia genuína forma a base da relação terapêutica na abordagem centrada na pessoa de Carl Rogers...",
    date: "15 de Abril, 2023",
    imageUrl: "/importância-da-empatia-image-blog.png",
    featured: true,
  },
  {
    id: 2,
    title: "Focalização: conectando-se com a sabedoria do corpo",
    excerpt:
      "Como a técnica de Focalização desenvolvida por Eugene Gendlin pode nos ajudar a acessar conhecimentos implícitos através das sensações corporais...",
    date: "28 de Março, 2023",
    imageUrl: "/Focalização-conectando-se-image-blog.png",
  },
  {
    id: 3,
    title: "Mindfulness e autorregulação emocional",
    excerpt:
      "Práticas de atenção plena que podem ajudar no processo de regulação das emoções e redução do estresse no dia a dia...",
    date: "10 de Março, 2023",
    imageUrl: "/Mindfulness-e-autorregulação-image-blog.png",
  },
]

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [abordagemSlide, setAbordagemSlide] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Check initially
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }

      // Check if scrolled past hero section - modificado para aparecer antes do nome
      if (heroRef.current) {
        setScrolledPastHero(window.scrollY > 2)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] font-['Kaisei_Opti'] text-[#583B1F]">
      <SchemaMarkup />

      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <nav className="container mx-auto px-4 py-4">
          <div
            className={`flex items-center justify-between mx-[4%] ${scrolledPastHero ? "bg-transparent" : "bg-transparent px-6 py-3"} transition-all duration-300`}
          >
            {!scrolledPastHero && (
              <Link href="/" className="w-[200px]">
                <Image
                  src="/navbar-logo-horizontal-navbar.png"
                  alt="Daniel Dantas - Psicólogo"
                  width={200}
                  height={80}
                  className="w-full h-auto"
                />
              </Link>
            )}

            {/* Mobile Menu Button - Always visible when scrolled past hero */}
            {(isMobile || scrolledPastHero) && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`text-[#583B1F] focus:outline-none z-[101] ml-auto ${scrolledPastHero && !isMobile ? "ml-auto" : ""}`}
                aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}

            {/* Desktop Navigation - Hidden when scrolled past hero */}
            {!isMobile && !scrolledPastHero && (
              <div className="flex items-center space-x-6">
                <a href="#inicio" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                  Início
                </a>
                <a href="#sobre" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                  Sobre
                </a>
                <a href="#servicos" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                  Serviços
                </a>
                <a href="#faq" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                  FAQ
                </a>
                <a href="#blog" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                  Blog
                </a>
                <a href="#contato" className="text-sm text-[#735B43] hover:text-[#583B1F]">
                  Contato
                </a>
                <a
                  href="#contato"
                  className="rounded-md border border-[#735B43] px-8 py-2 text-sm text-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0]"
                >
                  Agendar Consulta
                </a>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#F8F5F0] z-[100] flex flex-col items-center justify-center">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-[#583B1F] focus:outline-none z-[101]"
            aria-label="Fechar menu"
          >
            <X size={24} />
          </button>
          <div className="flex flex-col items-center space-y-6">
            <a
              href="#inicio"
              className="text-xl text-[#583B1F] hover:text-[#735B43]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Início
            </a>
            <a
              href="#sobre"
              className="text-xl text-[#583B1F] hover:text-[#735B43]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre
            </a>
            <a
              href="#servicos"
              className="text-xl text-[#583B1F] hover:text-[#735B43]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Serviços
            </a>
            <a
              href="#faq"
              className="text-xl text-[#583B1F] hover:text-[#735B43]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="#blog"
              className="text-xl text-[#583B1F] hover:text-[#735B43]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </a>
            <a
              href="#contato"
              className="text-xl text-[#583B1F] hover:text-[#735B43]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contato
            </a>
            <a
              href="#contato"
              className="mt-4 rounded-md border border-[#735B43] px-8 py-3 text-[#735B43] hover:bg-[#735B43] hover:text-[#F8F5F0]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Agendar Consulta
            </a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} id="inicio" className="relative min-h-screen flex items-center pt-24">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image src="/hero-sofa.png" alt="Sofá de terapia" fill priority className="object-cover" />
        </div>
        <div className="relative z-[5] container mx-auto px-[15%] pt-25 ">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">Psicólogo Daniel Dantas</h1>
            <p className="text-xl text-[#735B43] border-b border-[#583B1F] pb-12 mb-12 max-w-[70vh]">
              Psicólogo Clínico Online - Criando um espaço de acolhimento e transformação para sua jornada de
              autoconhecimento, onde quer que você esteja.
            </p>
            <a
              href="#contato"
              className="mt-8 px-8 py-3 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md inline-block"
            >
              Vamos conversar?
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-[5]">
          <a href="#sobre" className="text-[#583B1F] animate-bounce">
            <ChevronDown size={32} />
          </a>
        </div>
      </section>

      {/* Main Content */}
      <main>
{/* Sobre Mim Section */}
<section id="sobre" className="py-12 md:py-20 bg-[#F5F2EE]">
  <div className="container mx-auto px-6 md:px-[10%]">
    <h2 className="text-2xl md:text-3xl font-light mb-8 md:mb-12 border-b border-[#583B1F] pb-4 inline-block">
      Sobre Daniel Dantas
    </h2>

    {/* Container Principal */}
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Imagem - APENAS MOBILE: aparece após o título e antes do texto */}
      <div className="lg:hidden w-full flex justify-center mb-6">
        <div className="relative w-[250px] h-[250px]">
          <Image
            src="/foto-psicologo-daniel-dantas.png"
            alt="Daniel Dantas - Psicólogo"
            fill
            className="rounded-lg object-cover shadow-lg"
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="lg:w-2/3 space-y-6">
        <p className="text-[#735B43] text-base font-light">
          Sabe aquela sensação de que o que a gente sente é tão grande que as palavras parecem pequenas demais?
          Ou, às vezes, uma dor que a gente carrega, mas que ainda não encontrou um nome?
        </p>

        <div className="pl-4 border-l-4 border-[#C19A6B] italic">
          <p className="text-[#735B43] text-lg">
            Algumas dores não cabem em palavras. Outras precisam ser nomeadas para serem curadas.
          </p>
        </div>

        <p className="text-[#735B43] text-base font-light">
          Essa frase me acompanha porque acredito muito no poder do espaço terapêutico para transformar o que
          sentimos, seja a ansiedade que aperta o peito, a angústia que tira o sono, ou qualquer outra
          dificuldade que esteja sentindo.
        </p>

        <p className="text-[#735B43] text-base font-light">
          Meu chamo Daniel Dantas, sou psicólogo clínico humanista, pós-graduado em Saúde Mental, Psicopatologia
          e Atenção Psicossocial. Minha prática clínica se apoia na Abordagem Centrada na Pessoa e Focalização,
          nas quais tenho formação, e nas práticas de Mindfulness. Como psicólogo, caminhei por diferentes
          lugares. Desde trabalhos com grupos, contextos de violação de direitos humanos, saúde coletiva entre
          outros. Cada um desses encontros, vivências e formações me fez ser o profissional que sou hoje, com um
          olhar mais sensível para cada história, com carinho e muito respeito.
        </p>

        <p className="text-[#735B43] text-base font-light">
          Dar o primeiro passo nem sempre é fácil, mas pode ser o início de uma grande transformação. Se você
          está considerando buscar um espaço para você, te convido a entrar em contato. Ficarei feliz em te
          receber para conversarmos.
        </p>
      </div>

      {/* Imagem - DESKTOP: aparece à direita */}
      <div className="hidden lg:block lg:w-1/3 flex justify-end lg:pl-8">
        <div className="relative w-[350px] h-[350px]">
          <Image
            src="/foto-psicologo-daniel-dantas.png"
            alt="Daniel Dantas - Psicólogo"
            fill
            className="rounded-lg object-cover shadow-lg"
          />
        </div>
      </div>
    </div>
  </div>
</section>

{/* Conheça Meu Trabalho Section */}
<section className="py-20 bg-[#F5F2EE]">
  <div className="container mx-auto px-6 md:px-[10%]">
    <h2 className="text-3xl font-light mb-4 text-[#583B1F]">Conheça Meu Trabalho</h2>

    <div className="mt-8 grid gap-8 md:grid-cols-2 items-center">
      {/* Texto + Lista (sempre primeiro no HTML) */}
      <div className="md:order-1 order-1">
        <p className="text-[#735B43] mb-6 text-base font-light">
          Neste vídeo, compartilho minha jornada como psicólogo e apresento as abordagens terapêuticas que
          fundamentam meu trabalho: a Abordagem Centrada na Pessoa, a Focalização e o Mindfulness. Explico como
          estas técnicas se complementam para criar um processo terapêutico integrado e personalizado.
        </p>

        <ul className="space-y-4 mb-6">
          <li className="flex items-start">
            <div className="bg-[#C19A6B] rounded-full min-w-[24px] h-6 flex items-center justify-center mr-3 mt-1">
              <span className="text-white">•</span>
            </div>
            <p className="text-[#735B43] text-base font-light">
              Descubra como a integração de diferentes abordagens pode potencializar seu processo terapêutico.
            </p>
          </li>
          
          <li className="flex items-start">
            <div className="bg-[#C19A6B] rounded-full min-w-[24px] h-6 flex items-center justify-center mr-3 mt-1">
              <span className="text-white">•</span>
            </div>
            <p className="text-[#735B43] text-base font-light">
              Entenda como podemos trabalhar juntos em sua jornada de autoconhecimento e bem-estar.
            </p>
          </li>
        </ul>

        {/* Botão DESKTOP (hidden em mobile) */}
        <a
          href="#contato"
          className="hidden md:inline-block px-6 py-2 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md mt-2"
        >
          Vamos iniciar sua jornada terapêutica?
        </a>
      </div>

      {/* Vídeo + Botão MOBILE */}
      <div className="md:order-2 order-2">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="relative h-0 pb-[56.25%] rounded-lg overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/8r22CAuoyPc"
              title="Conheça Meu Trabalho - Daniel Dantas"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Botão MOBILE (apenas em mobile) */}
        <div className="mt-6 md:hidden text-center">
          <a
            href="#contato"
            className="px-6 py-2 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md inline-block"
          >
            Vamos iniciar sua jornada terapêutica?
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* Challenges Section */}
        <section id="desafios" className="py-24 bg-[#F8F5F0]">
          <div className="container mx-auto px-[10%]">
            <h2 className="text-3xl font-light mb-4 text-center">Desafios que Podemos Enfrentar Juntos</h2>
            <p className="text-xl text-[#735B43] mb-12 text-center max-w-2xl mx-auto">
              Independentemente de onde você esteja, alguns desafios são universais. Estou aqui para te acompanhar nessa
              jornada.
            </p>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-[#F8F5F0] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                    <Heart className="h-6 w-6 text-[#F8F5F0]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#583B1F]">Adaptação a Mudanças</h3>
                </div>
                <p className="text-[#4A3114] font-light">
                  Mudanças significativas na vida, como morar em um novo país ou cidade, mudar de carreira ou enfrentar
                  transições importantes, podem despertar sentimentos de insegurança e ansiedade. Juntos, podemos
                  trabalhar para que você encontre equilíbrio e significado nessas novas fases.
                </p>
              </div>

              <div className="bg-[#F8F5F0] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-[#F8F5F0]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#583B1F]">Distância e Conexões</h3>
                </div>
                <p className="text-[#4A3114] font-light">
                  A distância física de entes queridos e a construção de novas relações podem trazer desafios emocionais
                  significativos. Trabalharemos juntos para fortalecer sua capacidade de manter conexões significativas
                  e construir novas relações saudáveis, independentemente da distância.
                </p>
              </div>

              <div className="bg-[#F8F5F0] p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                    <Compass className="h-6 w-6 text-[#F8F5F0]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#583B1F]">Identidade e Propósito</h3>
                </div>
                <p className="text-[#4A3114] font-light">
                  Questões sobre identidade, propósito e pertencimento são comuns, especialmente em momentos de
                  transição. Através da nossa jornada terapêutica, você poderá explorar essas questões em um espaço
                  seguro e acolhedor, encontrando clareza e direcionamento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços Section */}
        <section id="servicos" className="py-20 bg-[#F5F2EE]">
          <div className="container mx-auto px-[10%]">
            <div className="mb-6"></div>
            <h2 className="text-3xl font-light mb-4 text-center">Serviços</h2>
            <p className="text-xl text-[#735B43] mb-12 text-center max-w-2xl mx-auto">
              Ofereço atendimento personalizado para ajudar você a encontrar equilíbrio e bem-estar.
            </p>

            {/* Online Psychotherapy Banner */}
            <div className="bg-[#583B1F] rounded-lg shadow-xl mb-16 overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Text Content */}
                <div className="p-8 md:p-10 text-[#F8F5F0]">
                  <div className="flex items-center mb-6">
                    <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                      <Video className="h-6 w-6 text-[#F8F5F0]" />
                    </div>
                    <h3 className="text-2xl font-medium">Psicoterapia Online</h3>
                  </div>

                  <p className="mb-6 font-light leading-relaxed">
                    A terapia online elimina barreiras geográficas e oferece a mesma qualidade e profundidade do
                    atendimento presencial. No conforto do seu espaço, podemos estabelecer uma conexão significativa e
                    trabalhar questões importantes para seu bem-estar e desenvolvimento pessoal - independentemente da
                    distância.
                  </p>

                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center">
                      <div className="mr-2 text-[#C19A6B]">•</div>
                      <span>Sessões por videochamada em plataformas seguras</span>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 text-[#C19A6B]">•</div>
                      <span>Flexibilidade de horários e localização</span>
                    </li>
                    <li className="flex items-center">
                      <div className="mr-2 text-[#C19A6B]">•</div>
                      <span>Mesmo acolhimento e eficácia da terapia presencial</span>
                    </li>
                  </ul>

                  <a
                    href="#contato"
                    className="mt-4 px-8 py-3 bg-[#C19A6B] text-[#F8F5F0] hover:bg-[#D1AA7B] transition-colors duration-300 flex items-center rounded-md inline-block"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Agendar primeira sessão
                  </a>
                </div>

                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <Image src="/atendimento-online-image.png" alt="Psicoterapia Online" fill className="object-cover" />
                </div>
              </div>
            </div>

            {/* Demandas Section */}
            <div className="bg-[#F5F2EE] rounded-lg shadow-lg p-8 mb-16">
              <div className="mb-6"></div>
              <h3 className="text-2xl font-medium text-[#583B1F] text-center mb-4">
                Eu posso te ajudar na travessia de demandas como:
              </h3>
              <p className="text-[#735B43] text-center mb-12 max-w-3xl mx-auto">
                Utilizando a Abordagem Centrada na Pessoa (ACP) e a Focalização, ofereço um espaço seguro e acolhedor
                para que você possa explorar suas emoções, superar desafios e encontrar caminhos para uma vida mais
                equilibrada e significativa.
              </p>

              {/* Carrossel de Demandas - Versão Mobile mostra 1 card por vez */}
              <div className="relative max-w-6xl mx-auto">
                {/* Botão Anterior */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? 11 : prev - 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-colors duration-300 focus:outline-none"
                  aria-label="Slides anteriores"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Slides */}
                <div className="overflow-hidden rounded-lg">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlide * (isMobile ? 100 : 33.333)}%)`,
                    }}
                  >
                    {/* Grupo 1: Ansiedade e Estresse */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Ansiedade-e-Estresse-image.png"
                              alt="Ansiedade e Estresse"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">Ansiedade e Estresse</h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Ajudar você a identificar as causas da ansiedade e do estresse, promovendo autoconhecimento e
                          técnicas de regulação emocional através da Focalização e da ACP.
                        </p>
                      </div>
                    </div>

                    {/* Grupo 1: Regulação Emocional */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Regulacao-Emocional-image.png"
                              alt="Regulação Emocional"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">Regulação Emocional</h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Ensinar técnicas de Focalização para que você possa se conectar com suas emoções e aprender a
                          regulá-las de forma saudável.
                        </p>
                      </div>
                    </div>

                    {/* Grupo 1: Traumas e Experiências Difíceis */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Traumas-e-Experiencias-Dificeis-image.png"
                              alt="Traumas e Experiências Difíceis"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">
                            Traumas e Experiências Difíceis
                          </h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Auxiliar no processo de elaboração e superação de traumas, utilizando técnicas de Focalização
                          para acessar e integrar experiências dolorosas de forma segura e gradual.
                        </p>
                      </div>
                    </div>

                    {/* Grupo 2: Depressão e Tristeza Profunda */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Depressao-e-Tristeza-Profunda-image.png"
                              alt="Depressão e Tristeza Profunda"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">
                            Depressão e Tristeza Profunda
                          </h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Oferecer um espaço de escuta ativa e empatia para que você possa explorar suas emoções e
                          encontrar novas perspectivas para lidar com a depressão e a tristeza.
                        </p>
                      </div>
                    </div>

                    {/* Grupo 2: Dificuldades em Relacionamentos */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Dificuldades-em-Relacionamentos.png"
                              alt="Dificuldades em Relacionamentos"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">
                            Dificuldades em Relacionamentos
                          </h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Trabalhar questões como comunicação, conflitos e conexão emocional, ajudando você a construir
                          relacionamentos mais saudáveis e autênticos.
                        </p>
                      </div>
                    </div>

                    {/* Grupo 2: Autoconhecimento e Crescimento Pessoal */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Autoconhecimento-e-Crescimento-Pessoal-image.png"
                              alt="Autoconhecimento e Crescimento Pessoal"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">
                            Autoconhecimento e Crescimento Pessoal
                          </h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Facilitar o processo de autoconhecimento, ajudando você a se conectar com suas emoções,
                          valores e objetivos, promovendo um crescimento pessoal significativo.
                        </p>
                      </div>
                    </div>

                    {/* Grupo 3: Dúvidas e Crises Existenciais */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Duvidas-e-Crises-Existenciais-image.png"
                              alt="Dúvidas e Crises Existenciais"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">
                            Dúvidas e Crises Existenciais
                          </h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Ajudar você a explorar questões existenciais, como sentido da vida, propósito e identidade,
                          promovendo uma maior clareza e direcionamento.
                        </p>
                      </div>
                    </div>

                    {/* Grupo 3: Dificuldades de Autoaceitação e Autoestima */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Dificuldades-de-Autoaceitacao-e-Autoestima-image.png"
                              alt="Dificuldades de Autoaceitação e Autoestima"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">
                            Dificuldades de Autoaceitação e Autoestima
                          </h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Trabalhar a autoaceitação e a construção de uma autoestima saudável, através de um processo de
                          escuta ativa e validação das suas experiências.
                        </p>
                      </div>
                    </div>

                    {/* Grupo 3: Transições de Vida e Mudanças */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Transicoes-de-Vida-e-Mudancas-image.png"
                              alt="Transições de Vida e Mudanças"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">
                            Transições de Vida e Mudanças
                          </h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Acompanhar você em momentos de transição, como mudanças profissionais, lutos ou novos ciclos
                          de vida, ajudando a encontrar equilíbrio e significado nessas fases.
                        </p>
                      </div>
                    </div>

                    {/* Grupo 4: Desenvolvimento de Habilidades Sociais */}
                    <div className={`w-full ${isMobile ? "w-full" : "md:w-1/3"} flex-shrink-0 p-4`}>
                      <div className="bg-[#F8F5F0] p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[#C19A6B] h-full">
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-full h-40 relative mb-4">
                            <Image
                              src="/Desenvolvimento-de-Habilidades-Sociais-image.png"
                              alt="Desenvolvimento de Habilidades Sociais"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <h4 className="text-lg font-medium text-[#583B1F] text-center">
                            Desenvolvimento de Habilidades Sociais
                          </h4>
                        </div>
                        <p className="text-[#735B43] text-sm">
                          Ajudar você a desenvolver habilidades sociais e emocionais, como empatia, assertividade e
                          comunicação, para melhorar suas interações pessoais e profissionais.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Próximo */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === (isMobile ? 9 : 3) ? 0 : prev + 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-[#583B1F] text-[#F8F5F0] p-2 rounded-full shadow-lg hover:bg-[#735B43] transition-colors duration-300 focus:outline-none"
                  aria-label="Próximos slides"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Indicadores de Slide 
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: isMobile ? 10 : 4 }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 focus:outline-none ${
                        currentSlide === index ? "bg-[#583B1F]" : "bg-[#C19A6B]"
                      }`}
                      aria-label={`Ir para grupo ${index + 1}`}
                    />
                  ))}
                </div> 
                */}

              </div>
              <div className="mt-10 text-center">
                <p className="text-[#735B43] mb-6 max-w-3xl mx-auto">
                  Se você se identificou com alguma dessas demandas ou está passando por outras questões emocionais,
                  entre em contato e agende uma consulta. Estou aqui para ajudar você nessa jornada de autoconhecimento
                  e superação.
                </p>
                <a
                  href="#contato"
                  className="inline-flex items-center px-8 py-3 bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Agende uma consulta
                </a>
              </div>
            </div>

            <h3 className="text-2xl font-medium text-[#583B1F] text-center mb-8 mt-16">Outros Serviços</h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="bg-[#F5F2EE] p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-[#C19A6B]">
                <div className="flex flex-col items-center mb-6 sm:flex-row sm:items-start sm:mb-4">
                  <div className="bg-[#583B1F] p-4 rounded-full mb-4 sm:mb-0 sm:mr-4">
                    <Heart className="h-8 w-8 text-[#F8F5F0] sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-[#583B1F] text-center sm:text-left">
                    Psicoterapia Individual
                  </h3>
                </div>
                <p className="text-[#735B43] font-light">
                  Atendimento individual focado em autoconhecimento, superação de desafios emocionais e promoção da
                  saúde mental. Utilizo técnicas como a <strong>Abordagem Centrada na Pessoa (ACP)</strong> e{" "}
                  <strong>Focalização</strong> para ajudar você a acessar e integrar suas experiências corporais e
                  emocionais, promovendo um crescimento pessoal saudável e construtivo.
                </p>
              </div>

              <div className="bg-[#F5F2EE] p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-[#C19A6B]">
                <div className="flex flex-col items-center mb-6 sm:flex-row sm:items-start sm:mb-4">
                  <div className="bg-[#583B1F] p-4 rounded-full mb-4 sm:mb-0 sm:mr-4">
                    <Users className="h-8 w-8 text-[#F8F5F0] sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-[#583B1F] text-center sm:text-left">
                    Grupos Psicoterapêuticos
                  </h3>
                </div>
                <p className="text-[#735B43] font-light">
                  Oficinas e grupos terapêuticos para práticas de regulação emocional e autoconhecimento. Integro
                  técnicas de <strong>Focalização</strong> e <strong>ACP</strong> para ajudar os participantes a
                  explorarem seu <strong>{"'Sentido Sentido'"}</strong> e encontrarem insights profundos para suas
                  questões.
                </p>
              </div>

              <div className="bg-[#F5F2EE] p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-[#C19A6B]">
                <div className="flex flex-col items-center mb-6 sm:flex-row sm:items-start sm:mb-4">
                  <div className="bg-[#583B1F] p-4 rounded-full mb-4 sm:mb-0 sm:mr-4">
                    <Home className="h-8 w-8 text-[#F8F5F0] sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-[#583B1F] text-center sm:text-left">
                    Atendimento Comunitário
                  </h3>
                </div>
                <p className="text-[#735B43] font-light">
                  Trabalho com comunidades vulneráveis, promovendo saúde mental e direitos humanos. Utilizo abordagens
                  como a <strong>Abordagem Centrada na Pessoa</strong> e <strong>Focalização</strong> para ajudar
                  indivíduos a se conectarem com suas experiências corporais e emocionais, promovendo resiliência e
                  bem-estar.
                </p>
              </div>

              <div className="bg-[#F5F2EE] p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-[#C19A6B]">
                <div className="flex flex-col items-center mb-6 sm:flex-row sm:items-start sm:mb-4">
                  <div className="bg-[#583B1F] p-4 rounded-full mb-4 sm:mb-0 sm:mr-4">
                    <Presentation className="h-8 w-8 text-[#F8F5F0] sm:h-6 sm:w-6" />
                  </div>
                  <h3 className="text-xl font-medium text-[#583B1F] text-center sm:text-left">Workshops e Palestras</h3>
                </div>
                <p className="text-[#735B43] font-light">
                  Palestras e workshops sobre temas como saúde mental, técnicas meditativas e bem-estar. Incluo práticas
                  de <strong>Focalização</strong> e <strong>ACP</strong> para ajudar os participantes a explorarem seu{" "}
                  <strong>{"'Sentido Sentido'"}</strong> e encontrarem novas perspectivas para suas vidas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Blog Section - Renomeado para "Blog Florescer Humano" */}
        <section id="blog" className="py-16 bg-[#F5F2EE]">
          <div className="container mx-auto px-[10%]">
            <h2 className="text-3xl font-light mb-4 text-center">Blog Florescer Humano</h2>
            <p className="text-lg text-[#735B43] mb-8 text-center max-w-2xl mx-auto">
              Artigos, reflexões e ferramentas práticas para apoiar seu bem-estar emocional, onde quer que você esteja.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Featured Post (Main) */}
              <div className="bg-[#F5F2EE] rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={featuredPosts[0].imageUrl || "/placeholder.svg"}
                    alt={featuredPosts[0].title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#C19A6B] mb-2">{featuredPosts[0].date}</p>
                  <h3 className="text-xl font-light mb-3 text-[#583B1F]">{featuredPosts[0].title}</h3>
                  <p className="text-[#735B43] font-light mb-4 line-clamp-2">{featuredPosts[0].excerpt}</p>
                  <Link
                    href="/em-construcao"
                    className="inline-flex items-center text-sm text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300"
                  >
                    Ler mais <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Smaller Posts */}
              {featuredPosts.slice(1, 3).map((post) => (
                <div key={post.id} className="bg-[#F5F2EE] rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-36">
                    <Image src={post.imageUrl || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-[#C19A6B] mb-1">{post.date}</p>
                    <h3 className="text-lg font-light mb-2 text-[#583B1F]">{post.title}</h3>
                    <p className="text-[#735B43] font-light text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                    <Link
                      href="/em-construcao"
                      className="inline-flex items-center text-xs text-[#583B1F] hover:text-[#C19A6B] transition-colors duration-300"
                    >
                      Ler mais <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                href="/em-construcao"
                className="px-6 py-2 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 inline-flex items-center rounded-md"
              >
                Ver todos os artigos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section - Movida para antes da seção de contato */}
        <section id="faq" className="py-20 bg-[#F8F5F0]">
          <div className="container mx-auto px-[10%]">
            <h2 className="text-3xl font-light mb-4 text-center text-[#583B1F]">Perguntas Frequentes</h2>
            <p className="text-xl text-[#735B43] mb-12 text-center max-w-2xl mx-auto">
              Tire suas dúvidas sobre meus serviços e abordagem terapêutica.
            </p>

            <div className="max-w-3xl mx-auto bg-[#F0EBE6] p-8 rounded-lg shadow-md">
              <div className="flex justify-center mb-8">
                <div className="bg-[#583B1F] p-4 rounded-full">
                  <MessageSquare className="h-8 w-8 text-[#F8F5F0]" />
                </div>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border-b border-[#C19A6B]">
                  <AccordionTrigger className="text-left text-lg font-medium text-[#583B1F] hover:text-[#C19A6B]">
                    Como funciona a psicoterapia individual?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#735B43] pt-2">
                    A psicoterapia individual é um processo de autoconhecimento e desenvolvimento pessoal, onde
                    trabalhamos juntos para identificar e superar desafios emocionais, comportamentais e relacionais. As
                    sessões são semanais e têm duração de 50 minutos.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-b border-[#C19A6B]">
                  <AccordionTrigger className="text-left text-lg font-medium text-[#583B1F] hover:text-[#C19A6B]">
                    Qual é a sua abordagem terapêutica?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#735B43] pt-2">
                    Minha abordagem é baseada na <strong>Abordagem Centrada na Pessoa (ACP)</strong>, que valoriza a
                    empatia, a escuta ativa e o respeito pela singularidade de cada indivíduo. Também utilizo técnicas
                    de <strong>Focalização</strong> para ajudar no processo de autoconhecimento e regulação emocional.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-b border-[#C19A6B]">
                  <AccordionTrigger className="text-left text-lg font-medium text-[#583B1F] hover:text-[#C19A6B]">
                    Você atende online?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#735B43] pt-2">
                    Sim, ofereço atendimentos online para maior comodidade e acessibilidade. As sessões são realizadas
                    por plataformas seguras e confiáveis.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-b border-[#C19A6B]">
                  <AccordionTrigger className="text-left text-lg font-medium text-[#583B1F] hover:text-[#C19A6B]">
                    Quanto tempo dura o processo terapêutico?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#735B43] pt-2">
                    A duração do processo terapêutico varia conforme as necessidades e objetivos de cada pessoa. Alguns
                    processos podem durar alguns meses, enquanto outros podem se estender por mais tempo. O importante é
                    respeitar o tempo e o ritmo de cada indivíduo.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-b border-[#C19A6B]">
                  <AccordionTrigger className="text-left text-lg font-medium text-[#583B1F] hover:text-[#C19A6B]">
                    Como agendar uma consulta?
                  </AccordionTrigger>
                  <AccordionContent className="text-[#735B43] pt-2">
                    Você pode agendar uma consulta através do formulário de contato neste site, por telefone ou
                    WhatsApp. Após o contato inicial, agendaremos um horário que seja conveniente para você.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="mt-12 flex justify-center">
              <a
                href="#contato"
                className="px-8 py-3 text-sm bg-[#583B1F] text-[#F8F5F0] hover:bg-[#735B43] transition-colors duration-300 rounded-md"
              >
                Ainda tem dúvidas? Entre em contato
              </a>
            </div>
          </div>
        </section>

        {/* Contato Section - Movida para depois da seção FAQ */}
        <section id="contato" className="py-20 bg-[#F8F5F0]">
          <div className="container mx-auto px-[10%]">
            <h2 className="text-3xl font-light mb-4 text-center text-[#583B1F]">Entre em Contato</h2>
            <p className="text-lg text-[#735B43] mb-12 text-center max-w-2xl mx-auto">
              Agende uma consulta ou tire suas dúvidas.
            </p>

            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-medium mb-6 text-[#583B1F] border-b border-[#C19A6B] pb-2">
                  Envie uma mensagem
                </h3>
                <p className="text-[#735B43] mb-6">Estou aqui para te ouvir e auxiliar em sua jornada</p>
                <ContactForm />
              </div>

              <div>
                <h3 className="text-xl font-medium mb-6 text-[#583B1F] border-b border-[#C19A6B] pb-2">
                  Informações de Contato
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                      <Phone className="h-5 w-5 text-[#F8F5F0]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#583B1F]">Telefone</p>
                      <p className="text-[#735B43]">+55 (85) 98601-3431</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-[#F8F5F0]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#583B1F]">E-mail</p>
                      <p className="text-[#735B43]">contatomarcosdgomes@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#C19A6B] p-3 rounded-full mr-4">
                      <MapPin className="h-5 w-5 text-[#F8F5F0]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#583B1F]">Endereço</p>
                      <p className="text-[#735B43]">Brazil, Fortaleza-CE</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-medium my-6 text-[#583B1F]">Redes Sociais</h3>
                  <div className="flex space-x-4 mb-8">
                    <a
                      href="https://www.facebook.com/psicologodanieldantas"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#583B1F] p-2 rounded-full text-white hover:bg-[#735B43] transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/psidanieldantas"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#583B1F] p-2 rounded-full text-white hover:bg-[#735B43] transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.youtube.com/@psidanieldantas"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#583B1F] p-2 rounded-full text-white hover:bg-[#735B43] transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>
                  </div>

                  <LazyMap />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 bg-[#583B1F] p-4 rounded-full shadow-lg hover:bg-[#735B43] transition-colors z-50 text-white"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-[#583B1F] text-[#F8F5F0] relative">
        <WaveTransition color="#F5F2EE" />
        <div className="container mx-auto px-[10%] py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:text-left text-center flex flex-col items-center md:items-start">
              <div className="mb-6">
                <Image
                  src="/Daniel-Dantas-logo-footer-correta.png"
                  alt="Daniel Dantas - Psicólogo"
                  width={180}
                  height={70}
                  className="w-[180px] h-auto"
                />
              </div>
              <p className="text-sm mb-6">
                Psicoterapia humanizada e acolhedora para ajudar você em sua jornada de autoconhecimento e bem-estar
                emocional.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/psicologodanieldantas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C19A6B] p-2 rounded-full text-white hover:bg-[#D1AA7B] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://www.instagram.com/psidanieldantas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C19A6B] p-2 rounded-full text-white hover:bg-[#D1AA7B] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.youtube.com/@psidanieldantas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C19A6B] p-2 rounded-full text-white hover:bg-[#D1AA7B] transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-light mb-6 border-b border-[#C19A6B] pb-2 inline-block">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#inicio"
                    className="text-sm hover:text-[#C19A6B] transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2">•</span> Início
                  </a>
                </li>
                <li>
                  <a
                    href="#sobre"
                    className="text-sm hover:text-[#C19A6B] transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2">•</span> Sobre
                  </a>
                </li>
                <li>
                  <a
                    href="#servicos"
                    className="text-sm hover:text-[#C19A6B] transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2">•</span> Serviços
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-sm hover:text-[#C19A6B] transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2">•</span> FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="text-sm hover:text-[#C19A6B] transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2">•</span> Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#contato"
                    className="text-sm hover:text-[#C19A6B] transition-colors duration-300 flex items-center"
                  >
                    <span className="mr-2">•</span> Contato
                  </a>
                </li>
                    <li>
      <a
        href="/politica-de-privacidade"
        className="text-sm hover:text-[#C19A6B] transition-colors duration-300 flex items-center"
      >
        <span className="mr-2">•</span> Política de Privacidade
      </a>
    </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-light mb-6 border-b border-[#C19A6B] pb-2 inline-block">Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span>+55 (85) 98601-3431</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span>contatomarcosdgomes@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Brazil, Fortaleza-CE</span>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="#contato"
                  className="flex items-center justify-center px-6 py-3 bg-[#C19A6B] text-[#F8F5F0] hover:bg-[#D1AA7B] transition-colors duration-300 rounded-md"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Agende sua Consulta
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

