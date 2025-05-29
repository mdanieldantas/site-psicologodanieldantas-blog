// app/blogflorescerhumano/sobre/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseServer } from '@/lib/supabase/server'; 
import type { Database } from '@/types/supabase'; 
import BannerImage from '../components/BannerImage';
import ButtonBlog from '../components/ButtonBlog';

// --- Metadados para a Página Sobre --- //
export const metadata: Metadata = {
  title: 'Sobre o Blog Florescer Humano | Psicologia Humanista e Autoconhecimento',
  description: 'Conheça a missão, visão, valores e o autor por trás do Blog Florescer Humano, um espaço dedicado à psicologia humanista, autoconhecimento e bem-estar.',
  alternates: {
    canonical: '/blogflorescerhumano/sobre',
  },
  openGraph: {
    title: 'Sobre o Blog Florescer Humano',
    description: 'Descubra o propósito e a inspiração do Blog Florescer Humano.',
    url: '/blogflorescerhumano/sobre',
    siteName: 'Blog Florescer Humano',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sobre o Blog Florescer Humano',
    description: 'Descubra o propósito e a inspiração do Blog Florescer Humano.',
  },
};

// Poema Inspirador (do documento)
const poemaInspirador = `
É preciso amar as flores, caminhar nos jardins
Cultivar afetos, irrigar amores

É preciso vida para acolher a morte de cada dia
Nesse solo adubado, renascer em flores de si

Fertilidade dos sonhos que teimam em renascer
Cultivar vida, transcender, reviver, reinventar-se

É preciso uma poética dos cultivos e das colheitas
Consciência do que se planta e se colhe

É preciso um ativismo dos jardins
Pelas flores, amores e dores

Um ativismo das danças, flores e contemplações

Do que se busca ao se buscar nada
Do que se ganha ao simplesmente ser
Do sorriso que brota

Das sementes em terras áridas
Dos solos férteis de lágrimas e sonhos
Das flores que germinam, florescem e dão frutos

Dos pés na terra macia e húmida
Das raízes e do enraizar

Mas também é preciso lutar
E se saber pelo que se luta

Um ativismo dos cultivos dos grãos e raízes
E saber o que se é, e o que se busca

Da poesia que se quer cultivar
Das diferentes formas de amar
Das cirandas ao luar
Do pé enraizado
Do chão

Da firmeza e gentileza
Dos afetos e flores
E sim das flores. Flores, jardins e amores

E sim, é preciso cultivar
Tudo pelo que se vale a pena lutar
`;

// Define o tipo Autor
type Autor = Database['public']['Tables']['autores']['Row'];

