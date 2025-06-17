// scripts/analyze-schema-type.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../../types/supabase';

// Configure suas credenciais do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role para análise

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

interface SchemaTypeAnalysis {
  totalArticles: number;
  schemaTypeDistribution: Record<string, number>;
  nullCount: number;
  urlVideoCount: number;
  urlPodcastCount: number;
  downloadUrlCount: number;
  correlationAnalysis: {
    withVideo: Record<string, number>;
    withPodcast: Record<string, number>;
    withDownload: Record<string, number>;
  };  recentArticles: Array<{
    id: number;
    titulo: string;
    schema_type: string | null;
    url_video: string | null;
    url_podcast: string | null;
    download_url: string | null;
    data_publicacao: string | null;
  }>;
}

async function analyzeSchemaTypeColumn(): Promise<SchemaTypeAnalysis> {
  console.log('🔍 Iniciando análise da coluna schema_type...\n');

  // 1. Buscar todos os artigos com campos relevantes
  const { data: artigos, error } = await supabase
    .from('artigos')
    .select(`
      id,
      titulo,
      schema_type,
      url_video,
      url_podcast,
      download_url,
      data_publicacao,
      status
    `)
    .eq('status', 'publicado')
    .order('data_publicacao', { ascending: false });

  if (error) {
    throw new Error(`Erro ao buscar artigos: ${error.message}`);
  }

  if (!artigos || artigos.length === 0) {
    throw new Error('Nenhum artigo encontrado');
  }

  console.log(`✅ Encontrados ${artigos.length} artigos publicados\n`);

  // 2. Análise da distribuição de schema_type
  const schemaTypeDistribution: Record<string, number> = {};
  let nullCount = 0;
  let urlVideoCount = 0;
  let urlPodcastCount = 0;
  let downloadUrlCount = 0;

  // 3. Análise de correlação
  const correlationAnalysis = {
    withVideo: {} as Record<string, number>,
    withPodcast: {} as Record<string, number>,
    withDownload: {} as Record<string, number>
  };

  artigos.forEach(artigo => {    // Contar schema_type
    if (artigo.schema_type === null) {
      nullCount++;
    } else {
      const schemaType = String(artigo.schema_type).trim();
      schemaTypeDistribution[schemaType] = (schemaTypeDistribution[schemaType] || 0) + 1;
    }

    // Contar URLs
    if (artigo.url_video) urlVideoCount++;
    if (artigo.url_podcast) urlPodcastCount++;
    if (artigo.download_url) downloadUrlCount++;    // Correlação com vídeo
    if (artigo.url_video) {
      const schemaType = artigo.schema_type ? String(artigo.schema_type) : 'NULL';
      correlationAnalysis.withVideo[schemaType] = (correlationAnalysis.withVideo[schemaType] || 0) + 1;
    }

    // Correlação com podcast
    if (artigo.url_podcast) {
      const schemaType = artigo.schema_type ? String(artigo.schema_type) : 'NULL';
      correlationAnalysis.withPodcast[schemaType] = (correlationAnalysis.withPodcast[schemaType] || 0) + 1;
    }

    // Correlação com download
    if (artigo.download_url) {
      const schemaType = artigo.schema_type ? String(artigo.schema_type) : 'NULL';
      correlationAnalysis.withDownload[schemaType] = (correlationAnalysis.withDownload[schemaType] || 0) + 1;
    }
  });

  // 4. Pegar os 10 artigos mais recentes para análise detalhada
  const recentArticles = artigos.slice(0, 10).map(artigo => ({
    id: artigo.id,
    titulo: artigo.titulo,
    schema_type: artigo.schema_type,
    url_video: artigo.url_video,
    url_podcast: artigo.url_podcast,
    download_url: artigo.download_url,
    data_publicacao: artigo.data_publicacao
  }));

  return {
    totalArticles: artigos.length,
    schemaTypeDistribution,
    nullCount,
    urlVideoCount,
    urlPodcastCount,
    downloadUrlCount,
    correlationAnalysis,
    recentArticles
  };
}

