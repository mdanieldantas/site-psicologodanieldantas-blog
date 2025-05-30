// app/blogflorescerhumano/not-found.tsx
import React from 'react';
import Link from 'next/link';
import BlogHeader from './components/BlogHeader';
import BlogFooter from './components/BlogFooter';

export default function NotFoundBlog() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0]">
      <BlogHeader />
      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-center mb-6 text-[#583B1F]">
          Página não encontrada
        </h1>
        <p className="font-sans text-lg text-center mb-8 text-[#7D6E63] leading-relaxed max-w-2xl">
          Ops! Não encontramos o conteúdo que você procurava no Blog Florescer Humano.
        </p>
        <Link 
          href="/blogflorescerhumano" 
          className="px-6 py-3 bg-[#583B1F] text-white rounded-md font-medium font-sans transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:bg-[#6B7B3F]"
        >
          Voltar para o Blog
        </Link>
      </main>
      <BlogFooter />
    </div>
  );
}
