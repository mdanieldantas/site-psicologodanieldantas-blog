import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "../styles/globals.css"; // Importa estilos globais
import { cn } from "@/lib/utils"; // Utilitário para mesclar classes CSS
import { ThemeProvider } from "@/components/theme-provider"; // Provedor para gerenciamento de tema (dark/light)
// Corrigido: Importação padrão para Analytics
import Analytics from "@/components/analytics"; // Componente para analytics (ex: Vercel Analytics)
import { SpeedInsights } from "@vercel/speed-insights/next"; // Componente para Vercel Speed Insights
import CookieConsent from "@/components/cookie-consent"; // Componente para banner de consentimento de cookies
import { GoogleTagManager } from '@next/third-parties/google'; // Componente para Google Tag Manager
import GoogleSiteVerification from "./google-site-verification"; // Componente para verificação do Google Search Console
import SchemaMarkup from "./schema-markup"; // Componente para adicionar dados estruturados (Schema.org)

// Configuração da fonte principal (Inter) com subset latino e como variável CSS
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Metadados padrão para SEO e compartilhamento social
export const metadata: Metadata = {
  title: "Psicólogo Daniel Dantas | Terapia Online Humanista",
  description: "Psicólogo humanista com foco em Abordagem Centrada na Pessoa (ACP) e Focalização. Atendimento online para autoconhecimento, ansiedade, relacionamentos e mais.",
  keywords: "psicólogo, terapia online, psicólogo humanista, abordagem centrada na pessoa, acp, focalização, psicoterapia, Daniel Dantas, psicólogo online, terapia humanista",
  authors: [{ name: "Daniel Dantas", url: "https://psicologodanieldantas.com" }],
  creator: "Daniel Dantas",
  publisher: "Daniel Dantas",
  // ... (outros metadados como openGraph, twitter, icons, manifest)
};

// Configurações da viewport para responsividade
export const viewport: Viewport = {
  themeColor: "#ffffff", // Cor base para a UI do navegador (modo claro)
  // ... (outras configurações de viewport)
};

// Componente RootLayout: define a estrutura HTML base da aplicação
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Componente para verificação do site no Google */}
        <GoogleSiteVerification />
        {/* Componente para adicionar dados estruturados JSON-LD */}
        <SchemaMarkup />
        {/* Adiciona o script do Google Tag Manager se o ID estiver definido */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
        )}
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased", // Classes base para o corpo da página
          fontSans.variable // Aplica a variável da fonte Inter
        )}
      >
        {/* Provedor de Tema: Habilita a troca entre modo claro e escuro */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Conteúdo principal da página renderizado aqui */}
          {children}
          {/* Componente para o banner de consentimento de cookies */}
          <CookieConsent />
          {/* Componente para Analytics da Vercel */}
          <Analytics />
          {/* Componente para Speed Insights da Vercel */}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
