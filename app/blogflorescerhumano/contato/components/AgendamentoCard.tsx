"use client";

import React from 'react';
import Image from 'next/image';
import AgendamentoBotao from '@/app/blogflorescerhumano/components/agendamento-botao';

export default function AgendamentoCard() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-[#C19A6B]/20">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Imagem do Autor */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#C19A6B]/30 flex-shrink-0">
          <Image
            src="/blogflorescerhumano/autores/autores-daniel-psi-blog.webp"
            alt="Psicólogo Daniel Dantas"
            fill
            sizes="128px"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
        
        {/* Conteúdo do Card */}
        <div className="flex-grow text-center md:text-left">
          <h2 className="text-3xl font-['Old_Roman'] mb-3 text-[#583B1F]">Gostaria de agendar uma sessão?</h2>
          <p className="text-[#735B43] mb-6">
            Transforme seus desafios em crescimento pessoal. Uma conversa pode ser o primeiro passo para uma vida mais plena e equilibrada.
          </p>
          
          <AgendamentoBotao 
            variant="primary" 
            size="md" 
            fullWidth={false} 
            className="mx-auto md:mx-0" 
          />
        </div>
      </div>
    </div>
  );
}
