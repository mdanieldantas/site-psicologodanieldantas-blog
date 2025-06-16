'use client';

import React from 'react';
import { Download, FileText, Archive, Play, Database, ExternalLink } from 'lucide-react';
import { Tables } from '@/types/supabase';

// Tipo do artigo com campos multimídia
type ArtigoMultimidia = Tables<'artigos'> & {
  categorias?: { nome: string; slug: string };
  autores?: { nome: string };
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
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'download', {
        file_name: artigo.download_title || 'material',
        content_type: artigo.download_format || 'unknown',
        source_type: artigo.download_source
      });
    }
    
    // Abrir download/visualização
    window.open(downloadInfo.finalUrl, '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 my-6">
      <div className="flex items-center gap-4">
        {/* Ícone baseado na origem e formato */}
        <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
          {getSourceIcon(artigo.download_source, artigo.download_format)}
        </div>
        
        {/* Informações do material */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg">
            {artigo.download_title || 'Material para Download'}
          </h3>
          
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
              <span className="text-gray-500">
                📁 {artigo.download_size_mb} MB
              </span>
            )}
            
            {/* Badge da origem */}
            {getSourceBadge(artigo.download_source)}
          </div>
        </div>
        
        {/* Botão de download */}
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          {getDownloadButtonText(artigo.download_source)}
        </button>
      </div>
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
    return <Database className="w-6 h-6 text-green-600" />;
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
