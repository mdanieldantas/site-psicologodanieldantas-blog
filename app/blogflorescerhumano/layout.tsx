// app/blogflorescerhumano/layout.tsx
import React from 'react';
import Link from 'next/link';
import SearchForm from './components/SearchForm'; // Importa o formulário de busca

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Cabeçalho do Blog (Exemplo Simples) */}
      <header className="bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/blogflorescerhumano" legacyBehavior>
            <a className="text-2xl font-bold hover:text-gray-200">Blog Florescer Humano</a>
          </Link>
          <div className="space-x-4">
            <Link href="/blogflorescerhumano/categorias" legacyBehavior><a className="hover:text-gray-200">Categorias</a></Link>
            <Link href="/blogflorescerhumano/sobre" legacyBehavior><a className="hover:text-gray-200">Sobre</a></Link>
            {/* Adicionar link para Todos os Artigos se existir */}
            {/* <Link href="/blogflorescerhumano/artigos" legacyBehavior><a className="hover:text-gray-200">Todos os Artigos</a></Link> */}
          </div>
        </nav>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Adiciona o formulário de busca aqui, abaixo do header e antes do conteúdo principal da página */}
        <div className="mb-8">
          <SearchForm />
        </div>
        {children}
      </main>

      {/* Rodapé do Blog (Exemplo Simples) */}
      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Psicólogo Daniel Dantas. Todos os direitos reservados.</p>
          <p className="text-sm text-gray-400 mt-2">
            <Link href="/politica-de-privacidade" legacyBehavior><a className="hover:underline">Política de Privacidade</a></Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
