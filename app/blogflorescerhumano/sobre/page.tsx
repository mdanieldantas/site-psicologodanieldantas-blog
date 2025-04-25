// app/blogflorescerhumano/sobre/page.tsx
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image'; // Adicionado import do Image
import { supabaseServer } from '@/lib/supabase/server'; // Adicionado import do supabaseServer
import type { Database } from '@/types/supabase'; // Adicionado import do tipo Database

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
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
        Sobre o Blog Florescer Humano
      </h1>

      {/* Seção: Missão e Inspiração */}
      <section className="mb-16 bg-gray-50 p-8 rounded-lg shadow-sm">
        <h2 className="text-3xl font-semibold mb-6 text-teal-700">Nossa Missão e Inspiração</h2>
        <p className="text-lg text-gray-700 mb-6">
          A missão do blog "Florescer Humano" reside em cultivar a compreensão e a vivência dos princípios do humanismo em todas as esferas da existência, oferecendo um jardim de reflexão, aprendizado e encontro. Buscamos valorizar a inteireza do potencial humano, a beleza da experiência íntima, a autonomia de cada indivíduo e o incessante movimento de crescimento pessoal.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          Inspirados pela metáfora do cultivo e do florescimento, queremos adubar o solo da consciência através da sabedoria da psicologia humanista, incentivando seres mais conscientes do que semeiam e colhem em suas jornadas.
        </p>
        <div className="bg-white p-6 rounded border border-gray-200 shadow-inner">
          <h3 className="text-xl font-semibold mb-4 text-gray-600 italic">Sobre Flores, Jardins e Amores</h3>
          <pre className="whitespace-pre-wrap font-serif text-gray-700 text-sm leading-relaxed italic">
            {poemaInspirador}
          </pre>
          <p className="text-right text-xs text-gray-500 mt-4">- Daniel Dantas</p>
        </div>
      </section>

      {/* Seção: Abordagens Teóricas */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 border-b pb-3">Nossas Abordagens</h2>
        <p className="text-lg text-gray-700 mb-6">
          Nosso olhar tem um foco especial na <strong className="font-semibold">Psicologia Humanista</strong>, incluindo a <strong className="font-semibold">Abordagem Centrada na Pessoa (ACP)</strong> de Carl Rogers e a <strong className="font-semibold">Focalização (Focusing)</strong> de Eugene Gendlin. Valorizamos também o intercâmbio de conhecimentos com outras práticas e saberes, como técnicas de <strong className="font-semibold">Mindfulness (Atenção Plena)</strong> e insights da <strong className="font-semibold">Neuropsicologia</strong>, buscando sempre uma compreensão mais integrada do ser humano.
        </p>
        <p className="text-lg text-gray-700">
          Explore nossos artigos por <Link href="/blogflorescerhumano/categorias" legacyBehavior><a className="text-teal-600 hover:text-teal-800 underline">categorias</a></Link> para aprofundar-se nesses temas.
        </p>
      </section>

      {/* Seção: Sobre o Autor */}
      {autor && (
        <section className="mb-16 bg-teal-50 p-8 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-8">
          {autor.foto_arquivo && (
            <div className="flex-shrink-0 w-40 h-40 md:w-48 md:h-48 relative rounded-full overflow-hidden shadow-md border-4 border-white">
              <Image
                // Ajuste o src se a localização for diferente (ex: /blogflorescerhumano/${autor.foto_arquivo})
                // Usando o nome de arquivo conhecido da pasta public
                src={`/${autor.foto_arquivo}`}
                alt={`Foto de ${autor.nome}`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                priority // Adiciona prioridade se for importante carregar rápido
              />
            </div>
          )}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-semibold mb-4 text-teal-800">Sobre o Autor</h2>
            <h3 className="text-2xl font-medium mb-2 text-gray-800">{autor.nome}</h3>
            {autor.biografia && (
              <p className="text-gray-700 mb-4 leading-relaxed">{autor.biografia}</p>
            )}
            {autor.perfil_academico_url && (
              <a
                href={autor.perfil_academico_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-teal-600 hover:text-teal-800 hover:underline transition-colors duration-200"
              >
                Ver perfil
              </a>
            )}
          </div>
        </section>
      )}

      {/* Seção: Contato e Colaboração (Exemplo) */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold mb-6">Conecte-se Conosco</h2>
        <p className="text-lg text-gray-700 mb-6">
          Tem dúvidas, sugestões ou interesse em colaborar? Adoraríamos ouvir você!
        </p>
        <Link href="/blogflorescerhumano/contato" legacyBehavior>
          <a className="inline-block bg-teal-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-teal-700 transition-colors duration-300 shadow-md">
            Entre em Contato
          </a>
        </Link>
      </section>

    </main>
  );
}
