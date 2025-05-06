import { createClient } from '@supabase/supabase-js';
import type { MetadataRoute } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use a service key para acesso server-side
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://psicologodanieldantas.com';

  // Busca categorias, artigos e tags publicados
  const { data: categorias } = await supabase.from('categorias').select('slug');
  const { data: artigos } = await supabase
    .from('artigos')
    .select('slug, categorias ( slug )')
    .eq('status', 'publicado')
    .not('data_publicacao', 'is', null);
  const { data: tags } = await supabase.from('tags').select('slug');  // URLs estáticas principais
  const staticUrls = [
    { url: baseUrl, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/sobre`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/servicos`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contato`, changeFrequency: 'yearly' as const, priority: 0.6 },
    { url: `${baseUrl}/agendamento`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/atendimento-online`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/atendimento-lgbtqia`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/ansiedade`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/depressao`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/autoconhecimento`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/avaliacao-psicologica`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/politica-de-privacidade`, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/blogflorescerhumano`, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/blogflorescerhumano/contato`, changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${baseUrl}/blogflorescerhumano/sobre`, changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${baseUrl}/blogflorescerhumano/materiais`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/blogflorescerhumano/midias`, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/blogflorescerhumano/buscar`, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/blogflorescerhumano/cancelar-newsletter`, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${baseUrl}/blogflorescerhumano/confirmar-newsletter`, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${baseUrl}/blogflorescerhumano/artigos`, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/blogflorescerhumano/categorias`, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/blogflorescerhumano/tags`, changeFrequency: 'monthly' as const, priority: 0.7 },    // URLs específicas para atendimento à comunidade LGBTQIA+
    { url: `${baseUrl}/psicoterapia-lgbtqia`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/terapia-afirmativa`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/identidade-de-genero`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/orientacao-sexual`, changeFrequency: 'monthly' as const, priority: 0.8 },
    
    // URLs específicas para psicologia racial
    { url: `${baseUrl}/psicologia-racial`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/letramento-racial`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/psicologia-antirracista`, changeFrequency: 'monthly' as const, priority: 0.8 },
    
    // URLs específicas para atendimento internacional
    { url: `${baseUrl}/atendimento-internacional`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${baseUrl}/brasileiros-no-exterior`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/psicoterapia-online-portugues`, changeFrequency: 'monthly' as const, priority: 0.8 },
    // Adicione aqui apenas páginas reais e indexáveis
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

