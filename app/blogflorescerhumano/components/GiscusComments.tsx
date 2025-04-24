// app/blogflorescerhumano/components/GiscusComments.tsx
"use client"; // Necessário para componentes interativos

import React from 'react';
import Giscus from '@giscus/react';

// Interface para as props, se necessário adicionar mais tarde
interface GiscusCommentsProps {
  // Adicione props se precisar passar dados dinâmicos,
  // mas para a configuração básica, não é necessário.
}

const GiscusComments: React.FC<GiscusCommentsProps> = () => {
  // --- Configurações obtidas do exemplo fornecido anteriormente --- //
  const repoName = "mdanieldantas/estudo-Giscus-blog";
  const repoId = "R_kgDOOeCRuQ";
  const categoryName = "General";
  const categoryId = "DIC_kwDOOeCRuc4CpW8L";
  // --- Fim das Configurações --- //

  return (
    <Giscus
      id="comments"
      repo={repoName}
      repoId={repoId}
      category={categoryName}
      categoryId={categoryId}
      mapping="pathname" // Mapeia discussões pelo caminho da URL da página
      reactionsEnabled="1" // Habilita reações (conforme exemplo)
      emitMetadata="0" // Não emite metadados (conforme exemplo)
      inputPosition="bottom" // Posição do input de comentário (conforme exemplo)
      theme="light" // Usa o tema light (conforme exemplo)
      lang="pt" // Define o idioma para Português (conforme exemplo)
      loading="lazy" // Carrega Giscus de forma preguiçosa
    />
  );
};

export default GiscusComments;
