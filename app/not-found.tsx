// app/not-found.tsx
import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <h1 className="text-5xl font-bold text-center mb-6">Página não encontrada</h1>
      <p className="text-lg text-center mb-8 text-gray-500">
        Ops! Não encontramos o conteúdo que você procurava.
      </p>
      <Link href="/" className="px-6 py-3 rounded-md bg-gray-900 text-white font-semibold shadow hover:bg-gray-700 transition-colors">
        Voltar para a página inicial
      </Link>
    </main>
  );
}
