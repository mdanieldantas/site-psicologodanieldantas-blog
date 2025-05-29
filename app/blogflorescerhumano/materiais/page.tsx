// Página de Materiais do Blog
// Localização: app/blogflorescerhumano/materiais/page.tsx
import { Metadata } from 'next';
import { ChevronRight, Home, BookOpen, FileText, Video, Headphones } from 'lucide-react';
import BannerImage from '../components/BannerImage';

// Metadados dinâmicos para SEO (Next.js App Router)
import { ResolvingMetadata } from 'next';

export async function generateMetadata(
  _props: any,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Materiais | Blog Florescer Humano',
    description: 'Explore nossos e-books, guias, vídeos e outros recursos sobre psicologia humanista, autoconhecimento e bem-estar.',
    alternates: {
      canonical: '/blogflorescerhumano/materiais',
    },
    openGraph: {
      title: 'Materiais | Blog Florescer Humano',
      description: 'Explore nossos e-books, guias, vídeos e outros recursos sobre psicologia humanista, autoconhecimento e bem-estar.',
      url: '/blogflorescerhumano/materiais',
      siteName: 'Blog Florescer Humano',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Materiais | Blog Florescer Humano',
      description: 'Explore nossos e-books, guias, vídeos e outros recursos sobre psicologia humanista, autoconhecimento e bem-estar.',
    },
  };
}

// Componente da página de Materiais
export default function MateriaisPage() {
  return (
    <div className="bg-[#F8F5F0] min-h-screen">      {/* Hero Banner Section - Seguindo padrão de categorias */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden bg-[#583B1F]/10">
        {/* Banner Image */}
        <BannerImage 
          bannerPath="/blogflorescerhumano/banners-blog/banner-materiais.webp"
          fallbackPath="/blogflorescerhumano/banners-blog/banner-default.webp"
          alt="Banner de Materiais e Recursos do Blog Florescer Humano"
        />
        
        {/* Hero Content Overlay com gradiente melhorado */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/80 via-[#583B1F]/30 to-transparent" />
        
        {/* Conteúdo centralizado */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000 max-w-4xl">
            {/* Linha decorativa superior */}
            <div className="w-16 h-1 bg-[#A57C3A] mx-auto mb-6 rounded-full"></div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg font-['Old_Roman']">
              Materiais e Recursos
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Explore nossos e-books, guias, vídeos e outros recursos sobre psicologia humanista
            </p>
            
            {/* Linha decorativa inferior */}
            <div className="w-16 h-1 bg-[#A57C3A] mx-auto mt-6 rounded-full"></div>
          </div>
        </div>
      </section>      {/* Breadcrumb Navigation */}
      <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#C19A6B]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>              <a 
                href="/" 
                className="flex items-center text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                <Home className="h-4 w-4 mr-1" />
                Início
              </a>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li>
              <a 
                href="/blogflorescerhumano" 
                className="text-[#735B43] hover:text-[#C19A6B] transition-colors duration-200"
              >
                Blog
              </a>
            </li>
            <ChevronRight className="h-4 w-4 text-[#735B43]/60" />
            <li className="text-[#583B1F] font-medium">
              Materiais
            </li>
          </ol>
        </div>
      </nav>      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 pt-8">{/* Seção de preparação */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-500">
          <div className="max-w-4xl mx-auto bg-white rounded-xl border-2 border-dashed border-[#C19A6B] p-12 shadow-lg">
            <div className="mb-8">
              <div className="w-20 h-20 bg-[#E8E6E2] rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-[#A57C3A]" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#583B1F] mb-4">
                Conteúdo em Preparação
              </h2>
              <p className="text-lg text-[#7D6E63] font-sans leading-relaxed">
                Estamos trabalhando para trazer materiais valiosos para você. Volte em breve!
              </p>
            </div>
          </div>
        </div>        {/* Prévia dos tipos de materiais futuros */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
          <h3 className="text-2xl font-serif font-bold text-[#583B1F] text-center mb-12">
            O que você encontrará aqui
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">            {/* E-books */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-[#E8E6E2] hover:shadow-lg transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4"
                 style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
              <div className="w-12 h-12 bg-[#E8E6E2] rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-[#6B7B3F]" />
              </div>
              <h4 className="text-lg font-serif font-semibold text-[#583B1F] mb-2">
                E-books
              </h4>
              <p className="text-[#7D6E63] font-sans text-sm">
                Guias práticos e materiais de apoio para sua jornada de autoconhecimento.
              </p>
            </div>            {/* Guias */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-[#E8E6E2] hover:shadow-lg transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4"
                 style={{ animationDelay: '900ms', animationFillMode: 'both' }}>
              <div className="w-12 h-12 bg-[#E8E6E2] rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-[#A57C3A]" />
              </div>
              <h4 className="text-lg font-serif font-semibold text-[#583B1F] mb-2">
                Guias Práticos
              </h4>
              <p className="text-[#7D6E63] font-sans text-sm">
                Referências e exercícios estruturados para desenvolvimento pessoal.
              </p>
            </div>            {/* Vídeos */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-[#E8E6E2] hover:shadow-lg transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4"
                 style={{ animationDelay: '1000ms', animationFillMode: 'both' }}>
              <div className="w-12 h-12 bg-[#E8E6E2] rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-[#6B7B3F]" />
              </div>
              <h4 className="text-lg font-serif font-semibold text-[#583B1F] mb-2">
                Vídeos
              </h4>
              <p className="text-[#7D6E63] font-sans text-sm">
                Conteúdos audiovisuais selecionados sobre psicologia humanista.
              </p>
            </div>            {/* Podcasts */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-[#E8E6E2] hover:shadow-lg transition-all duration-300 animate-in fade-in zoom-in-95 slide-in-from-bottom-4"
                 style={{ animationDelay: '1100ms', animationFillMode: 'both' }}>
              <div className="w-12 h-12 bg-[#E8E6E2] rounded-lg flex items-center justify-center mb-4">
                <Headphones className="h-6 w-6 text-[#A57C3A]" />
              </div>
              <h4 className="text-lg font-serif font-semibold text-[#583B1F] mb-2">
                Podcasts
              </h4>
              <p className="text-[#7D6E63] font-sans text-sm">
                Episódios e conversas inspiradoras sobre bem-estar e crescimento.
              </p>
            </div>
          </div>
        </div>        {/* Chamada para ação */}
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1200">
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-[#583B1F] to-[#5B3E22] rounded-xl p-8 text-white">
            <h3 className="text-2xl font-serif font-bold mb-4">
              Fique por dentro das novidades
            </h3>
            <p className="text-white/90 font-sans mb-6 leading-relaxed">
              Seja o primeiro a saber quando nossos materiais estiverem disponíveis. Acompanhe nossas redes sociais e blog para não perder nenhuma atualização.
            </p>            <a 
              href="/blogflorescerhumano"
              className="inline-flex items-center bg-white text-[#583B1F] px-6 py-3 rounded-lg font-sans font-medium hover:bg-[#F8F5F0] transition-colors duration-200"
            >
              Explorar Blog
              <ChevronRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
