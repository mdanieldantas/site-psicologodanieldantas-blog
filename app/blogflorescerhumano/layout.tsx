// app/blogflorescerhumano/layout.tsx
import React, { Suspense } from 'react';
import SearchForm from './components/SearchForm'; // Importa o formulário de busca
import BlogHeader from './components/BlogHeader'; // Importa o componente Header refatorado
import BlogFooter from './components/BlogFooter'; // Importa o componente Footer refatorado
import './ui/globalsBlog.css'; // Importa o CSS global exclusivo do blog

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Usa o componente Header refatorado */}
      <BlogHeader />

      {/* Conteúdo Principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Adiciona o formulário de busca */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <SearchForm />
          </Suspense>
        </div>
        {/* Renderiza o conteúdo da página específica */}
        {children}
      </main>

      {/* Usa o componente Footer refatorado */}
      <BlogFooter />
    </div>
  );
}
