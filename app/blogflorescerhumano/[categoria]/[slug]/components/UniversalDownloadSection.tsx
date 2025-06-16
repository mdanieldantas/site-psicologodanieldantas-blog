'use client';

import React from 'react';
import { Download, FileText, Archive, Play, Database as DatabaseIcon, ExternalLink } from 'lucide-react';
import type { Database } from "@/types/supabase";

// Tipo do artigo com campos multimídia - compatível com a página
type ArtigoMultimidia = Database["public"]["Tables"]["artigos"]["Row"] & {
  categorias?: Pick<
    Database["public"]["Tables"]["categorias"]["Row"],
    "id" | "nome" | "slug"
  > | null;
  autores?: Pick<
    Database["public"]["Tables"]["autores"]["Row"],
    "id" | "nome"
  > | null;
  tags?:
    | Pick<
        Database["public"]["Tables"]["tags"]["Row"],
        "id" | "nome" | "slug"
      >[]
    | null;
};

interface UniversalDownloadSectionProps {
  artigo: ArtigoMultimidia;
}

export function UniversalDownloadSection({ artigo }: UniversalDownloadSectionProps) {
  // Se não tem download configurado, não renderiza
  if (!artigo.download_url || !artigo.download_source) {
    return null;
  }

  // Processa URL baseado na origem
  const downloadInfo = processDownloadUrl(artigo);
  
  const handleDownload = async () => {
    try {
      // Analytics tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'download', {
          file_name: artigo.download_title || 'material',
          content_type: artigo.download_format || 'unknown',
          source_type: artigo.download_source,
          article_id: artigo.id,
          article_title: artigo.titulo
        });
      }
      
      // Feedback visual (loading state)
      const button = document.querySelector('[data-download-button]') as HTMLButtonElement;
      if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Preparando...';
        button.disabled = true;
        
        setTimeout(() => {
          button.innerHTML = originalText;
          button.disabled = false;
        }, 2000);
      }
      
      // Abrir download/visualização
      window.open(downloadInfo.finalUrl, '_blank');
      
    } catch (error) {
      console.error('Erro ao iniciar download:', error);
      alert('Erro ao acessar o material. Tente novamente em alguns instantes.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 my-8 shadow-sm">
      {/* Cabeçalho da seção */}
      <div className="flex items-center gap-2 mb-4">
        <Download className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Material Complementar
        </h3>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Ícone baseado na origem e formato */}
        <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
          {getSourceIcon(artigo.download_source, artigo.download_format)}
        </div>
        
        {/* Informações do material */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-lg">
            {artigo.download_title || 'Material para Download'}
          </h4>
          
          {artigo.download_description && (
            <p className="text-sm text-gray-600 mt-1 leading-relaxed">
              {artigo.download_description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-xs">
            {/* Badge do formato */}
            {artigo.download_format && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                {artigo.download_format.toUpperCase()}
              </span>
            )}
            
            {/* Tamanho do arquivo */}
            {artigo.download_size_mb && (
              <span className="text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {artigo.download_size_mb} MB
              </span>
            )}
            
            {/* Badge da origem */}
            {getSourceBadge(artigo.download_source)}
          </div>
        </div>
        
        {/* Botão de download */}
        <button
          onClick={handleDownload}
          data-download-button
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          title={`${getDownloadButtonText(artigo.download_source)} - ${artigo.download_title || 'Material'}`}
        >
          <Download className="w-4 h-4" />
          {getDownloadButtonText(artigo.download_source)}
        </button>
      </div>
      
      {/* Nota de segurança para links externos */}
      {artigo.download_source === 'EXTERNAL' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800 text-sm">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Este link direcionará você para um site externo.</span>
          </div>
        </div>      )}
    </div>
  );
}

// 🎯 FUNÇÃO PRINCIPAL: Processa URL baseado na origem
function processDownloadUrl(artigo: ArtigoMultimidia) {
  const { download_source, download_url } = artigo;
  
  switch (download_source) {
    case 'SUPABASE':
      return {
        finalUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/materiais_download/${download_url}`,
        directDownload: true
      };
    
    case 'GDRIVE':
      // Converte Google Drive share link para download direto
      const fileId = extractGoogleDriveFileId(download_url || '');
      return {
        finalUrl: fileId 
          ? `https://drive.google.com/uc?export=download&id=${fileId}`
          : download_url || '',
        directDownload: true
      };
    
    case 'EXTERNAL':
    default:
      return {
        finalUrl: download_url || '',
        directDownload: isDirectDownloadUrl(download_url || '')
      };
  }
}

// 📋 GERA SCHEMA.ORG PARA MATERIAL DOWNLOADÁVEL
export function generateDownloadSchema(artigo: ArtigoMultimidia) {
  if (!artigo.download_url || !artigo.download_source) {
    return null;
  }

  const downloadInfo = processDownloadUrl(artigo);
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": artigo.download_title || "Material Complementar",
    "description": artigo.download_description || `Material complementar do artigo: ${artigo.titulo}`,
    "url": downloadInfo.finalUrl,
    "encodingFormat": getSchemaFormat(artigo.download_format),
    "contentSize": artigo.download_size_mb ? `${artigo.download_size_mb}MB` : undefined,
    "isPartOf": {
      "@type": "Article",
      "name": artigo.titulo,
      "url": `https://www.psicologodanieldantas.com/blogflorescerhumano/${artigo.categorias?.slug}/${artigo.slug}`
    },
    "author": {
      "@type": "Person",
      "name": artigo.autores?.nome || "Daniel Dantas"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Psicólogo Daniel Dantas",
      "url": "https://www.psicologodanieldantas.com"
    }
  };

  // Remove campos undefined
  return JSON.parse(JSON.stringify(schema));
}

