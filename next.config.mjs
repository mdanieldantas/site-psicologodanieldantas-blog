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
    // Otimizações para performance de imagens
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 ano
  },  // Configurações específicas para Next.js 15 e Vercel
  experimental: {
    // Optimizações para deploy e performance
    optimizePackageImports: ['@supabase/supabase-js', 'lucide-react', '@vercel/analytics', 'web-vitals'],
    // Otimizações de bundle
    scrollRestoration: true,
  },
  // Força ID de build consistente para evitar ChunkLoadError
  generateBuildId: async () => {
    return process.env.VERCEL_GIT_COMMIT_SHA || 
           process.env.GITHUB_SHA || 
           'development-' + Date.now();
  },  // Configurações para melhor performance no deploy
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Otimizações de performance avançadas
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true,
    },
  },
    // Headers para melhor estabilidade e performance
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
        source: '/blogflorescerhumano/images/:path*',
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
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
    // Webpack config otimizado para performance
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Configuração de chunks otimizada para performance
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 240000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            enforce: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
            chunks: 'all',
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            priority: 15,
            chunks: 'all',
          },
          vercel: {
            test: /[\\/]node_modules[\\/]@vercel[\\/]/,
            name: 'vercel',
            priority: 10,
            chunks: 'all',
          },
        },
      };

      // Otimizações adicionais
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    return config;
  },
}

export default nextConfig
