// Componente Footer específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogFooter.tsx
import React from 'react';
import Link from 'next/link';
import { NewsletterBlogForm } from './NewsletterBlogForm'; // Alterado para importação nomeada

const BlogFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-12"> {/* Aumentado padding vertical */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"> {/* Grid para layout */}
        {/* Seção da Newsletter */}
        <div className="md:col-span-1">
          <h3 className="text-xl font-semibold mb-3">Mantenha-se Atualizado</h3>
          <p className="text-gray-300 mb-4 text-sm">Receba os últimos artigos e novidades diretamente no seu e-mail.</p>
          <NewsletterBlogForm />
        </div>

        {/* Seção de Copyright e Links */}
        <div className="md:col-span-1 text-center md:text-right"> {/* Alinhamento ajustado */}
          {/* Copyright */}
          <p className="mb-2">&copy; {new Date().getFullYear()} Psicólogo Daniel Dantas. Todos os direitos reservados.</p>
          {/* Links úteis (ex: Política de Privacidade) */}
          <p className="text-sm text-gray-400">
            <Link href="/politica-de-privacidade" legacyBehavior>
              <a className="hover:underline">Política de Privacidade</a>
            </Link>
            {/* TODO: Adicionar outros links relevantes do rodapé aqui (ex: Termos de Uso) */}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BlogFooter;
