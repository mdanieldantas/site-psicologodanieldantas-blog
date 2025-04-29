import { createClient } from '@supabase/supabase-js';
import type { MetadataRoute } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use a service key para acesso server-side
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.psicologodanieldantas.com.br';

  // Busca categorias, artigos e tags publicados
  const { data: categorias } = await supabase.from('categorias').select('slug');
  const { data: artigos } = await supabase
    .from('artigos')
    .select('slug, categorias ( slug )')
    .eq('status', 'publicado')
    .not('data_publicacao', 'is', null);
  const { data: tags } = await supabase.from('tags').select('slug');
  // URLs estáticas principais
  const staticUrls = [
    { url: baseUrl, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/blogflorescerhumano`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/blogflorescerhumano/artigos`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/blogflorescerhumano/categorias`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/blogflorescerhumano/tags`, changeFrequency: 'monthly' as const, priority: 0.7 },
    // ...adicione outras páginas estáticas relevantes
  ];

  // URLs dinâmicas de categorias
  const categoriaUrls =
    categorias?.map((cat) => ({
      url: `${baseUrl}/blogflorescerhumano/${cat.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) ?? [];

  // URLs dinâmicas de artigos
  const artigoUrls =
    artigos?.map((art) => {
      let categoriaSlug = 'categoria';
      if (Array.isArray(art.categorias) && art.categorias.length > 0) {
        categoriaSlug = art.categorias[0].slug;
      }
      return {
        url: `${baseUrl}/blogflorescerhumano/${categoriaSlug}/${art.slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    }) ?? [];

  // URLs dinâmicas de tags
  const tagUrls =
    tags?.map((tag) => ({
      url: `${baseUrl}/blogflorescerhumano/tags/${tag.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })) ?? [];

  // Retorno final do sitemap
  return [
    ...staticUrls,
    ...categoriaUrls,
    ...artigoUrls,
    ...tagUrls,
  ].map((entry) => ({
    ...entry,
    lastModified: new Date(),
  }));
}

