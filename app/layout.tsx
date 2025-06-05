import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "../styles/globals.css"; // Importa estilos globais
import { cn } from "@/lib/utils"; // Utilitário para mesclar classes CSS
import { ThemeProvider } from "@/components/theme-provider"; // Provedor para gerenciamento de tema (dark/light)
import { WhatsAppModalProvider } from "@/components/whatsapp-modal-context";
// Componentes de Performance
import GlobalPerformanceOptimizer from "@/components/GlobalPerformanceOptimizer"; // Otimizador global de performance
import GlobalResourcePreloader from "@/components/GlobalResourcePreloader"; // Preload inteligente de recursos
import { SpeedInsights } from "@vercel/speed-insights/next"; // Componente para Vercel Speed Insights
import CookieConsent from "@/components/cookie-consent"; // Componente para banner de consentimento de cookies
import { GoogleTagManager } from '@next/third-parties/google'; // Componente para Google Tag Manager
import SchemaMarkup from "./schema-markup"; // Componente para adicionar dados estruturados (Schema.org)
import { Suspense } from "react";

// Configuração da fonte principal (Inter) com subset latino e como variável CSS
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Metadados padrão para SEO e compartilhamento social
export const metadata: Metadata = {  // Metadados básicos
  title: "Psicólogo Daniel Dantas | Terapia Online Humanista | CRP 11/11854",  
  description: "Terapia online humanista c/ Psicólogo Daniel Dantas p/ ansiedade, estresse, autoconhecimento. Espaço sensível a questões étnico-raciais e LGBTQIA+. BR/Mundo",
  keywords: "psicólogo online, terapia humanista, ansiedade, depressão, burnout, estresse, traumas, autoconhecimento, psicólogo Fortaleza, psicoterapia online, regulação emocional, saúde mental, bem-estar psicológico, atendimento online, Daniel Dantas, CRP 11/11854, abordagem centrada na pessoa, acp, focalização, ataques de pânico, transtorno de ansiedade, TOC, crise existencial, luto, solidão, baixa autoestima, problemas de identidade, mudanças de vida, insegurança, terapia em português, atendimento remoto, psicoterapia para adultos, consulta psicológica online, desenvolvimento pessoal, psicólogo para brasileiros no exterior, atendimento online internacional, terapia para expatriados, psicólogo para portugueses, psicoterapia em língua portuguesa, psicólogo online Portugal, brasileiros em Portugal, psicólogo para imigrantes brasileiros, psicólogo LGBTQIA+ friendly, terapia afirmativa, diversidade sexual, identidade de gênero, acolhimento LGBTQIA+, psicoterapia inclusiva, lésbicas, gays, bissexuais, transgêneros, transexuais, travestis, queer, questionando, intersexo, intersexual, assexual, assexualidade, arromântico, agênero, pansexual, não-binário, gênero fluido, atendimento psicológico para LGBTQIA+, terapia para lésbicas, psicólogo para gays, apoio psicológico transgênero, saúde mental trans, psicologia racial, racismo estrutural, discriminação racial, trauma racial, saúde mental da população negra, identidade racial, apoio psicológico afro-brasileiro, letramento racial, atendimento psicológico antirracista, sofrimento psíquico racial, acolhimento étnico-racial, psicoterapia para pessoas negras, psicólogo especializado em questões raciais, raça e psicologia, atendimento sensível a questões étnicas, ancestralidade, conscientização racial, colorismo, enfrentamento ao racismo, saúde mental indígena, terapia culturalmente sensível, mindfulness, atenção plena, meditação, mindfulness baseado em evidências, terapia de redução de estresse baseada em mindfulness, MBSR, terapia cognitiva baseada em mindfulness, MBCT, meditação de atenção plena, meditação guiada, práticas contemplativas, consciência do momento presente, respiração consciente, escaneamento corporal, body scan, controle da ansiedade com mindfulness, mindfulness para depressão, mindfulness para estresse, práticas de atenção plena, autoconsciência, autorregulação emocional, presença mental, aceitação, compaixão, autocompaixão, psicologia contemplativa, psicoterapia mindfulness, terapia baseada em aceitação e compromisso, ACT, mindfulness e bem-estar, psicologia positiva, habilidades de mindfulness, psicopatologia, especialista em psicopatologia, transtornos mentais, saúde mental especializada, manejo de psicopatologias, prevenção em saúde mental, reabilitação psicossocial, acompanhamento clínico especializado, psicoeducação, psicofarmacologia, interface psiquiatria e psicologia, promoção de saúde mental, psicopatologias na contemporaneidade, adoecimento mental, higiene mental, transtornos somatoformes",
  authors: [{ name: "Daniel Dantas", url: "https://psicologodanieldantas.com.br" }],
  creator: "Daniel Dantas",
  publisher: "Daniel Dantas",
  
  // URL Canônica
  alternates: {
    canonical: "https://psicologodanieldantas.com.br",
  },
    // Open Graph (para compartilhamento em redes sociais)
  openGraph: {
    type: "website",
    locale: "pt_BR",    url: "https://psicologodanieldantas.com.br",
    siteName: "Psicólogo Online - Terapia Humanista",
    title: "Psicólogo Daniel Dantas | Terapia Online Humanista | CRP 11/11854",
    description: "Terapia online humanista c/ Psicólogo Daniel Dantas p/ ansiedade, estresse, autoconhecimento. Espaço sensível a questões étnico-raciais e LGBTQIA+. BR/Mundo.",
    images: [
      {        url: "https://psicologodanieldantas.com.br/foto-psicologo-daniel-dantas.webp",
        width: 1200,
        height: 630,        alt: "Foto do Psicólogo Daniel Dantas",
        type: "image/webp",
      }
    ],
    emails: ['contatomarcosdgomes@gmail.com'],
    phoneNumbers: ['+55-85-986013431'],
    countryName: 'Brasil',  },
  
  // Configurações de SEO e indexação
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
    // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Psicólogo Daniel Dantas | Terapia Online Humanista | CRP 11/11854",
    description: "Terapia online humanista c/ Psicólogo Daniel Dantas p/ ansiedade, estresse, autoconhecimento. Espaço sensível a questões étnico-raciais e LGBTQIA+. BR/Mundo.",
    images: ["https://psicologodanieldantas.com.br/foto-psicologo-daniel-dantas.webp"],
    creator: "@psidanieldantas", // Se tiver um perfil no Twitter, incluir aqui
  },
  // Site já verificado via provedor de domínio no Google Search Console
  // Favicons, Manifest and Other related meta - agora usando os mesmos do blog
  icons: {
    icon: [
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-36x36.png', type: 'image/png', sizes: '36x36' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-72x72.png', type: 'image/png', sizes: '72x72' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-144x144.png', type: 'image/png', sizes: '144x144' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/android-icon-192x192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon.png', type: 'image/png' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-57x57.png', type: 'image/png', sizes: '57x57' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-60x60.png', type: 'image/png', sizes: '60x60' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-72x72.png', type: 'image/png', sizes: '72x72' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-76x76.png', type: 'image/png', sizes: '76x76' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-114x114.png', type: 'image/png', sizes: '114x114' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-120x120.png', type: 'image/png', sizes: '120x120' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-144x144.png', type: 'image/png', sizes: '144x144' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-152x152.png', type: 'image/png', sizes: '152x152' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-180x180.png', type: 'image/png', sizes: '180x180' },
      { url: '/blogflorescerhumano/favicon-blog-florescer-humano/apple-icon-precomposed.png', type: 'image/png', rel: 'apple-touch-icon-precomposed' },
    ],
    shortcut: ['/blogflorescerhumano/favicon-blog-florescer-humano/favicon.ico'],
  },
  manifest: '/blogflorescerhumano/favicon-blog-florescer-humano/manifest.json',
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/blogflorescerhumano/favicon-blog-florescer-humano/ms-icon-144x144.png',
    'msapplication-config': '/blogflorescerhumano/favicon-blog-florescer-humano/browserconfig.xml',
    'theme-color': '#ffffff'
  },
  
  // Outros metadados
  category: "Psicologia",
  applicationName: "Psicólogo Daniel Dantas",
};

// Configurações da viewport para responsividade
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#583B1F" }
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

// Configurações específicas para Next.js 15
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Componente RootLayout: define a estrutura HTML base da aplicação
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {  return (    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Otimização para recursos de terceiros */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com"/>
        <link rel="dns-prefetch" href="https://www.google-analytics.com"/>
        <link rel="dns-prefetch" href="https://vitals.vercel-analytics.com"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        
        {/* Preload crítico de recursos */}
        <GlobalResourcePreloader />
        
        {/* Componente para adicionar dados estruturados JSON-LD */}
        <SchemaMarkup/>
        
        {/* Adiciona o script do Google Tag Manager se o ID estiver definido */}
        {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID}/>}
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased overflow-x-hidden w-full", fontSans.variable)}>
        <WhatsAppModalProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}            <Suspense fallback={null}>
              <CookieConsent/>
              <GlobalPerformanceOptimizer/>
              <SpeedInsights debug={false}/>
            </Suspense>
          </ThemeProvider>        </WhatsAppModalProvider>
      </body>
    </html>
  );
}
