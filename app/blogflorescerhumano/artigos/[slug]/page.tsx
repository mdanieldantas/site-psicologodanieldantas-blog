// Página para exibir um artigo individual do Blog Florescer Humano

// A função receberá 'params' que contém o slug do artigo da URL
export default function ArtigoPage({ params }: { params: { slug: string } }) {
  return (
    <article>
      <h1>Título do Artigo (Carregado dinamicamente)</h1>
      <p>Conteúdo do artigo com slug: {params.slug}</p>
      {/* Lógica para buscar e exibir o conteúdo completo do artigo baseado no slug */}
    </article>
  );
}
