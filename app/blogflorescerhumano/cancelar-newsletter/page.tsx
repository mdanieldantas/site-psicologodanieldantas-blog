import { getSupabaseServiceRoleClient } from '@/lib/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import { cancelNewsletterAction } from './actions';

// Importações dos componentes UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Icons
import { Heart, Mail, ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";

async function getSubscriberInfo(token: string | undefined) {
  if (!token) {
    return { error: 'Token de cancelamento ausente.', subscriber: null };
  }

  const supabase = getSupabaseServiceRoleClient();
  const { data: subscriber, error } = await supabase
    .from('newsletter_assinantes')
    .select('email, status_confirmacao')
    .eq('unsubscribe_token', token)
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar info do assinante para cancelar:', error);
    return { error: 'Erro ao validar o link de cancelamento.', subscriber: null };
  }

  if (!subscriber) {
    return { error: 'Link de cancelamento inválido ou já utilizado.', subscriber: null };
  }

  if (subscriber.status_confirmacao === 'cancelado') {
    return { error: `O e-mail ${subscriber.email} já teve a inscrição cancelada.`, subscriber: { email: subscriber.email } };
  }

  return { error: null, subscriber };
}

// Componente principal da página
export default async function CancelarNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const { error, subscriber } = await getSubscriberInfo(token);
  // Caso de erro sem informações do subscriber
  if (error && !subscriber?.email) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4 bg-[#F8F5F0]">
        <Card className="w-full max-w-md shadow-lg bg-white border border-[#E8E6E2] rounded-lg">
          <CardHeader className="flex flex-col items-center text-center pb-2">
            <div className="w-40 h-20 relative mb-4">
              <Image 
                src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.webp" 
                alt="Logo Florescer Humano" 
                fill 
                style={{objectFit: 'contain'}} 
              />
            </div>
            <CardTitle className="text-2xl font-serif text-[#583B1F]">Ops! Algo não está certo</CardTitle>
            <CardDescription className="text-[#7D6E63] font-sans">Florescer Humano - Blog</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-red-50 border-red-200 shadow-sm rounded-lg">
              <div className="flex items-center gap-3">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <AlertTitle className="font-serif text-red-800">Link inválido</AlertTitle>
                  <AlertDescription className="text-sm mt-1 font-sans text-[#7D6E63]">{error}</AlertDescription>
                </div>
              </div>
            </Alert>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button 
              variant="outline"
              size="sm" 
              asChild
              className="border-[#583B1F] text-[#583B1F] bg-white hover:bg-[#F8F5F0] hover:text-[#583B1F] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl font-sans"
            >
              <Link href="/blogflorescerhumano" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Blog
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Caso de subscriber já cancelado
  if (error && subscriber?.email) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4 bg-[#F8F5F0]">
        <Card className="w-full max-w-md shadow-lg bg-white border border-[#E8E6E2] rounded-lg">
          <CardHeader className="flex flex-col items-center text-center pb-2">
            <div className="w-40 h-20 relative mb-4">
              <Image 
                src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.webp" 
                alt="Logo Florescer Humano" 
                fill 
                style={{objectFit: 'contain'}} 
              />
            </div>
            <CardTitle className="text-2xl font-serif text-[#583B1F]">Já nos despedimos</CardTitle>
            <CardDescription className="text-[#7D6E63] font-sans">Florescer Humano - Blog</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200 shadow-sm rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <AlertTitle className="font-serif text-blue-800">Inscrição já cancelada</AlertTitle>
                  <AlertDescription className="text-sm mt-1 font-sans text-[#7D6E63]">
                    O e-mail <strong>{subscriber.email}</strong> já teve sua inscrição cancelada anteriormente.
                  </AlertDescription>
                </div>
              </div>
            </Alert>

            <div className="bg-[#F8F5F0] p-4 rounded-md border border-[#E8E6E2]">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-[#A57C3A]" />
                <h4 className="font-serif font-medium text-[#583B1F]">Sempre bem-vindo de volta!</h4>
              </div>
              <p className="text-sm text-[#7D6E63] font-sans">
                Se mudou de ideia, pode se inscrever novamente em nossa newsletter a qualquer momento. 
                Estaremos aqui para apoiar sua jornada de crescimento pessoal.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              variant="outline"
              size="sm" 
              asChild
              className="border-[#583B1F] text-[#583B1F] bg-white hover:bg-[#F8F5F0] hover:text-[#583B1F] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl font-sans"
            >
              <Link href="/blogflorescerhumano" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Blog
              </Link>
            </Button>
            <Button 
              size="sm"
              asChild
              className="bg-[#583B1F] hover:bg-[#6B7B3F] text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl font-sans"
            >
              <Link href="/blogflorescerhumano#newsletter" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Inscrever-se novamente
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Caso principal: mostrar formulário de cancelamento
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4 bg-[#F8F5F0]">
      <Card className="w-full max-w-lg shadow-lg animate-in fade-in duration-500 slide-in-from-bottom-4 bg-white border border-[#E8E6E2] rounded-lg">
        <CardHeader className="flex flex-col items-center text-center pb-4">
          <div className="w-40 h-20 relative mb-4">
            <Image 
              src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.webp" 
              alt="Logo Florescer Humano" 
              fill 
              style={{objectFit: 'contain'}} 
            />
          </div>
          <CardTitle className="text-2xl font-serif text-[#583B1F]">Sentiremos sua falta</CardTitle>
          <CardDescription className="text-[#7D6E63] font-sans">Florescer Humano - Blog</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="bg-[#F8F5F0] p-6 rounded-lg border border-[#E8E6E2]">
              <Heart className="h-8 w-8 text-[#A57C3A] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-semibold text-[#583B1F] mb-2">
                Obrigado por ter caminhado conosco!
              </h3>
              <p className="text-sm text-[#7D6E63] font-sans leading-relaxed">
                Respeitamos sua decisão de não receber mais nossos conteúdos. Foi um prazer fazer parte 
                da sua jornada.
              </p>            </div>

            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h4 className="font-serif font-medium text-red-800 mb-1">Antes de prosseguir:</h4>
                  <ul className="text-sm text-red-700 font-sans space-y-1">
                    <li>• Esta ação não pode ser desfeita</li>
                    <li>• Você parará de receber todos os nossos conteúdos</li>
                    <li>• Pode se inscrever novamente quando quiser</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button 
              variant="outline"
              size="sm" 
              asChild
              className="border-[#583B1F] text-[#583B1F] bg-white hover:bg-[#F8F5F0] hover:text-[#583B1F] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl font-sans flex-1"
            >
              <Link href="/blogflorescerhumano" className="flex items-center gap-1 justify-center">
                <ArrowLeft className="h-4 w-4" />
                Cancelar e voltar
              </Link>
            </Button>
              <form action={cancelNewsletterAction} className="flex-1">
              <input type="hidden" name="token" value={token} />
              <Button 
                type="submit"
                variant="destructive"
                size="sm"
                className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl font-sans"
              >
                Confirmar cancelamento
              </Button>
            </form>
          </div>
          
          <p className="text-xs text-center text-[#7D6E63] font-sans italic">
            "Obrigado por ter caminhado conosco. Desejamos que sua jornada continue repleta de crescimento e autoconhecimento." 💚
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