// Converte formato para Schema.org MIME type
function getSchemaFormat(format?: string | null): string {
  if (!format) return 'application/octet-stream';
  
  const formatMap: Record<string, string> = {
    'PDF': 'application/pdf',
    'DOCX': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'DOC': 'application/msword',
    'XLSX': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'PPTX': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'ZIP': 'application/zip',
    'RAR': 'application/x-rar-compressed',
    'MP4': 'video/mp4',
    'MP3': 'audio/mpeg'
  };

  return formatMap[format.toUpperCase()] || 'application/octet-stream';
}

// Extrai ID do arquivo do Google Drive
function extractGoogleDriveFileId(url: string): string | null {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

// Verifica se é URL de download direto
function isDirectDownloadUrl(url: string): boolean {
  const directExtensions = ['.pdf', '.zip', '.docx', '.doc', '.xlsx', '.pptx'];
  return directExtensions.some(ext => url.toLowerCase().includes(ext));
}

// Ícone baseado na origem e formato
function getSourceIcon(source: string, format?: string | null) {
  if (source === 'SUPABASE') {
    return <DatabaseIcon className="w-6 h-6 text-green-600" />;
  }
  
  if (source === 'GDRIVE') {
    return (
      <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.527 9.252 2.73 15.762h7.612l1.897-3.256H6.527zm4.016 6.51h7.612L14.37 9.252H8.758l1.785 6.51zm7.745-6.51-1.897-3.256H8.609L6.527 9.252h11.761z"/>
      </svg>
    );
  }
  
  // Ícone baseado no formato para externos
  switch (format?.toUpperCase()) {
    case 'PDF':
      return <FileText className="w-6 h-6 text-red-600" />;
    case 'ZIP':
    case 'RAR':
      return <Archive className="w-6 h-6 text-yellow-600" />;
    case 'VIDEO':
    case 'MP4':
      return <Play className="w-6 h-6 text-purple-600" />;
    default:
      return <ExternalLink className="w-6 h-6 text-gray-600" />;
  }
}

// Badge da origem do arquivo
function getSourceBadge(source: string) {
  const badges = {
    'SUPABASE': (
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
        📦 Hospedado
      </span>
    ),
    'GDRIVE': (
      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
        📁 Google Drive
      </span>
    ),
    'EXTERNAL': (
      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
        🔗 Link Externo
      </span>
    )
  };
  
  return badges[source as keyof typeof badges] || badges['EXTERNAL'];
}

// Texto do botão baseado na origem
function getDownloadButtonText(source: string): string {
  switch (source) {
    case 'SUPABASE':
      return 'Baixar Material';
    case 'GDRIVE':
      return 'Baixar do Drive';
    case 'EXTERNAL':
      return 'Acessar Material';
    default:
      return 'Baixar';
  }
}
