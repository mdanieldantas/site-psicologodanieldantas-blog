// Teste dos utilitários de imagem
// Execute com: node test-image-utils.js

// Simular as funções (versão simplificada para teste)
function getImageUrl(imagemCapa, categoriaSlug) {
  if (!imagemCapa) {
    return '/blogflorescerhumano/sem-imagem.webp';
  }
  
  if (imagemCapa.startsWith('/') || imagemCapa.startsWith('http')) {
    return imagemCapa;
  }
  
  return `/blogflorescerhumano/${categoriaSlug}/${imagemCapa}`;
}

function hasValidImage(imagemCapa) {
  return !!(imagemCapa && imagemCapa.trim());
}

// Testes
console.log('=== TESTES DOS UTILITÁRIOS DE IMAGEM ===\n');

console.log('Teste 1 - Sem imagem:');
console.log('Input: null, "autoconhecimento-desenvolvimento-pessoal"');
console.log('Output:', getImageUrl(null, 'autoconhecimento-desenvolvimento-pessoal'));
console.log('hasValidImage:', hasValidImage(null));
console.log('');

console.log('Teste 2 - Apenas nome do arquivo:');
console.log('Input: "minha-imagem.jpg", "bem-estar-emocional-e-saude-mental"');
console.log('Output:', getImageUrl('minha-imagem.jpg', 'bem-estar-emocional-e-saude-mental'));
console.log('hasValidImage:', hasValidImage('minha-imagem.jpg'));
console.log('');

console.log('Teste 3 - Caminho completo existente:');
console.log('Input: "/blogflorescerhumano/sobre-poema-mae-filho.webp", "qualquer-categoria"');
console.log('Output:', getImageUrl('/blogflorescerhumano/sobre-poema-mae-filho.webp', 'qualquer-categoria'));
console.log('hasValidImage:', hasValidImage('/blogflorescerhumano/sobre-poema-mae-filho.webp'));
console.log('');

console.log('Teste 4 - URL externa:');
console.log('Input: "https://exemplo.com/imagem.jpg", "qualquer-categoria"');
console.log('Output:', getImageUrl('https://exemplo.com/imagem.jpg', 'qualquer-categoria'));
console.log('hasValidImage:', hasValidImage('https://exemplo.com/imagem.jpg'));
console.log('');

console.log('=== ESTRUTURA ESPERADA DE PASTAS ===');
console.log('public/blogflorescerhumano/');
console.log('├── sem-imagem.webp (fallback)');
console.log('├── autoconhecimento-desenvolvimento-pessoal/');
console.log('│   └── [imagens-da-categoria]');
console.log('├── bem-estar-emocional-e-saude-mental/');
console.log('│   └── [imagens-da-categoria]');
console.log('├── florescer-na-vida/');
console.log('│   └── [imagens-da-categoria]');
console.log('└── [outras-categorias]/');
console.log('    └── [imagens-da-categoria]');
