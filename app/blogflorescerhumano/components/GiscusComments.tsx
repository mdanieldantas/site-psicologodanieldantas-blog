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
  const repoName = "mdanieldantas/giscus-site-psidanieldantas-blog-1.0";
  const repoId = "R_kgDOOlpo4w";
  const categoryName = "Comentários do Blog Florescer Humano";
  const categoryId = "DIC_kwDOOlpo484Cp2HM";
  // --- Fim das Configurações --- //

  return (
    <Giscus
      id="comments"
      repo={repoName}
      repoId={repoId}
      category={categoryName}
      categoryId={categoryId}
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme="light"
      lang="pt"
      loading="lazy"
    />
  );
};

export default GiscusComments;
