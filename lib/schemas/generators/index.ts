/**
 * 📝 EXPORTAÇÕES DOS GERADORES DE SCHEMA
 * 
 * Arquivo índice que centraliza todos os geradores específicos
 * e registra automaticamente na factory.
 * 
 * @author GitHub Copilot & Daniel Dantas
 * @date 2025-06-18
 * @version 2.0.0 - Generators Index Expandido
 */

import { SchemaGeneratorFactory } from '../core/factory';

// ==========================================
// 📝 GERADORES IMPLEMENTADOS
// ==========================================

// Geradores de Prioridade 1 (Base)
export { BlogPostingGenerator } from './blog-posting-generator';
export { ArticleGenerator } from './article-generator';
export { TutorialGenerator } from './tutorial-generator';

// Geradores de Prioridade 1 (Novos)
export { GuideGenerator } from './guide-generator';
export { CourseGenerator } from './course-generator';
export { QAPageGenerator } from './qapage-generator';
export { ReviewGenerator } from './review-generator';
export { ScholarlyArticleGenerator } from './scholarly-article-generator';

// ==========================================
// 🏭 REGISTRO AUTOMÁTICO NA FACTORY
// ==========================================

/**
 * Registra todos os geradores implementados na factory
 * Deve ser chamado na inicialização do sistema
 */
export function registerAllGenerators(): void {
  // Import direto para registro síncrono
  
  // Geradores base
  const { BlogPostingGenerator } = require('./blog-posting-generator');
  const { ArticleGenerator } = require('./article-generator');  
  const { TutorialGenerator } = require('./tutorial-generator');
  
  // Novos geradores de prioridade 1
  const { GuideGenerator } = require('./guide-generator');
  const { CourseGenerator } = require('./course-generator');
  const { QAPageGenerator } = require('./qapage-generator');
  const { ReviewGenerator } = require('./review-generator');
  const { ScholarlyArticleGenerator } = require('./scholarly-article-generator');
  
  // Registrar geradores base
  SchemaGeneratorFactory.registerGenerator('BlogPosting', new BlogPostingGenerator());
  SchemaGeneratorFactory.registerGenerator('Article', new ArticleGenerator());
  SchemaGeneratorFactory.registerGenerator('Tutorial', new TutorialGenerator());
  
  // Registrar novos geradores
  SchemaGeneratorFactory.registerGenerator('Guide', new GuideGenerator());
  SchemaGeneratorFactory.registerGenerator('Course', new CourseGenerator());
  SchemaGeneratorFactory.registerGenerator('QAPage', new QAPageGenerator());
  SchemaGeneratorFactory.registerGenerator('Review', new ReviewGenerator());
  SchemaGeneratorFactory.registerGenerator('ScholarlyArticle', new ScholarlyArticleGenerator());
  
  console.log('✅ [Generators] Todos os geradores registrados na factory (8 geradores)');
}

// ==========================================
// 📋 INFORMAÇÕES DOS GERADORES
// ==========================================

export const GENERATORS_INFO = {
  implemented: [
    {
      type: 'BlogPosting',
      priority: 1,
      description: 'Gerador base para posts de blog e artigos gerais',
      status: 'stable'
    },
    {
      type: 'Article',
      priority: 1,
      description: 'Gerador para artigos informativos e notícias',
      status: 'stable'
    },
    {
      type: 'Tutorial',
      priority: 1,
      description: 'Gerador para tutoriais e conteúdo instrucional',
      status: 'stable'
    },
    {
      type: 'Guide',
      priority: 1,
      description: 'Gerador para guias práticos e orientações',
      status: 'stable'
    },
    {
      type: 'Course',
      priority: 1,
      description: 'Gerador para cursos e conteúdo educacional estruturado',
      status: 'stable'
    },
    {
      type: 'QAPage',
      priority: 1,
      description: 'Gerador para páginas de perguntas e respostas',
      status: 'stable'
    },
    {
      type: 'Review',
      priority: 1,
      description: 'Gerador para avaliações e resenhas',
      status: 'stable'
    },
    {
      type: 'ScholarlyArticle',
      priority: 1,
      description: 'Gerador para artigos acadêmicos e científicos',
      status: 'stable'
    }
  ],
  
  planned: [
    {
      type: 'FAQPage',
      priority: 2,
      description: 'Gerador para páginas de FAQ estruturadas',
      status: 'planned'
    },
    {
      type: 'HowTo',
      priority: 2,
      description: 'Gerador para instruções passo-a-passo',
      status: 'planned'
    },
    {
      type: 'VideoObject',
      priority: 2,
      description: 'Gerador para conteúdo de vídeo',
      status: 'planned'
    },
    {
      type: 'PodcastEpisode',
      priority: 2,
      description: 'Gerador para episódios de podcast',
      status: 'planned'
    },
    {
      type: 'MedicalWebPage',
      priority: 3,
      description: 'Gerador para conteúdo médico especializado',
      status: 'planned'
    }
  ],
    statistics: {
    total_implemented: 8,
    total_planned: 5,
    coverage_priority_1: '100%', // 8/8 geradores de prioridade 1 implementados
    last_updated: '2025-06-18'
  }
};
