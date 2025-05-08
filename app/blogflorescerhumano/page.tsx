// app/blogflorescerhumano/page.tsx
import React from "react";
import { supabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type { Metadata } from "next";
import ExploreCategoriesGrid from "./components/ExploreCategoriesGrid";
import FeaturedArticles from "./components/FeaturedArticles";
import RecentMaterials from "./components/RecentMaterials";
import AboutTeaserBanner from "./components/AboutTeaserBanner";
import LazyLoadSection from "./components/LazyLoadSection";
import Link from "next/link";
import Image from "next/image";

// --- Metadados Estáticos para a Página Inicial do Blog --- //
export const metadata: Metadata = {
  title: "Blog Florescer Humano | Psicologia Humanista e Autoconhecimento",
  description:
    "Explore artigos sobre autoconhecimento, bem-estar, relacionamentos e crescimento pessoal através da perspectiva da psicologia humanista no Blog Florescer Humano.",
  alternates: {
    canonical: "/blogflorescerhumano",
  },
  // OpenGraph e Twitter podem ser adicionados depois se necessário
};

export default async function BlogHomePage() {
  // Buscar categorias e artigos em destaque
  const [categoriesResponse, articlesResponse] = await Promise.all([
    supabaseServer
      .from("categorias")
      .select("*")
      .order("nome", { ascending: true }),

    supabaseServer
      .from("artigos")
      .select(
        `
        *,
        categorias (
          slug
        )
      `
      )
      .order("data_publicacao", { ascending: false })
      .limit(3),
  ]);

  const { data: categories } = categoriesResponse;
  const { data: featuredArticles } = articlesResponse;

  return (
    <main className="flex-1">
      {" "}
      {/* Hero Section - Layout Moderno com Foto Lado a Lado */}
      <section
        className="relative min-h-[75vh] md:h-[90vh] py-6 md:py-16 bg-gradient-to-br from-[#583B1F]/10 to-[#F8F5F0]/90"
        id="hero-section"
      >
        {/* Padrão texturizado sutil no fundo */}
        <div className="absolute inset-0 opacity-[.25] bg-[url('/blogflorescerhumano/banners-blog/hero-cacto-florecer-humano-mobile-2.png')] md:bg-[url('/blogflorescerhumano/banners-blog/hero-cacto-florecer-humano.png')] bg-cover bg-center"></div>
        {/* Camada sutil para melhorar legibilidade do texto */}
        <div className="absolute inset-0 bg-[#F8F5F0]/30 backdrop-blur-[1px]"></div>
        {/* Container principal com layout flexível */}
        <div className="container mx-auto px-4 h-full flex flex-col-reverse md:flex-row items-center justify-between relative z-10">
          {/* Coluna de texto - à esquerda em desktop */}{" "}
          <div className="w-full md:w-1/2 text-left md:pr-8 mb-6 md:mb-0 mt-8 md:mt-0 animate-[fadeIn_1s_ease_forwards] hero-container">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#583B1F] font-normal mb-2 md:mb-4 font-['Old Roman'] tracking-wide animate-[slideUp_1s_ease_forwards] relative drop-shadow-sm hero-title">
              Blog Florescer Humano
              <span className="absolute left-0 bottom-0 w-20 h-0.5 bg-[#C19A6B] rounded-full mt-2 transform -translate-y-2"></span>
            </h1>
            {/* Subtítulo com nome do profissional */}
            <h2 className="text-lg md:text-xl text-[#583B1F] font-light mb-3 md:mb-8 animate-[slideUp_1s_ease_forwards] delay-100 tracking-wider hero-subtitle">
              por{" "}
              <span className="font-semibold text-[#583B1F] high-contrast-text">
                Psicólogo Daniel Dantas
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-[#583B1F] font-normal leading-relaxed max-w-xl animate-[slideUp_1s_ease_forwards] delay-200 mb-2 md:mb-12 hero-description">
              Explorando o potencial humano através da psicologia humanista.
            </p>
            {/* CTA Button */}{" "}
            <Link
              href="/blogflorescerhumano/artigos"
              className="inline-flex items-center justify-center px-8 py-4 min-h-[48px] min-w-[180px] bg-[#C19A6B] text-white rounded-md hover:bg-[#735B43] transition-all duration-300 transform hover:scale-105 shadow-lg animate-[fadeIn_1s_ease_forwards] delay-400 group touch-target hero-cta"
              aria-label="Explorar todos os artigos do blog"
              role="button"
            >
              Explorar Artigos
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                width="20"
                height="20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
            {/* Assinatura visual */}{" "}
            <div className="hidden md:flex mt-4 md:mt-10 items-center justify-center md:justify-start animate-[fadeIn_1s_ease_forwards] delay-500">
              <div className="h-[2px] w-10 bg-[#C19A6B] mr-4"></div>
              <p className="text-sm text-[#583B1F] italic high-contrast-text">
                Acompanhe essa jornada.
              </p>
            </div>
          </div>{" "}
          {/* Coluna da imagem - à direita em desktop */}{" "}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center mt-0 md:mt-4 mb-0">
            {/* Contêiner do grupo da imagem para animação e padding */}
            <div className="group animate-[fadeIn_1s_ease_forwards] delay-300 content-visibility-auto p-8 relative translate-y-[50px] md:translate-y-0">
              {/* Moldura orgânica com elementos botânicos */}
              <div className="relative z-10 transform transition-all duration-500 md:hover:scale-[1.02]">
                {/* Forma orgânica de fundo */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#C19A6B]/20 to-[#583B1F]/10 rounded-[40%_60%_70%_30%/30%_40%_70%_60%] z-0 animate-[breathe_8s_ease-in-out_infinite_alternate]"></div>
                {/* Container da imagem principal */}
                <div className="relative overflow-hidden shadow-xl z-10 rounded-[35%_65%_65%_35%/25%_30%_70%_75%] border-2 border-[#C19A6B]/20">
                  <div className="w-[280px] h-[320px] md:w-[400px] md:h-[450px] relative">
                    {" "}
                    <Image
                      src="/blogflorescerhumano/banners-blog/hero-psicologo-daniel-dantas-blog.png"
                      alt="Psicólogo Daniel Dantas, autor do blog Florescer Humano que foca em psicologia humanista e autoconhecimento"
                      className="object-cover"
                      fill
                      sizes="(max-width: 480px) 280px, (max-width: 768px) 300px, 400px"
                      priority
                      quality={90}
                      loading="eager"
                    />
                  </div>

                  {/* Efeito de brilho no hover aprimorado */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#C19A6B]/0 via-white/5 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </div>
                {/* Elementos botânicos decorativos */}
                {/* Folha superior esquerda */}{" "}
                <div className="absolute -top-6 -left-6 z-20 animate-[sway_4s_ease-in-out_infinite_alternate] hidden sm:block">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M50,10 C70,25 90,40 70,65 C50,90 30,75 20,60 C10,45 30,30 50,10 Z"
                      fill="none"
                      stroke="#C19A6B"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  </svg>
                </div>
                {/* Folha inferior direita */}
                <div
                  className="absolute -bottom-8 -right-4 z-20 rotate-45 animate-[sway_5s_ease-in-out_infinite_alternate] hidden sm:block"
                  style={{ animationDelay: "-2s" }}
                >
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30,20 C60,5 80,30 75,50 C70,70 40,85 20,70 C0,55 10,30 30,20 Z"
                      fill="none"
                      stroke="#583B1F"
                      strokeWidth="1.5"
                      opacity="0.4"
                    />
                  </svg>
                </div>
                {/* Pequena flor decorativa - apenas exibida em telas maiores para melhorar a performance em mobile */}
                <div
                  className="absolute -bottom-2 -left-8 z-20 animate-pulse hidden sm:block"
                  style={{ animationDuration: "6s" }}
                >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="10"
                      fill="#C19A6B"
                      opacity="0.6"
                    />
                    <path
                      d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z"
                      fill="#C19A6B"
                      opacity="0.4"
                      transform="rotate(0 50 50)"
                    />
                    <path
                      d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z"
                      fill="#C19A6B"
                      opacity="0.4"
                      transform="rotate(72 50 50)"
                    />
                    <path
                      d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z"
                      fill="#C19A6B"
                      opacity="0.4"
                      transform="rotate(144 50 50)"
                    />
                    <path
                      d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z"
                      fill="#C19A6B"
                      opacity="0.4"
                      transform="rotate(216 50 50)"
                    />
                    <path
                      d="M50,30 C55,45 70,50 50,70 C30,50 45,45 50,30 Z"
                      fill="#C19A6B"
                      opacity="0.4"
                      transform="rotate(288 50 50)"
                    />
                  </svg>
                </div>
                {/* Pequena flor na parte superior direita - apenas exibida em telas maiores */}
                <div
                  className="absolute -top-4 right-6 z-20 animate-pulse hidden sm:block"
                  style={{ animationDuration: "7s" }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="8"
                      fill="#583B1F"
                      opacity="0.5"
                    />
                    <path
                      d="M50,35 C53,45 65,50 50,65 C35,50 47,45 50,35 Z"
                      fill="#583B1F"
                      opacity="0.3"
                      transform="rotate(0 50 50)"
                    />
                    <path
                      d="M50,35 C53,45 65,50 50,65 C35,50 47,45 50,35 Z"
                      fill="#583B1F"
                      opacity="0.3"
                      transform="rotate(72 50 50)"
                    />
                    <path
                      d="M50,35 C53,45 65,50 50,65 C35,50 47,45 50,35 Z"
                      fill="#583B1F"
                      opacity="0.3"
                      transform="rotate(144 50 50)"
                    />
                    <path
                      d="M50,35 C53,45 65,50 50,65 C35,50 47,45 50,35 Z"
                      fill="#583B1F"
                      opacity="0.3"
                      transform="rotate(216 50 50)"
                    />
                    <path
                      d="M50,35 C53,45 65,50 50,65 C35,50 47,45 50,35 Z"
                      fill="#583B1F"
                      opacity="0.3"
                      transform="rotate(288 50 50)"
                    />
                  </svg>
                </div>
                {/* Elemento de videira/ramo na lateral - apenas exibido em telas maiores */}
                <div className="absolute top-1/4 -right-10 z-0 hidden md:block">
                  <svg
                    width="60"
                    height="200"
                    viewBox="0 0 60 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30,0 C40,50 20,100 40,150 C50,180 30,200 20,200"
                      stroke="#C19A6B"
                      strokeWidth="1.5"
                      opacity="0.4"
                      fill="none"
                      strokeDasharray="4 3"
                      className="animate-[grow_10s_linear_forwards]"
                    />
                    <circle
                      cx="26"
                      cy="50"
                      r="4"
                      fill="#C19A6B"
                      opacity="0.4"
                    />
                    <circle
                      cx="38"
                      cy="100"
                      r="4"
                      fill="#C19A6B"
                      opacity="0.4"
                    />
                    <circle
                      cx="30"
                      cy="150"
                      r="4"
                      fill="#C19A6B"
                      opacity="0.4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Elementos florais decorativos sutis representando crescimento - apenas visíveis em telas maiores */}
        <div
          className="absolute bottom-24 left-10 md:left-20 opacity-20 animate-pulse hidden md:block"
          style={{ animationDuration: "5s" }}
        >
          <svg
            viewBox="0 0 200 200"
            width="80"
            height="80"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill="#C19A6B"
              d="M45.7,-77.2C58.9,-69.2,69.1,-55.8,76.8,-41.4C84.6,-26.9,89.8,-11.4,88.5,3.5C87.2,18.3,79.3,32.6,70.1,46.5C60.9,60.4,50.4,73.9,37.2,79.9C24,85.9,8.1,84.4,-6,80.8C-20.1,77.2,-32.3,71.4,-44.7,64.2C-57.1,57,-69.6,48.3,-75.8,36.6C-82,24.9,-81.8,10.1,-77.4,-2.5C-73.1,-15.1,-64.5,-25.5,-56.6,-36C-48.7,-46.5,-41.5,-57.1,-31.5,-66.7C-21.6,-76.3,-8.7,-84.8,4.2,-91.6C17,-98.4,32.5,-85.3,45.7,-77.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div
          className="absolute top-20 right-10 md:right-20 opacity-15 animate-pulse hidden md:block"
          style={{ animationDuration: "3s" }}
        >
          <svg
            viewBox="0 0 200 200"
            width="60"
            height="60"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill="#583B1F"
              d="M47.7,-73.2C62.8,-69.3,76.9,-58.9,83.5,-44.6C90,-30.4,89,-12.3,86.5,5.1C84.1,22.4,80.2,39.1,71.6,53.1C63.1,67.2,50,78.6,34.8,82.5C19.6,86.3,2.3,82.7,-13.7,78.2C-29.8,73.6,-44.6,68,-57.5,58.3C-70.4,48.6,-81.2,34.7,-82.9,19.7C-84.6,4.7,-77.1,-11.4,-69.7,-26.4C-62.3,-41.4,-55,-55.3,-43.6,-60.8C-32.2,-66.2,-16.1,-63.2,0.2,-63.5C16.5,-63.8,32.9,-77.2,47.7,-73.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        {/* Seta indicativa de scroll com animação melhorada */}{" "}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center animate-[fadeIn_1s_ease_forwards] delay-600 will-change-transform">
          <button
            aria-label="Rolar para ver mais conteúdo"
            className="w-12 h-18 text-[#C19A6B] animate-bounce cursor-pointer hover:text-[#735B43] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C19A6B] focus:ring-opacity-50 rounded-full min-h-[48px] min-w-[48px] touch-target"
            id="scroll-indicator-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full drop-shadow-md"
              aria-hidden="true"
              width="24"
              height="24"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
        {/* Gradiente de transição na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F5F0] to-transparent" />
      </section>{" "}
      <div className="space-y-12 bg-[#F8F5F0]">
        {/* Artigos em Destaque - Carregados prioritariamente */}
        {featuredArticles && featuredArticles.length > 0 && (
          <FeaturedArticles articles={featuredArticles} />
        )}

        {/* Grid de Categorias - Carregamento lazy em dispositivos móveis */}
        {categories && categories.length > 0 && (
          <LazyLoadSection
            mobileOnly={true}
            threshold={0.1}
            id="categorias-section"
            className="w-full"
            delay={200}
          >
            <ExploreCategoriesGrid categories={categories} />
          </LazyLoadSection>
        )}

        {/* Materiais Recentes - Carregamento lazy em dispositivos móveis */}
        <LazyLoadSection
          mobileOnly={true}
          threshold={0.1}
          id="materiais-recentes-section"
          className="w-full"
          delay={300}
        >
          <RecentMaterials />
        </LazyLoadSection>

        {/* Banner Sobre Nós - Carregamento lazy em dispositivos móveis */}
        <LazyLoadSection
          mobileOnly={true}
          threshold={0.1}
          id="about-teaser-section"
          className="w-full"
          delay={400}
        >
          <AboutTeaserBanner />
        </LazyLoadSection>
      </div>
    </main>
  );
}
