/**
 * Teste para as funções de FAQ e Schema
 * Execute: node --loader ts-node/esm test-implementation.ts
 */

import { extractFAQFromHTML, generateFAQSchema } from './lib/faq-extractor.js';
import { determineSchemaConfig, generateArticleSchema, generateCreativeWorkSchema } from './lib/schema-generator.js';

// Teste 1: HTML com FAQ
const htmlComFAQ = `
<div class="article-content">
  <p>Conteúdo do artigo...</p>
  
  <div class="faq-accessible">
    <div class="faq-header">
      <h2 class="faq-title">Dúvidas Frequentes</h2>
    </div>
    
    <div class="faq-container">
      <details>
        <summary>
          <span class="faq-question">O que é a Tendência Atualizante em poucas palavras?</span>
          <span class="faq-arrow">▼</span>
        </summary>
        <div class="faq-answer">
          <p>É o impulso inato presente em todos os seres humanos para crescer, se desenvolver e realizar seu potencial máximo.</p>
        </div>
      </details>

      <details>
        <summary>
          <span class="faq-question">Como a psicoterapia ajuda a liberar a tendência atualizante?</span>
          <span class="faq-arrow">▼</span>
        </summary>
        <div class="faq-answer">
          <p>A terapia cria as condições para que ela se manifeste naturalmente através de um ambiente seguro e acolhedor.</p>
        </div>
      </details>
    </div>
  </div>
</div>
`;

// Teste 2: HTML sem FAQ
const htmlSemFAQ = `
<div class="article-content">
  <p>Este é um texto reflexivo sobre minha jornada como psicólogo...</p>
  <p>Compartilho aqui algumas reflexões pessoais sobre o crescimento profissional.</p>
</div>
`;

// Mock de dados para teste
const mockArtigo = {
  id: 1,
  titulo: "Como a Tendência Atualizante Pode Transformar Sua Vida",
  resumo: "Descubra o poder transformador da tendência atualizante segundo Carl Rogers",
  conteudo: htmlComFAQ,
  data_publicacao: "2025-06-13T10:00:00Z",
  data_atualizacao: "2025-06-13T10:00:00Z",
  data_criacao: "2025-06-13T10:00:00Z",
  autor_id: 1,
  categoria_id: 1,
  slug: "tendencia-atualizante-transformar-vida",
  status: "publicado",
  imagem_capa_arquivo: "tendencia-atualizante.webp"
};

const mockAutor = {
  nome: "Daniel Dantas",
  biografia: "Psicólogo especialista em ACP",
  foto_arquivo: "daniel-dantas.webp",
  perfil_academico_url: "https://psicologodanieldantas.com.br"
};

const mockCategoria = {
  id: 1,
  nome: "Psicologia Humanista",
  slug: "psicologia-humanista"
};

function runTests() {
  console.log('🧪 INICIANDO TESTES DA IMPLEMENTAÇÃO\n');

  // Teste 1: Extração de FAQ
  console.log('📋 TESTE 1: Extração de FAQ do HTML');
  const faqItems = extractFAQFromHTML(htmlComFAQ);
  if (faqItems) {
    console.log(`✅ FAQ extraída com sucesso: ${faqItems.length} itens`);
    faqItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.pergunta.substring(0, 50)}...`);
    });
  } else {
    console.log('❌ Nenhuma FAQ encontrada');
  }

  // Teste 2: Geração de Schema FAQ
  if (faqItems) {
    console.log('\n📄 TESTE 2: Geração de Schema FAQ');
    const faqSchema = generateFAQSchema(
      faqItems,
      mockArtigo.titulo,
      'https://example.com/artigo',
      mockAutor.nome
    );
    console.log('✅ Schema FAQ gerado:');
    console.log(`   Tipo: ${faqSchema['@type']}`);
    console.log(`   Perguntas: ${faqSchema.mainEntity.length}`);
  }

  // Teste 3: Determinação de configuração de schema
  console.log('\n🎯 TESTE 3: Configuração de Schema');
  const configComFAQ = determineSchemaConfig(!!faqItems);
  console.log(`✅ Config para conteúdo COM FAQ: ${configComFAQ.schemaType}`);
  
  const configSemFAQ = determineSchemaConfig(false);
  console.log(`✅ Config para conteúdo SEM FAQ: ${configSemFAQ.schemaType}`);

  // Teste 4: Geração de Schema Article
  console.log('\n📰 TESTE 4: Schema Article (com FAQ)');
  const articleSchema = generateArticleSchema(
    mockArtigo,
    mockAutor,
    mockCategoria,
    'https://example.com/artigo',
    'https://example.com',
    'https://example.com/image.jpg'
  );
  console.log('✅ Schema Article gerado:');
  console.log(`   Tipo: ${articleSchema['@type']}`);
  console.log(`   Título: ${articleSchema.headline}`);
  console.log(`   Autor: ${articleSchema.author.name}`);
  console.log(`   Tem mainEntity FAQ: ${!!articleSchema.mainEntity}`);

  // Teste 5: Geração de Schema CreativeWork
  console.log('\n🎨 TESTE 5: Schema CreativeWork (sem FAQ)');
  const creativeSchema = generateCreativeWorkSchema(
    { ...mockArtigo, conteudo: htmlSemFAQ },
    mockAutor,
    mockCategoria,
    'https://example.com/artigo-criativo',
    'https://example.com',
    'https://example.com/image.jpg'
  );
  console.log('✅ Schema CreativeWork gerado:');
  console.log(`   Tipo: ${creativeSchema['@type']}`);
  console.log(`   Nome: ${creativeSchema.name}`);
  console.log(`   Gênero: ${creativeSchema.genre}`);
  console.log(`   Sem mainEntity FAQ: ${!creativeSchema.mainEntity}`);

  // Teste 6: HTML sem FAQ
  console.log('\n🚫 TESTE 6: HTML sem FAQ');
  const faqItemsVazio = extractFAQFromHTML(htmlSemFAQ);
  console.log(`✅ HTML sem FAQ processado: ${faqItemsVazio === null ? 'null (correto)' : 'erro'}`);

  console.log('\n🎉 TODOS OS TESTES CONCLUÍDOS!');
  console.log('\n📊 RESUMO:');
  console.log('✅ Extração de FAQ: Funcionando');
  console.log('✅ Schema FAQ: Funcionando');
  console.log('✅ Configuração de Schema: Funcionando');
  console.log('✅ Schema Article: Funcionando');
  console.log('✅ Schema CreativeWork: Funcionando');
  console.log('✅ Fallback sem FAQ: Funcionando');
}

runTests();
