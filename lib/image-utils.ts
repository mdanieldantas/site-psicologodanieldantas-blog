/**
 * Utilitários para gerenciamento de imagens do blog
 */

/**
 * Gera URL da imagem com fallback e retrocompatibilidade
 * @param imagem_capa_arquivo - Nome do arquivo ou caminho completo da imagem
 * @param categoriaSlug - Slug da categoria do artigo
 * @returns URL completa da imagem
 */
export function getImageUrl(
  imagem_capa_arquivo: string | null, 
  categoriaSlug: string
): string {
  // Se não tem arquivo ou é vazio, usa imagem padrão
  if (!imagem_capa_arquivo || imagem_capa_arquivo.trim() === '') {
    return '/blogflorescerhumano/sem-imagem.webp';
  }
  
  // Retrocompatibilidade: se já tem barra, é formato antigo
  if (imagem_capa_arquivo.includes('/')) {
    return `/blogflorescerhumano/${imagem_capa_arquivo}`;
  }
  
  // Formato novo: usa slug da categoria + nome do arquivo
  return `/blogflorescerhumano/${categoriaSlug}/${imagem_capa_arquivo}`;
}

/**
 * Verifica se tem imagem válida (não é null, undefined ou string vazia)
 * @param imagem_capa_arquivo - Nome do arquivo da imagem
 * @returns true se tem imagem válida
 */
export function hasValidImage(imagem_capa_arquivo: string | null): boolean {
  return !!(imagem_capa_arquivo && imagem_capa_arquivo.trim() !== '');
}

/**
 * Gera URL da imagem para metadados OG/Twitter
 * @param imagem_capa_arquivo - Nome do arquivo ou caminho completo da imagem
 * @param categoriaSlug - Slug da categoria do artigo
 * @param baseUrl - URL base do site (opcional)
 * @returns URL absoluta da imagem
 */
export function getOgImageUrl(
  imagem_capa_arquivo: string | null,
  categoriaSlug: string,
  baseUrl?: string
): string {
  const imageUrl = getImageUrl(imagem_capa_arquivo, categoriaSlug);
  
  if (baseUrl) {
    return new URL(imageUrl, baseUrl).toString();
  }
  
  return imageUrl;
}
