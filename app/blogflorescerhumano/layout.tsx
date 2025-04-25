// app/blogflorescerhumano/layout.tsx
import React from 'react';
import SearchForm from './components/SearchForm'; // Importa o formulário de busca
import BlogHeader from './components/BlogHeader'; // Importa o componente Header refatorado
import BlogFooter from './components/BlogFooter'; // Importa o componente Footer refatorado

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Usa o componente Header refatorado */}
      <BlogHeader />

      {/* Conteúdo Principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Adiciona o formulário de busca */}
        <div className="mb-8">
          <SearchForm />
        </div>
        {/* Renderiza o conteúdo da página específica */}
        {children}
      </main>

      {/* Usa o componente Footer refatorado */}
      <BlogFooter />
    </div>
  );
}
