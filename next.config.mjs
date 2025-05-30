/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configurações específicas para Next.js 15 e Vercel
  experimental: {
    // Optimizações para deploy
    optimizePackageImports: ['@supabase/supabase-js', 'lucide-react'],
  },
  // Força ID de build consistente para evitar ChunkLoadError
  generateBuildId: async () => {
    return process.env.VERCEL_GIT_COMMIT_SHA || 
           process.env.GITHUB_SHA || 
           'development-' + Date.now();
  },
  // Configurações para melhor performance no deploy
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Headers para melhor estabilidade
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
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
  
  // Webpack config simplificado para melhor estabilidade
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Configuração de chunks mais estável e simples
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
}

export default nextConfig
