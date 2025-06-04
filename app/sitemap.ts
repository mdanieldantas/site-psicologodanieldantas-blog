import { createClient } from '@supabase/supabase-js';
import type { MetadataRoute } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use a service key para acesso server-side
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://psicologodanieldantas.com.br';

  try {
    // CORREÇÃO: Consultas paralelas com Promise.all para melhor performance
    const [categoriesResponse, articlesResponse, tagsResponse] = await Promise.all([
      supabase.from('categorias').select('slug, data_atualizacao'),
      supabase
        .from('artigos')
        .select(`
          slug, 
          data_atualizacao,
          categorias!inner ( slug )
        `)
        .eq('status', 'publicado')
        .not('data_publicacao', 'is', null),
      supabase.from('tags').select('slug')
    ]);

    const { data: categorias } = categoriesResponse;
    const { data: artigos } = articlesResponse;
    const { data: tags } = tagsResponse;    // ✅ URLs estáticas que REALMENTE EXISTEM
    const staticUrls: MetadataRoute.Sitemap = [
      // SITE PRINCIPAL - apenas páginas que existem
      { 
        url: baseUrl, 
        changeFrequency: 'weekly', 
        priority: 1.0, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/em-construcao`, 
        changeFrequency: 'yearly', 
        priority: 0.2, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/politica-de-privacidade`, 
        changeFrequency: 'yearly', 
        priority: 0.3, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/test-button-blog`, 
        changeFrequency: 'monthly', 
        priority: 0.2, 
        lastModified: new Date() 
      },
      
      // BLOG - páginas que existem
      { 
        url: `${baseUrl}/blogflorescerhumano`, 
        changeFrequency: 'daily', 
        priority: 0.9, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/sobre`, 
        changeFrequency: 'monthly', 
        priority: 0.6, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/contato`, 
        changeFrequency: 'yearly', 
        priority: 0.5, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/artigos`, 
        changeFrequency: 'daily', 
        priority: 0.8, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/categorias`, 
        changeFrequency: 'weekly', 
        priority: 0.7, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/materiais`, 
        changeFrequency: 'monthly', 
        priority: 0.5, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/midias`, 
        changeFrequency: 'monthly', 
        priority: 0.5, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/buscar`, 
        changeFrequency: 'weekly', 
        priority: 0.4, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/confirmar-newsletter`, 
        changeFrequency: 'yearly', 
        priority: 0.2, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/cancelar-newsletter`, 
        changeFrequency: 'yearly', 
        priority: 0.2, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano/reenviar-confirmacao`, 
        changeFrequency: 'yearly', 
        priority: 0.2, 
        lastModified: new Date() 
      },
    ];
  // URLs dinâmicas de categorias
  const categoriaUrls =
    categorias?.map((cat) => ({
      url: `${baseUrl}/blogflorescerhumano/${cat.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      lastModified: cat.data_atualizacao ? new Date(cat.data_atualizacao) : new Date(),
    })) ?? [];
  // URLs dinâmicas de artigos - CORRIGIDO
  const artigoUrls =
    artigos?.map((art) => {
      // CORREÇÃO: Acessa corretamente o slug da categoria
      let categoriaSlug = 'sem-categoria';
      if (art.categorias && typeof art.categorias === 'object' && 'slug' in art.categorias) {
        categoriaSlug = (art.categorias as { slug: string }).slug;
      }
      
      return {
        url: `${baseUrl}/blogflorescerhumano/${categoriaSlug}/${art.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        lastModified: art.data_atualizacao ? new Date(art.data_atualizacao) : new Date(),
      };
    }) ?? [];
  // URLs dinâmicas de tags
  const tagUrls =
    tags?.map((tag) => ({
      url: `${baseUrl}/blogflorescerhumano/tags/${tag.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      lastModified: new Date(),
    })) ?? [];

  // Combina todas as URLs
  const allUrls = [
    ...staticUrls,
    ...categoriaUrls,
    ...artigoUrls,
    ...tagUrls,
  ];

  // CORREÇÃO: Remove duplicatas e ordena por prioridade
  const uniqueUrls = allUrls.reduce((acc, current) => {
    const exists = acc.find(item => item.url === current.url);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, [] as typeof allUrls);

  // Ordena por prioridade (maior para menor)
  return uniqueUrls.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    
    // FALLBACK: retorna apenas URLs estáticas básicas
    return [
      { 
        url: baseUrl, 
        changeFrequency: 'weekly' as const, 
        priority: 1.0, 
        lastModified: new Date() 
      },
      { 
        url: `${baseUrl}/blogflorescerhumano`, 
        changeFrequency: 'daily' as const, 
        priority: 0.9, 
        lastModified: new Date() 
      },
    ];
  }
}

