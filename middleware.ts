import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Importa do pacote auth-helpers-nextjs como solicitado
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: new Headers(request.headers),
    },
  });

  // Cria o cliente Supabase para o middleware (a chamada permanece a mesma)
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Atualiza a sessão do usuário. O cliente Supabase agora gerencia os cookies.
  await supabase.auth.getSession();

  // --- Mantém a lógica de cabeçalhos existente ---
  if (
    request.nextUrl.pathname.startsWith("/_next/static") ||
    request.nextUrl.pathname.startsWith("/public/") ||
    request.nextUrl.pathname.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/)
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }
  else if (!request.nextUrl.pathname.includes('.')) {
    response.headers.set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");


  // Retorna a resposta (que pode ter sido modificada pelo Supabase para definir cookies)
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};