function printAnalysisReport(analysis: SchemaTypeAnalysis) {
  console.log('📊 RELATÓRIO DE ANÁLISE DA COLUNA schema_type');
  console.log('='.repeat(60));
  
  console.log('\n1. ESTATÍSTICAS GERAIS:');
  console.log(`   Total de artigos: ${analysis.totalArticles}`);
  console.log(`   Valores NULL: ${analysis.nullCount} (${((analysis.nullCount / analysis.totalArticles) * 100).toFixed(1)}%)`);
  console.log(`   Valores preenchidos: ${analysis.totalArticles - analysis.nullCount} (${(((analysis.totalArticles - analysis.nullCount) / analysis.totalArticles) * 100).toFixed(1)}%)`);
  
  console.log('\n2. DISTRIBUIÇÃO DE VALORES:');
  Object.entries(analysis.schemaTypeDistribution)
    .sort(([,a], [,b]) => b - a)
    .forEach(([value, count]) => {
      const percentage = ((count / analysis.totalArticles) * 100).toFixed(1);
      console.log(`   "${value}": ${count} artigos (${percentage}%)`);
    });

  console.log('\n3. TIPOS DE CONTEÚDO MULTIMÍDIA:');
  console.log(`   Artigos com vídeo: ${analysis.urlVideoCount}`);
  console.log(`   Artigos com podcast: ${analysis.urlPodcastCount}`);
  console.log(`   Artigos com download: ${analysis.downloadUrlCount}`);

  console.log('\n4. CORRELAÇÃO schema_type + CONTEÚDO MULTIMÍDIA:');
  
  if (Object.keys(analysis.correlationAnalysis.withVideo).length > 0) {
    console.log('   Com vídeo:');
    Object.entries(analysis.correlationAnalysis.withVideo).forEach(([schemaType, count]) => {
      console.log(`     ${schemaType}: ${count} artigos`);
    });
  }

  if (Object.keys(analysis.correlationAnalysis.withPodcast).length > 0) {
    console.log('   Com podcast:');
    Object.entries(analysis.correlationAnalysis.withPodcast).forEach(([schemaType, count]) => {
      console.log(`     ${schemaType}: ${count} artigos`);
    });
  }

  if (Object.keys(analysis.correlationAnalysis.withDownload).length > 0) {
    console.log('   Com download:');
    Object.entries(analysis.correlationAnalysis.withDownload).forEach(([schemaType, count]) => {
      console.log(`     ${schemaType}: ${count} artigos`);
    });
  }
  console.log('\n5. AMOSTRA DOS 10 ARTIGOS MAIS RECENTES:');
  analysis.recentArticles.forEach((artigo, index) => {
    console.log(`   ${index + 1}. "${artigo.titulo.substring(0, 50)}..."`);
    console.log(`      schema_type: ${artigo.schema_type ? String(artigo.schema_type) : 'NULL'}`);
    console.log(`      vídeo: ${artigo.url_video ? 'SIM' : 'NÃO'}`);
    console.log(`      podcast: ${artigo.url_podcast ? 'SIM' : 'NÃO'}`);
    console.log(`      download: ${artigo.download_url ? 'SIM' : 'NÃO'}`);
    console.log(`      data: ${artigo.data_publicacao}`);
    console.log('');
  });

  console.log('\n6. RECOMENDAÇÕES PARA O ENUM:');
  const uniqueValues = Object.keys(analysis.schemaTypeDistribution);
  
  if (uniqueValues.length > 0) {
    console.log('   Valores atuais encontrados para incluir no ENUM:');
    uniqueValues.forEach(value => {
      console.log(`     '${value}'`);
    });
  }
  
  console.log('\n   Valores sugeridos adicionais para futuro:');
  const suggestedValues = [
    'VideoObject',
    'PodcastEpisode', 
    'EducationalContent',
    'FAQPage',
    'HowTo',
    'Review'
  ];
  
  suggestedValues.forEach(value => {
    if (!uniqueValues.includes(value)) {
      console.log(`     '${value}' (novo)`);
    }
  });
}

// Função principal
async function main() {
  try {
    const analysis = await analyzeSchemaTypeColumn();
    printAnalysisReport(analysis);
    
    console.log('\n✅ Análise concluída com sucesso!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('   1. Revisar os valores encontrados');
    console.log('   2. Decidir quais valores incluir no ENUM');
    console.log('   3. Planejar a migração SQL');
    
  } catch (error) {
    console.error('❌ Erro durante a análise:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

export { analyzeSchemaTypeColumn, printAnalysisReport };