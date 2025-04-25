// Página de Materiais do Blog
// Localização: app/blogflorescerhumano/materiais/page.tsx
import { Metadata } from 'next';

// Define os metadados da página para SEO
export const metadata: Metadata = {
  title: 'Materiais | Blog Florescer Humano',
  description: 'Explore nossos e-books, guias, vídeos e outros recursos sobre psicologia humanista, autoconhecimento e bem-estar.',
  // Outros metadados podem ser adicionados aqui (keywords, openGraph, etc.)
};

// Componente da página de Materiais
export default function MateriaisPage() {
  return (
    // O div principal pode ser simplificado, pois o layout pai já cuida do min-h-screen e flex-col
    <div className="bg-gray-50">
      {/* Conteúdo principal da página */}
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-gray-800">
          Materiais e Recursos
        </h1>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Em breve, esta seção será um espaço rico com e-books, guias práticos, referências, vídeos e podcasts cuidadosamente selecionados para apoiar sua jornada de florescimento pessoal.
        </p>

        {/* Placeholder indicando que o conteúdo está em desenvolvimento */}
        <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Conteúdo em Preparação</h2>
          <p className="text-gray-500">
            Estamos trabalhando para trazer materiais valiosos para você. Volte em breve!
          </p>
        </div>

        {/* Espaço para futuro conteúdo listado (ex: cards de e-books, links para vídeos) */}
        {/*
          Exemplo de como poderia ser a estrutura futura:
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            // Card para um e-book
            <div className="border rounded-lg p-4 bg-white shadow">
              <h3 className="text-xl font-semibold mb-2">Nome do E-book</h3>
              <p className="text-gray-600 mb-4">Breve descrição...</p>
              <a href="#" className="text-blue-600 hover:underline">Baixar/Acessar</a>
            </div>
            // Outros cards...
          </div>
        */}
      </main>
    </div>
  );
}
