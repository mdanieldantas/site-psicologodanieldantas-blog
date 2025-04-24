// Página para listar artigos de uma categoria específica do Blog Florescer Humano

// A função receberá 'params' que contém o slug da categoria da URL
export default function CategoriaPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1>Artigos na Categoria: {params.slug} (Carregado dinamicamente)</h1>
      <p>Aqui serão listados os artigos pertencentes à categoria "{params.slug}".</p>
      {/* Lógica para buscar e listar os artigos da categoria específica */}
      <ul>
        <li>Artigo A da Categoria {params.slug} (placeholder)</li>
        <li>Artigo B da Categoria {params.slug} (placeholder)</li>
      </ul>
    </div>
  );
}
