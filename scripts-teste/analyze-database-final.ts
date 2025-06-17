// Comando para executar este script:
// npx tsx scripts-teste/analyze-database-final.ts//


// scripts-teste/analyze-database-final.ts


import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Usar as credenciais do seu .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qshvkvfdsplpntleldyd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaHZrdmZkc3BscG50bGVsZHlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDkwMTY3MSwiZXhwIjoyMDYwNDc3NjcxfQ.Rs2Y8RG34GV50FePetHwlw8CSSO5qYGiwc9_bdKeI4M';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não encontradas!');
  console.error('');
  console.error('🔧 Para executar este script, defina as variáveis no terminal:');
  console.error('   $env:NEXT_PUBLIC_SUPABASE_URL="sua_url_aqui"');
  console.error('   $env:SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui"');
  console.error('');
  console.error('Ou adicione ao arquivo .env.local na raiz do projeto');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

interface DatabaseAnalysis {
  // Estatísticas gerais
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  archivedArticles: number;

  // Análise de Schema Types (usando enum real)
  schemaTypeDistribution: Record<string, number>;
  schemaTypeNullCount: number;

  // Análise de Content Tier (usando enum real)
  contentTierDistribution: Record<string, number>;

  // Análise de Download Source (usando enum real)
  downloadSourceDistribution: Record<string, number>;

  // Análise de conteúdo multimídia
  articlesWithVideo: number;
  articlesWithPodcast: number;
  articlesWithDownload: number;

  // Análise de FAQ estruturado
  articlesWithFAQ: number;
  faqItemsTotal: number;

  // Análise de metadados SEO
  articlesWithMetaTitulo: number;
  articlesWithMetaDescricao: number;
  articlesWithSchemaBackup: number;

  // Amostra de artigos recentes
  recentArticles: Array<{
    id: number;
    titulo: string;
    schema_type: Database['public']['Enums']['schema_type_enum'] | null;
    content_tier: Database['public']['Enums']['content_tier_type'] | null;
    status: Database['public']['Enums']['article_status_type'];
    url_video: string | null;
    url_podcast: string | null;
    download_url: string | null;
    faq_data: any;
    data_publicacao: string | null;
  }>;

  // Oportunidades para Fábrica de SEO
  opportunities: {
    autoDetectionCandidates: number;
    multimediaEnrichment: number;
    faqStructuredCandidates: number;
    schemaOptimizationPotential: number;
  };
}

