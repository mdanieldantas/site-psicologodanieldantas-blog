// next-vercel-config.js
// Configurações específicas para deploy na Vercel com Next.js 15

// Este arquivo resolve problemas comuns de ChunkLoadError no deploy
module.exports = {
  // Configurações para evitar ChunkLoadError
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production',
    VERCEL_ENV: process.env.VERCEL_ENV || 'production',
    FORCE_DYNAMIC: 'true',
  },
  
  // Headers para melhor cache e estabilidade
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
