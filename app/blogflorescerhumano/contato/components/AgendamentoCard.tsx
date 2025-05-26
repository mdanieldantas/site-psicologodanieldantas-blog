"use client";

import React from 'react';
import Image from 'next/image';
import AgendamentoBotao from '@/app/blogflorescerhumano/components/agendamento-botao';

export default function AgendamentoCard() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-[#C19A6B]/20">
      <h2 className="text-3xl font-['Old_Roman'] mb-6 text-[#583B1F] border-b border-[#C19A6B]/20 pb-3 hidden md:block">Gostaria de agendar uma sessão?</h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Imagem do Autor */}
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#C19A6B]/30 flex-shrink-0">
          <Image
            src="/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
            alt="Psicólogo Daniel Dantas"
            fill
            sizes="(max-width: 768px) 96px, 128px"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
          {/* Conteúdo do Card */}
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-['Old_Roman'] mb-3 text-[#583B1F] md:hidden">Gostaria de agendar uma sessão?</h2>
          <p className="text-[#735B43] mb-6 text-sm md:text-base">
            Se você está considerando buscar um espaço para você, te convido a entrar em contato. Ficarei feliz em te receber para conversarmos.
          </p>
          
          <AgendamentoBotao 
            variant="primary" 
            size="md" 
            fullWidth={true}
            className="w-full md:w-auto"
          />
        </div>
      </div>
    </div>
  );
}
