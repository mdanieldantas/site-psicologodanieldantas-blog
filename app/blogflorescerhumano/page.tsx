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
import ScrollToFeaturedButton from "./components/ScrollToFeaturedButton";

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
      .order("nome", { ascending: true }),    supabaseServer
      .from("artigos")
      .select(
        `
        *,
        categorias (
          slug
        ),
        tags (
          id,
          nome,
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
    <main className="flex-1 bg-[#F8F5F0]">      {/* Hero Section - Layout Moderno e Elegante */}
      <section
        className="relative min-h-[80vh] md:h-[90vh] py-8 md:py-16 bg-gradient-to-br from-white to-[#F8F5F0]"
        id="hero-section"
      >        {/* Background image com transparência balanceada para estética e legibilidade */}
        <div className="absolute inset-0 opacity-80 bg-[url('/blogflorescerhumano/banners-blog/hero-home-banner.webp')] bg-cover bg-center bg-no-repeat scale-90 md:scale-100 transform origin-center"></div>
        
        {/* Overlay sutil para garantir legibilidade sem perder a estética da imagem */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/20 to-white/10"></div>
        
        {/* Container principal */}
        <div className="container mx-auto px-6 h-full flex flex-col-reverse md:flex-row items-center justify-between relative z-10 max-w-6xl">
          {/* Coluna de texto */}
          <div className="w-full md:w-1/2 text-left md:pr-12 mb-8 md:mb-0 mt-8 md:mt-0">
            {/* Badge de identificação */}
            <div className="inline-flex items-center bg-[#E6F4EA] text-[#583B1F] px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-[#6B8E23]/20">
              <svg className="w-4 h-4 mr-2 text-[#6B8E23]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Psicologia Humanista
            </div>

            {/* Título principal com barra verde */}
            <div className="flex items-start mb-4">
              <div className="w-1 h-20 bg-[#6B8E23] rounded-r mr-4 flex-shrink-0"></div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#583B1F] font-serif font-normal leading-tight">
                  Blog Florescer
                  <br />
                  <span className="text-[#6B8E23] font-medium">Humano</span>
                </h1>
              </div>
            </div>

            {/* Subtítulo profissional */}
            <div className="mb-6 pl-5">
              <p className="text-lg md:text-xl text-[#583B1F]/80 font-light tracking-wide">
                por <span className="font-semibold text-[#583B1F]">Psicólogo Daniel Dantas</span>
              </p>
              <div className="w-16 h-0.5 bg-[#A57C3A] mt-2"></div>
            </div>

            {/* Descrição principal */}
            <p className="text-xl md:text-2xl text-[#583B1F]/90 font-light leading-relaxed max-w-lg mb-8 pl-5">
              Explorando o potencial humano através da psicologia humanista e do autoconhecimento.
            </p>

            {/* Botões de ação */}
            <div className="flex flex-col sm:flex-row gap-4 pl-5">
              <Link
                href="/blogflorescerhumano/artigos"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#583B1F] text-white rounded-xl hover:bg-[#6B8E23] transition-all duration-300 transform hover:scale-105 shadow-lg font-medium group"
              >
                Explorar Artigos
                <svg
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <Link
                href="/blogflorescerhumano/categorias"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#583B1F] rounded-xl border-2 border-[#A57C3A] hover:bg-[#F8F5F0] transition-all duration-300 font-medium"
              >
                Ver Categorias
              </Link>
            </div>

            {/* Estatísticas ou destaques */}
            <div className="flex items-center gap-8 mt-8 pl-5 text-sm text-[#583B1F]/70">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#6B8E23] rounded-full mr-2"></div>
                Artigos semanais
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#A57C3A] rounded-full mr-2"></div>
                Conteúdo gratuito
              </div>
            </div>
          </div>{" "}          {/* Coluna da imagem */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center">
            <div className="relative group">
              {/* Container da imagem com moldura elegante */}              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-[#A57C3A]/20 transform transition-all duration-500 hover:scale-105">
                {/* Elementos decorativos */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#6B7B3F]/20 rounded-full z-10"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#6B7B3F] rounded-full z-10"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#A57C3A]/30 rounded-full z-10"></div>
                  {/* Imagem principal */}
                <div className="w-[300px] h-[350px] md:w-[400px] md:h-[450px] relative">
                  <Image
                    src="/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
                    alt="Psicólogo Daniel Dantas, autor do Blog Florescer Humano"
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 300px, 400px"
                    priority
                    quality={90}
                    loading="eager"
                  />
                  
                  {/* Overlay sutil para melhorar integração com o design */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/10 via-transparent to-transparent"></div>
                  
                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ScrollToFeaturedButton className="w-8 h-8 text-[#6B8E23] hover:text-[#583B1F] transition-colors cursor-pointer">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </ScrollToFeaturedButton>
        </div>
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
