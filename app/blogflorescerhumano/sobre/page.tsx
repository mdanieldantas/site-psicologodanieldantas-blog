// app/blogflorescerhumano/sobre/page.tsx
import React from 'react';

export default function SobreBlogPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Sobre o Blog Florescer Humano</h1>
      <div className="prose lg:prose-xl max-w-none mx-auto">
        <p>
          Bem-vindo ao Florescer Humano, um espaço dedicado à exploração do autoconhecimento,
          bem-estar e crescimento pessoal através das lentes da psicologia humanista.
        </p>
        <p>
          Aqui, compartilhamos insights, reflexões e práticas inspiradas em abordagens como
          a Abordagem Centrada na Pessoa (ACP), a Focalização e o Mindfulness, buscando
          promover uma vida mais autêntica, consciente e plena.
        </p>
        <p>
          Este blog é uma extensão do trabalho de Daniel Dantas, psicólogo clínico com foco
          na abordagem humanista, que acredita no potencial inato de cada indivíduo para
          o crescimento e a auto-realização.
        </p>
        <p>
          Explore nossos artigos, participe das discussões e junte-se a nós nesta jornada
          de florescimento humano.
        </p>
        {/* Adicionar mais conteúdo sobre o blog, o autor, a abordagem, etc. */}
      </div>
    </main>
  );
}
