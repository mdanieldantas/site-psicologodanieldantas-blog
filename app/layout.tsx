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
import { Suspense } from "react";

// ✅ SISTEMA UNIFICADO DE METADADOS
import { createMetadata } from "@/lib/metadata-config";

// Configuração da fonte principal (Inter) com subset latino e como variável CSS
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// ✅ METADADOS OTIMIZADOS PARA LANDING PAGE PRINCIPAL
export const metadata: Metadata = createMetadata({
  title: "Psicólogo Daniel Dantas | Terapia Online Humanista | CRP 11/11854",
  description: "Terapia online humanista c/ Psicólogo Daniel Dantas p/ ansiedade, estresse, autoconhecimento. Espaço sensível a questões étnico-raciais e LGBTQIA+. BR/Mundo",
  path: "/",
  images: ["/foto-psicologo-daniel-dantas.webp"],
  type: "website",
  robots: { index: true, follow: true }
});

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
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Otimização para recursos de terceiros */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com"/>
        <link rel="dns-prefetch" href="https://www.google-analytics.com"/>
        <link rel="dns-prefetch" href="https://vitals.vercel-analytics.com"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        {/* Preload crítico de recursos */}
        <GlobalResourcePreloader />
        {/* Adiciona o script do Google Tag Manager se o ID estiver definido */}
        {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID}/>}
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased overflow-x-hidden w-full", fontSans.variable)}>
        <WhatsAppModalProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Suspense fallback={null}>
              <CookieConsent/>
              <GlobalPerformanceOptimizer/>
              <SpeedInsights debug={false}/>
            </Suspense>
          </ThemeProvider>
        </WhatsAppModalProvider>
      </body>
    </html>
  );
}
