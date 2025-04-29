// Componente Footer específico para o Blog
// Localização: app/blogflorescerhumano/components/BlogFooter.tsx
import React from 'react';
import Link from 'next/link';
import { NewsletterBlogForm } from './NewsletterBlogForm'; // Alterado para importação nomeada

const BlogFooter = () => {
  return (
    <footer className="flex flex-col bg-[#583B1F] text-[#F8F5F0] py-10 mt-12 border-t border-[#735B43]">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Seção da Newsletter */}
        <div className="md:col-span-1">
          <h3 className="text-xl font-semibold mb-3">Mantenha-se Atualizado</h3>
          <p className="text-[color:var(--blog-muted-foreground)] mb-4 text-sm">Receba os últimos artigos e novidades diretamente no seu e-mail.</p>
          <NewsletterBlogForm />
        </div>

        {/* Seção de Copyright e Links */}
        <div className="md:col-span-1 text-center md:text-right"> {/* Alinhamento ajustado */}
          {/* Copyright */}
          <p className="mb-2">&copy; {new Date().getFullYear()} Psicólogo Daniel Dantas. Todos os direitos reservados.</p>
          {/* Links úteis (ex: Política de Privacidade) */}
          <p className="text-sm text-[color:var(--blog-muted-foreground)]">
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
