// app/blogflorescerhumano/page.tsx
import React from "react";
import { supabaseServer } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import type { Metadata } from "next";
import ExploreCategoriesGrid from "./components/ExploreCategoriesGrid";
import FeaturedArticles from "./components/FeaturedArticles";
import RecentMaterials from "./components/RecentMaterials";
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
      <section className="relative h-screen md:h-[90vh] bg-gradient-to-br from-[#583B1F]/10 to-[#F8F5F0]/90">
        {/* Padrão texturizado sutil no fundo */}
        <div className="absolute inset-0 opacity-[.25] bg-[url('/blogflorescerhumano/banners-blog/hero-cacto-florecer-humano.png')] bg-cover bg-center"></div>

        {/* Camada sutil para melhorar legibilidade do texto */}
        <div className="absolute inset-0 bg-[#F8F5F0]/15 backdrop-blur-[1px]"></div>
        
        {/* Container principal com layout flexível */}
        <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between relative z-10">
          {/* Coluna de texto - à esquerda em desktop */}
          <div className="w-full md:w-1/2 text-left md:pr-8 mb-8 md:mb-0 mt-16 sm:mt-12 md:mt-0 animate-[fadeIn_1s_ease_forwards]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#583B1F] font-normal mb-2 font-['Old Roman'] tracking-wide animate-[slideUp_1s_ease_forwards] relative drop-shadow-sm">
              Florescer Humano
              <span className="absolute left-0 bottom-0 w-20 h-0.5 bg-[#C19A6B] rounded-full mt-2 transform -translate-y-2"></span>
            </h1>
            
            {/* Subtítulo com nome do profissional */}
            <h2 className="text-xl md:text-2xl text-[#583B1F]/80 font-light mb-6 animate-[slideUp_1s_ease_forwards] delay-100 tracking-wider">
              por <span className="font-semibold text-[#583B1F]">Psicólogo Daniel Dantas</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-[#583B1F]/90 font-normal leading-relaxed max-w-xl animate-[slideUp_1s_ease_forwards] delay-200 mb-8">
              Explorando o potencial humano através da psicologia humanista.
            </p>

            {/* CTA Button */}
            <Link
              href="/blogflorescerhumano/artigos"
              className="inline-flex items-center px-8 py-3 bg-[#C19A6B] text-white rounded-md hover:bg-[#735B43] transition-all duration-300 transform hover:scale-105 shadow-lg animate-[fadeIn_1s_ease_forwards] delay-400 group"
            >
              Explorar Artigos
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
            
            {/* Assinatura visual */}
            <div className="mt-8 flex items-center animate-[fadeIn_1s_ease_forwards] delay-500">
              <div className="h-[2px] w-10 bg-[#C19A6B] mr-4"></div>
              <p className="text-sm text-[#583B1F]/70 italic">
                Acompanhe minha jornada de compartilhamento de conhecimento
              </p>
            </div>
          </div>

          {/* Coluna da imagem - à direita em desktop */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center">
            <div className="relative group animate-[fadeIn_1s_ease_forwards] delay-300">
              {/* Container da imagem com efeitos de fluídez */}
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl border-2 border-[#C19A6B]/20 transform transition-all duration-500 md:hover:scale-[1.02] bg-gradient-to-b from-[#F8F5F0]/5 to-transparent">
                <div className="w-[300px] h-[350px] md:w-[400px] md:h-[450px] relative">
                  <Image
                    src="/blogflorescerhumano/banners-blog/hero-psicologo-daniel-dantas-blog.png"
                    alt="Psicólogo Daniel Dantas"
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 300px, 400px"
                    priority
                    quality={95}                  />
                </div>

                {/* Efeito de brilho no hover aprimorado */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#C19A6B]/0 via-white/5 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              {/* Elementos decorativos representando crescimento */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-[#C19A6B]/40 z-0"></div>              <div className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-[#C19A6B]/30 z-0"></div>
              
              <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="text-[#C19A6B]/40"
                >
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Elementos florais decorativos sutis representando crescimento */}
        <div className="absolute bottom-24 left-10 md:left-20 opacity-20 animate-pulse" style={{ animationDuration: "5s" }}>
          <svg
            viewBox="0 0 200 200"
            width="80"
            height="80"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#C19A6B"
              d="M45.7,-77.2C58.9,-69.2,69.1,-55.8,76.8,-41.4C84.6,-26.9,89.8,-11.4,88.5,3.5C87.2,18.3,79.3,32.6,70.1,46.5C60.9,60.4,50.4,73.9,37.2,79.9C24,85.9,8.1,84.4,-6,80.8C-20.1,77.2,-32.3,71.4,-44.7,64.2C-57.1,57,-69.6,48.3,-75.8,36.6C-82,24.9,-81.8,10.1,-77.4,-2.5C-73.1,-15.1,-64.5,-25.5,-56.6,-36C-48.7,-46.5,-41.5,-57.1,-31.5,-66.7C-21.6,-76.3,-8.7,-84.8,4.2,-91.6C17,-98.4,32.5,-85.3,45.7,-77.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div
          className="absolute top-20 right-10 md:right-20 opacity-15 animate-pulse"
          style={{ animationDuration: "3s" }}
        >
          <svg
            viewBox="0 0 200 200"
            width="60"
            height="60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#583B1F"
              d="M47.7,-73.2C62.8,-69.3,76.9,-58.9,83.5,-44.6C90,-30.4,89,-12.3,86.5,5.1C84.1,22.4,80.2,39.1,71.6,53.1C63.1,67.2,50,78.6,34.8,82.5C19.6,86.3,2.3,82.7,-13.7,78.2C-29.8,73.6,-44.6,68,-57.5,58.3C-70.4,48.6,-81.2,34.7,-82.9,19.7C-84.6,4.7,-77.1,-11.4,-69.7,-26.4C-62.3,-41.4,-55,-55.3,-43.6,-60.8C-32.2,-66.2,-16.1,-63.2,0.2,-63.5C16.5,-63.8,32.9,-77.2,47.7,-73.2Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        {/* Seta indicativa de scroll com animação melhorada */}
        <div className="absolute bottom-12 left-0 right-0 z-10 flex justify-center animate-[fadeIn_1s_ease_forwards] delay-600">
          <button 
            aria-label="Rolar para ver mais conteúdo" 
            className="w-8 h-16 text-[#C19A6B] animate-bounce cursor-pointer hover:text-[#735B43] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#C19A6B] focus:ring-opacity-50 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full drop-shadow-md"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
        {/* Gradiente de transição na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8F5F0] to-transparent" />
      </section>
      <div className="space-y-12 bg-[#F8F5F0]">
        {/* Artigos em Destaque */}
        {featuredArticles && featuredArticles.length > 0 && (
          <FeaturedArticles articles={featuredArticles} />
        )}

        {/* Grid de Categorias */}
        {categories && categories.length > 0 && (
          <ExploreCategoriesGrid categories={categories} />
        )}

        {/* Materiais Recentes */}
        <RecentMaterials />
      </div>
    </main>
  );
}
