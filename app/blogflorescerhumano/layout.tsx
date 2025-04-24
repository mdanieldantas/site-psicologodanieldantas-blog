import React from 'react';

// Layout específico para as páginas do Blog Florescer Humano
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto px-4 py-8">
      {/* Aqui podem entrar elementos específicos do layout do blog, como Navegação, Sidebar, etc. */}
      <header className="mb-8">
        {/* Exemplo: Link de volta para a home do blog ou navegação específica */}
        <a href="/blogflorescerhumano" className="text-blue-600 hover:underline">Voltar para Home do Blog</a>
      </header>
      <main>{children}</main>
      <footer className="mt-12 pt-8 border-t">
        {/* Exemplo: Rodapé específico do blog */}
        <p>&copy; {new Date().getFullYear()} Blog Florescer Humano - Psicólogo Daniel Dantas</p>
      </footer>
    </section>
  );
}
