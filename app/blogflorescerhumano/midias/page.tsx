// Página de Mídias Recomendadas do Blog
// Localização: app/blogflorescerhumano/midias/page.tsx
import { Metadata } from 'next';

// Metadados dinâmicos para SEO (Next.js App Router)
import { ResolvingMetadata } from 'next';

export async function generateMetadata(
  _props: any,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Mídias Recomendadas | Blog Florescer Humano',
    description: 'Descubra livros, filmes, documentários e outras mídias que inspiram o autoconhecimento e o bem-estar.',
    alternates: {
      canonical: '/blogflorescerhumano/midias',
    },
    openGraph: {
      title: 'Mídias Recomendadas | Blog Florescer Humano',
      description: 'Descubra livros, filmes, documentários e outras mídias que inspiram o autoconhecimento e o bem-estar.',
      url: '/blogflorescerhumano/midias',
      siteName: 'Blog Florescer Humano',
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Mídias Recomendadas | Blog Florescer Humano',
      description: 'Descubra livros, filmes, documentários e outras mídias que inspiram o autoconhecimento e o bem-estar.',
    },
  };
}

// Componente da página de Mídias
export default function MidiasPage() {
  return (
    // O div principal pode ser simplificado, pois o layout pai já cuida do min-h-screen e flex-col
    <div className="bg-gray-50">
      {/* Conteúdo principal da página */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-gray-800">
          Mídias Recomendadas
        </h1>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Em breve, compartilharemos aqui recomendações de livros, filmes, documentários, podcasts e outras mídias que dialogam com os temas do Florescer Humano e podem enriquecer sua jornada.
        </p>

        {/* Placeholder indicando que o conteúdo está em desenvolvimento */}
        <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Seleção em Andamento</h2>
          <p className="text-gray-500">
            Estamos curando uma lista de mídias inspiradoras para você. Volte em breve!
          </p>
        </div>

        {/* Espaço para futuro conteúdo listado (ex: cards de livros, links para trailers) */}
        {/*
          Exemplo de como poderia ser a estrutura futura:
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            // Card para um livro
            <div className="border rounded-lg p-4 bg-white shadow">
              <h3 className="text-xl font-semibold mb-2">Título do Livro</h3>
              <p className="text-gray-600 mb-4">Breve descrição ou motivo da recomendação...</p>
              <a href="#" className="text-blue-600 hover:underline">Ver mais/Onde encontrar</a>
            </div>
            // Outros cards...
          </div>
        */}
      </main>
    </div>
  );
}