// Marca a função como async
export default async function SobrePage() {
  // --- Busca de Dados do Autor Principal --- //
  // Assumindo que Daniel Dantas é o autor com id=1 ou um nome específico
  const { data: autor, error: autorError } = await supabaseServer
    .from('autores')
    .select('*')
    .eq('nome', 'Daniel Dantas') // Ou use .eq('id', 1) se souber o ID
    .single<Autor>();

  if (autorError) {
    console.error('Erro ao buscar autor:', autorError);
    // Considerar retornar uma mensagem de erro ou um estado diferente aqui
  }
  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Hero Banner Section */}      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <BannerImage
          bannerPath="/blogflorescerhumano/banners-blog/banner-sobre-mulher-filho.webp"
          fallbackPath="/blogflorescerhumano/banners-blog/hero-home-banner.webp"
          alt="Banner Sobre o Blog Florescer Humano"
        />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#583B1F]/70 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <div className="animate-in fade-in zoom-in-75 slide-in-from-top-4 duration-1000">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg font-['Old_Roman']">
              Sobre o Blog
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Conheça nossa história, missão e os valores que guiam o Florescer Humano
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <nav className="bg-[#F8F5F0]/80 backdrop-blur-sm border-b border-[#A57C3A]/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="flex items-center text-[#7D6E63] hover:text-[#A57C3A] transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Início
              </Link>
            </li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li>
              <Link 
                href="/blogflorescerhumano" 
                className="text-[#7D6E63] hover:text-[#A57C3A] transition-colors duration-200"
              >
                Blog
              </Link>
            </li>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#735B43]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <li className="text-[#583B1F] font-medium">
              Sobre
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12 mt-4">
        {/* Stats Section REMOVIDA */}
        
        {/* Seção: Missão e Inspiração */}        <section className="mb-16 bg-white p-8 rounded-xl shadow-lg border border-[#A57C3A]/20">
          <h2 className="text-3xl font-['Old_Roman'] mb-6 text-[#583B1F] border-b border-[#A57C3A]/20 pb-3">Nossa Missão e Inspiração</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>              <h3 className="text-xl font-medium mb-3 text-[#583B1F] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#A57C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Missão
              </h3>
              <p className="text-[#735B43]">
                A missão do blog "Florescer Humano" reside em cultivar a compreensão e a vivência dos princípios do humanismo em todas as esferas da existência, oferecendo um jardim de reflexão, aprendizado e encontro. Buscamos valorizar a inteireza do potencial humano, a beleza da experiência íntima, a autonomia de cada indivíduo e o incessante movimento de crescimento pessoal.
              </p>
            </div>
            <div>              <h3 className="text-xl font-medium mb-3 text-[#583B1F] flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#A57C3A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Valores
              </h3>
              <ul className="list-disc list-inside text-[#735B43] space-y-2">
                <li>Respeito pela experiência subjetiva</li>
                <li>Valorização do potencial humano</li>
                <li>Compromisso com a autenticidade</li>
                <li>Acolhimento da diversidade</li>
                <li>Promoção da autonomia e crescimento</li>
              </ul>
            </div>
          </div>
          
          <p className="text-lg text-[#735B43] mb-8">
            Inspirados pela metáfora do cultivo e do florescimento, queremos adubar o solo da consciência através da sabedoria da psicologia humanista, incentivando seres mais conscientes do que semeiam e colhem em suas jornadas.
          </p>
            <div className="relative overflow-hidden bg-white rounded-xl shadow-lg border border-[#A57C3A]/30 transform transition-all hover:shadow-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Coluna da imagem - visível apenas em telas maiores */}
            <div className="hidden lg:block lg:w-1/2 relative">
              <Image
                src="/blogflorescerhumano/sobre-poema-mae-filho.webp"
                alt="Mãe e filho compartilhando um momento de conexão"
                className="object-cover h-full"
                fill
                sizes="(max-width: 1024px) 0px, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#583B1F]/10"></div>
            </div>
            
            {/* Coluna do poema */}
            <div className="lg:w-1/2 p-8 lg:p-10">
              {/* Versão pequena da imagem para mobile - visível apenas em telas menores */}
              <div className="lg:hidden relative h-48 mb-6 rounded-lg overflow-hidden">
                <Image
                  src="/blogflorescerhumano/sobre-poema-mae-filho.webp"
                  alt="Mãe e filho compartilhando um momento de conexão"
                  className="object-cover"
                  fill
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#583B1F]/10"></div>
              </div>
              
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#A57C3A]/20 absolute -top-4 -left-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h10zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z"/>
                </svg>
                
                <h3 className="text-2xl font-['Old_Roman'] mb-6 text-[#583B1F] relative">
                  Sobre Flores, Jardins e Amores
                </h3>
                
                <div className="prose prose-sm max-w-none prose-p:text-[#735B43] prose-p:my-1 font-serif">
                  <pre className="whitespace-pre-wrap text-[#735B43] leading-relaxed italic text-base not-prose bg-transparent border-0 p-0">
                    {poemaInspirador}
                  </pre>
                </div>
                
                <div className="mt-6 text-right">
                  <p className="text-sm text-[#735B43]/80 italic font-['Old_Roman']">- Daniel Dantas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção: Abordagens Teóricas */}      <section className="mb-16 bg-white p-8 rounded-xl shadow-lg border border-[#A57C3A]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
        <h2 className="text-3xl font-['Old_Roman'] mb-6 text-[#583B1F] border-b border-[#A57C3A]/20 pb-3">Nossas Abordagens</h2>
        <p className="text-lg text-[#735B43] mb-6">
          Nosso olhar tem um foco especial na <strong className="font-semibold text-[#583B1F]">Psicologia Humanista</strong>, incluindo a <strong className="font-semibold text-[#583B1F]">Abordagem Centrada na Pessoa (ACP)</strong> de Carl Rogers e a <strong className="font-semibold text-[#583B1F]">Focalização (Focusing)</strong> de Eugene Gendlin. Valorizamos também o intercâmbio de conhecimentos com outras práticas e saberes, como técnicas de <strong className="font-semibold text-[#583B1F]">Mindfulness (Atenção Plena)</strong> e insights da <strong className="font-semibold text-[#583B1F]">Neuropsicologia</strong>, buscando sempre uma compreensão mais integrada do ser humano.
        </p>
        <p className="text-lg text-[#735B43]">
          Explore nossos artigos por <Link href="/blogflorescerhumano/categorias" className="text-[#A57C3A] font-medium hover:text-[#583B1F] transition-colors duration-200">categorias</Link> para aprofundar-se nesses temas.
        </p>
      </section>      {/* Seção: Sobre o Autor */}
      {autor && (        <section className="mb-16 bg-white p-8 rounded-xl shadow-lg border border-[#A57C3A]/20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
          <h2 className="text-3xl font-['Old_Roman'] mb-8 text-[#583B1F] text-center border-b border-[#A57C3A]/20 pb-3">Sobre o Autor</h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 relative rounded-full overflow-hidden shadow-md border-4 border-[#F8F5F0] group">
              <Image
                src={autor.foto_arquivo 
                  ? `/blogflorescerhumano/autores/${autor.foto_arquivo}` 
                  : "/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"}
                alt={`Foto de ${autor.nome}`}
                fill
                sizes="(max-width: 768px) 160px, 192px"
                style={{
                  objectFit: 'cover',
                }}
                className="rounded-full transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 rounded-full border-8 border-[#A57C3A]/10 group-hover:border-[#A57C3A]/30 transition-all duration-500"></div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h3 className="text-2xl font-medium mb-2 text-[#583B1F]">{autor.nome}</h3>
              
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                <span className="bg-[#F8F5F0] text-[#583B1F] px-3 py-1 rounded-full text-sm font-medium">Psicólogo</span>
                <span className="bg-[#F8F5F0] text-[#583B1F] px-3 py-1 rounded-full text-sm font-medium">Abordagem Centrada na Pessoa</span>
                <span className="bg-[#F8F5F0] text-[#583B1F] px-3 py-1 rounded-full text-sm font-medium">Focalização</span>
              </div>
              
              {autor.biografia && (
                <p className="text-[#735B43] mb-6 leading-relaxed">{autor.biografia}</p>
              )}
              
              <div className="border-t border-[#A57C3A]/20 pt-6 mt-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <a
                    href="https://psicologodanieldantas.com.br/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#583B1F] text-white px-6 py-2.5 rounded-full hover:bg-[#735B43] transition-colors duration-300 group"
                  >
                    <span>Visite o site oficial</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  

                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Seção: Contato e Colaboração */}
      <section className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-[#A57C3A]/20 max-w-2xl mx-auto">
          <h2 className="text-3xl font-['Old_Roman'] mb-6 text-[#583B1F]">Conecte-se Conosco</h2>
          <p className="text-lg text-[#735B43] mb-6">
            Tem dúvidas, sugestões ou interesse em colaborar? Adoraríamos ouvir você!
          </p>
          
          <Link href="/blogflorescerhumano/contato">
            <ButtonBlog
              variant="primary"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-lg group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
              </svg>
              Entre em Contato
            </ButtonBlog>
          </Link>
        </div>
      </section>
      
      </main>
    </div>
  );
}
