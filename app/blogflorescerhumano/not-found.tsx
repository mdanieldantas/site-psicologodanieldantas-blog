// app/blogflorescerhumano/not-found.tsx
import React from 'react';
import Link from 'next/link';
import BlogHeader from './components/BlogHeader';
import BlogFooter from './components/BlogFooter';
import './ui/globalsBlog.css';

export default function NotFoundBlog() {
  return (
    <div className="min-h-screen flex flex-col">
      <BlogHeader />
      <main className="flex-grow container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-bold text-center mb-6 text-blog-primary">Página não encontrada</h1>
        <p className="text-lg text-center mb-8 text-blog-muted-foreground">
          Ops! Não encontramos o conteúdo que você procurava no Blog Florescer Humano.
        </p>
        <Link href="/blogflorescerhumano" className="px-6 py-3 rounded-md bg-blog-primary text-blog-primary-foreground font-semibold shadow hover:bg-blog-secondary transition-colors">
          Voltar para o Blog
        </Link>
      </main>
      <BlogFooter />
    </div>
  );
}