async function analyzeDatabaseComplete(): Promise<DatabaseAnalysis> {
  console.log('🔍 Iniciando análise completa do banco de dados...\n');

  // Buscar todos os artigos com TODOS os campos (usando tipagem atualizada)
  const { data: artigos, error } = await supabase
    .from('artigos')
    .select(`
      id, titulo, slug, status, schema_type, content_tier, download_source,
      url_video, url_podcast, download_url, faq_data,
      meta_titulo, meta_descricao, schema_type_backup,
      data_publicacao, conteudo
    `)
    .order('data_publicacao', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar artigos: ${error.message}`);
  }

  if (!artigos || artigos.length === 0) {
    throw new Error('Nenhum artigo encontrado');
  }

  console.log(`✅ Encontrados ${artigos.length} artigos no banco\n`);

  // Inicializar contadores
  const analysis: DatabaseAnalysis = {
    totalArticles: artigos.length,
    publishedArticles: 0,
    draftArticles: 0,
    archivedArticles: 0,
    schemaTypeDistribution: {},
    schemaTypeNullCount: 0,
    contentTierDistribution: {},
    downloadSourceDistribution: {},
    articlesWithVideo: 0,
    articlesWithPodcast: 0,
    articlesWithDownload: 0,
    articlesWithFAQ: 0,
    faqItemsTotal: 0,
    articlesWithMetaTitulo: 0,
    articlesWithMetaDescricao: 0,
    articlesWithSchemaBackup: 0,
    recentArticles: [],
    opportunities: {
      autoDetectionCandidates: 0,
      multimediaEnrichment: 0,
      faqStructuredCandidates: 0,
      schemaOptimizationPotential: 0
    }
  };

  // Processar cada artigo
  artigos.forEach(artigo => {
    // Status distribution
    if (artigo.status === 'publicado') analysis.publishedArticles++;
    else if (artigo.status === 'rascunho') analysis.draftArticles++;
    else if (artigo.status === 'arquivado') analysis.archivedArticles++;

    // Schema type distribution
    if (artigo.schema_type === null) {
      analysis.schemaTypeNullCount++;
    } else {
      const schemaType = String(artigo.schema_type);
      analysis.schemaTypeDistribution[schemaType] = 
        (analysis.schemaTypeDistribution[schemaType] || 0) + 1;
    }

    // Content tier distribution
    if (artigo.content_tier) {
      const tier = String(artigo.content_tier);
      analysis.contentTierDistribution[tier] = 
        (analysis.contentTierDistribution[tier] || 0) + 1;
    }

    // Download source distribution
    if (artigo.download_source) {
      const source = String(artigo.download_source);
      analysis.downloadSourceDistribution[source] = 
        (analysis.downloadSourceDistribution[source] || 0) + 1;
    }

    // Multimedia analysis
    if (artigo.url_video) analysis.articlesWithVideo++;
    if (artigo.url_podcast) analysis.articlesWithPodcast++;
    if (artigo.download_url) analysis.articlesWithDownload++;

    // FAQ analysis
    if (artigo.faq_data && Array.isArray(artigo.faq_data) && artigo.faq_data.length > 0) {
      analysis.articlesWithFAQ++;
      analysis.faqItemsTotal += artigo.faq_data.length;
    }

    // SEO metadata analysis
    if (artigo.meta_titulo) analysis.articlesWithMetaTitulo++;
    if (artigo.meta_descricao) analysis.articlesWithMetaDescricao++;
    if (artigo.schema_type_backup) analysis.articlesWithSchemaBackup++;

    // Opportunities analysis
    if (artigo.schema_type === 'BlogPosting') {
      analysis.opportunities.autoDetectionCandidates++;
    }
    
    if (artigo.url_video || artigo.url_podcast || artigo.download_url) {
      analysis.opportunities.multimediaEnrichment++;
    }

    if (artigo.conteudo && artigo.conteudo.includes('faq')) {
      analysis.opportunities.faqStructuredCandidates++;
    }

    if (!artigo.meta_titulo || artigo.schema_type === 'BlogPosting') {
      analysis.opportunities.schemaOptimizationPotential++;
    }
  });

  // Pegar amostra dos 10 artigos mais recentes
  analysis.recentArticles = artigos.slice(0, 10).map(artigo => ({
    id: artigo.id,
    titulo: artigo.titulo,
    schema_type: artigo.schema_type,
    content_tier: artigo.content_tier,
    status: artigo.status,
    url_video: artigo.url_video,
    url_podcast: artigo.url_podcast,
    download_url: artigo.download_url,
    faq_data: artigo.faq_data,
    data_publicacao: artigo.data_publicacao
  }));

  return analysis;
}

function printComprehensiveReport(analysis: DatabaseAnalysis) {
  console.log('📊 RELATÓRIO COMPLETO DE ANÁLISE DO BANCO DE DADOS');
  console.log('='.repeat(80));
  
  console.log('\n🏢 1. ESTATÍSTICAS GERAIS:');
  console.log(`   Total de artigos: ${analysis.totalArticles}`);
  console.log(`   📝 Publicados: ${analysis.publishedArticles} (${((analysis.publishedArticles / analysis.totalArticles) * 100).toFixed(1)}%)`);
  console.log(`   ✏️  Rascunhos: ${analysis.draftArticles} (${((analysis.draftArticles / analysis.totalArticles) * 100).toFixed(1)}%)`);
  console.log(`   🗃️  Arquivados: ${analysis.archivedArticles} (${((analysis.archivedArticles / analysis.totalArticles) * 100).toFixed(1)}%)`);
  
  console.log('\n📋 2. DISTRIBUIÇÃO DE SCHEMA TYPES:');
  Object.entries(analysis.schemaTypeDistribution)
    .sort(([,a], [,b]) => b - a)
    .forEach(([type, count]) => {
      const percentage = ((count / analysis.totalArticles) * 100).toFixed(1);
      console.log(`   "${type}": ${count} artigos (${percentage}%)`);
    });
  console.log(`   NULL (padrão): ${analysis.schemaTypeNullCount} artigos`);

  console.log('\n🎚️ 3. DISTRIBUIÇÃO DE CONTENT TIER:');
  Object.entries(analysis.contentTierDistribution)
    .sort(([,a], [,b]) => b - a)
    .forEach(([tier, count]) => {
      const percentage = ((count / analysis.totalArticles) * 100).toFixed(1);
      console.log(`   "${tier}": ${count} artigos (${percentage}%)`);
    });

  console.log('\n📁 4. DISTRIBUIÇÃO DE DOWNLOAD SOURCE:');
  Object.entries(analysis.downloadSourceDistribution)
    .sort(([,a], [,b]) => b - a)
    .forEach(([source, count]) => {
      const percentage = ((count / analysis.totalArticles) * 100).toFixed(1);
      console.log(`   "${source}": ${count} artigos (${percentage}%)`);
    });

  console.log('\n🎬 5. CONTEÚDO MULTIMÍDIA:');
  console.log(`   📹 Artigos com vídeo: ${analysis.articlesWithVideo}`);
  console.log(`   🎧 Artigos com podcast: ${analysis.articlesWithPodcast}`);
  console.log(`   📄 Artigos com download: ${analysis.articlesWithDownload}`);

  console.log('\n❓ 6. FAQ ESTRUTURADO:');
  console.log(`   📋 Artigos com FAQ: ${analysis.articlesWithFAQ}`);
  console.log(`   🔢 Total de perguntas FAQ: ${analysis.faqItemsTotal}`);
  console.log(`   📊 Média por artigo: ${analysis.articlesWithFAQ > 0 ? (analysis.faqItemsTotal / analysis.articlesWithFAQ).toFixed(1) : 0}`);

  console.log('\n🔍 7. METADADOS SEO:');
  console.log(`   📝 Artigos com meta_titulo: ${analysis.articlesWithMetaTitulo}`);
  console.log(`   📄 Artigos com meta_descricao: ${analysis.articlesWithMetaDescricao}`);
  console.log(`   💾 Artigos com schema_type_backup: ${analysis.articlesWithSchemaBackup}`);

  console.log('\n🚀 8. OPORTUNIDADES PARA FÁBRICA DE SEO:');
  console.log(`   🤖 Candidatos para auto-detecção: ${analysis.opportunities.autoDetectionCandidates}`);
  console.log(`   🎬 Potencial enriquecimento multimídia: ${analysis.opportunities.multimediaEnrichment}`);
  console.log(`   ❓ Candidatos para FAQ estruturado: ${analysis.opportunities.faqStructuredCandidates}`);
  console.log(`   ⚡ Potencial otimização de schema: ${analysis.opportunities.schemaOptimizationPotential}`);

  console.log('\n📄 9. AMOSTRA DOS 5 ARTIGOS MAIS RECENTES:');
  analysis.recentArticles.slice(0, 5).forEach((artigo, index) => {
    console.log(`   ${index + 1}. "${artigo.titulo.substring(0, 50)}..."`);
    console.log(`      Status: ${artigo.status} | Schema: ${artigo.schema_type || 'NULL'}`);
    console.log(`      Tier: ${artigo.content_tier || 'NULL'} | Data: ${artigo.data_publicacao}`);
    console.log(`      Multimídia: ${artigo.url_video ? 'Vídeo✅' : ''} ${artigo.url_podcast ? 'Podcast✅' : ''} ${artigo.download_url ? 'Download✅' : ''}`);
    console.log(`      FAQ: ${artigo.faq_data && Array.isArray(artigo.faq_data) ? `${artigo.faq_data.length} perguntas` : 'Não'}`);
    console.log('');
  });

  console.log('\n🎯 10. RECOMENDAÇÕES PARA A FÁBRICA DE SEO:');
  console.log(`   1. 🤖 Implementar detecção automática para ${analysis.opportunities.autoDetectionCandidates} artigos BlogPosting`);
  console.log(`   2. 🎬 Criar interface multimídia para ${analysis.opportunities.multimediaEnrichment} artigos com conteúdo extra`);
  console.log(`   3. ❓ Estruturar FAQ automático para ${analysis.opportunities.faqStructuredCandidates} artigos candidatos`);
  console.log(`   4. ⚡ Otimizar schemas para ${analysis.opportunities.schemaOptimizationPotential} artigos com potencial`);
}

// Função principal
async function main() {
  try {
    const analysis = await analyzeDatabaseComplete();
    printComprehensiveReport(analysis);
    
    console.log('\n✅ Análise completa concluída com sucesso!');
    console.log('\n📋 PRÓXIMOS PASSOS SUGERIDOS:');
    console.log('   1. ✅ Arquivo types/supabase.ts está 100% atualizado');
    console.log('   2. 🚀 Implementar Fábrica de SEO baseada nos dados acima');
    console.log('   3. 🎯 Priorizar otimizações com maior impacto');
    
  } catch (error) {
    console.error('❌ Erro durante a análise:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

export { analyzeDatabaseComplete, printComprehensiveReport };