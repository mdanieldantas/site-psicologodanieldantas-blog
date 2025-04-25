// Componente Footer específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogFooter.tsx
import React from 'react';
import Link from 'next/link';

const BlogFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-4 text-center">
        {/* Copyright */}
        <p>&copy; {new Date().getFullYear()} Psicólogo Daniel Dantas. Todos os direitos reservados.</p>
        {/* Links úteis (ex: Política de Privacidade) */}
        <p className="text-sm text-gray-400 mt-2">
          <Link href="/politica-de-privacidade" legacyBehavior>
            <a className="hover:underline">Política de Privacidade</a>
          </Link>
          {/* TODO: Adicionar outros links relevantes do rodapé aqui (ex: Termos de Uso) */}
        </p>
      </div>
    </footer>
  );
};

export default BlogFooter;
