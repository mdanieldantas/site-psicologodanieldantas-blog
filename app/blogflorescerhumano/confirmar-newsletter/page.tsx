import { getSupabaseServiceRoleClient } from '@/lib/supabase/server'; // Importa o helper
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

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

// Icons - Requer instalação de lucide-react: npm install lucide-react
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Mail, Info, AlertTriangle } from "lucide-react";

export default async function ConfirmarNewsletterPage({ searchParams }: { searchParams: { token?: string } }) {
  const { token } = searchParams;
  // Variáveis para armazenar o estado e as mensagens
  type ResultStatus = 'success' | 'error' | 'already-confirmed';
  let status: ResultStatus = 'error';
  let title = '';
  let description = '';

  if (!token) {
    status = 'error';
    title = 'Token ausente';
    description = 'O token de confirmação não foi fornecido. Verifique se você clicou corretamente no link enviado por e-mail.';
  } else {
    const supabase = getSupabaseServiceRoleClient();
    const { data: subscriber, error } = await supabase
      .from('newsletter_assinantes')
      .select('id, status_confirmacao, token_confirmacao, token_expires_at') // <-- Selecionar expiração
      .eq('token_confirmacao', token)
      .maybeSingle();

    if (error) {
      status = 'error';
      title = 'Erro ao validar';
      description = 'Ocorreu um erro ao validar o token. Por favor, tente novamente mais tarde.';
    } else if (!subscriber || (subscriber.token_expires_at && new Date(subscriber.token_expires_at) < new Date())) {
      // Se expirou ou não existe, invalida o token no banco para segurança (se existir)
      if (subscriber) {
        await supabase
          .from('newsletter_assinantes')
          .update({ token_confirmacao: null, token_expires_at: null })
          .eq('id', subscriber.id);
      }
      status = 'error';
      title = 'Token inválido ou expirado';
      description = 'O token fornecido é inválido, expirou ou já foi utilizado. Por favor, inscreva-se novamente.';
    } else if (subscriber.status_confirmacao === 'confirmado') {
      status = 'already-confirmed';
      title = 'E-mail já confirmado!';
      description = 'Seu e-mail já foi confirmado anteriormente. Você já está recebendo nossa newsletter.';
    } else {
      // Atualizar status para confirmado e limpar token/expiração
      const { error: updateError } = await supabase
        .from('newsletter_assinantes')
        .update({
          status_confirmacao: 'confirmado',
          data_confirmacao: new Date().toISOString(),
          token_confirmacao: null,
          token_expires_at: null // <-- Limpar expiração
        })
        .eq('id', subscriber.id);

      if (updateError) {
        status = 'error';
        title = 'Erro ao confirmar';
        description = 'Ocorreu um erro ao confirmar sua inscrição. Por favor, tente novamente mais tarde.';
      } else {
        status = 'success';
        title = 'Inscrição confirmada com sucesso!';
        description = 'Sua inscrição na nossa newsletter foi confirmada com sucesso! Em breve você começará a receber nossos conteúdos exclusivos diretamente em seu e-mail.';
      }
    }
  }  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4 bg-[#F8F5F0]">
      <Card className="w-full max-w-md shadow-lg animate-in fade-in duration-500 slide-in-from-bottom-4 bg-white border border-[#E8E6E2] rounded-lg">
        <CardHeader className="flex flex-col items-center text-center pb-2">          <div className="w-40 h-20 relative mb-4">
            <Image 
              src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.webp" 
              alt="Logo Florescer Humano" 
              fill 
              style={{objectFit: 'contain'}} 
            />
          </div><CardTitle className="text-2xl font-serif text-[#583B1F]">Confirmação da Newsletter</CardTitle>
          <CardDescription className="text-[#7D6E63] font-sans">Florescer Humano - Blog</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">          <Alert 
            variant={status === 'error' ? "destructive" : "default"}
            className={`${
              status === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800' :
              status === 'already-confirmed' ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800' :              status === 'error' ? 'bg-red-50 border-red-200 dark:bg-red-950/50 dark:border-red-800' :
              'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50 dark:border-yellow-800'
            } shadow-sm rounded-lg`}
          >            <div className="flex items-center gap-3">
              {status === 'success' && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />}
              {status === 'error' && <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />}
              {status === 'already-confirmed' && <Mail className="h-5 w-5 text-blue-600 dark:text-blue-500" />}
              
              <div>                <AlertTitle className={`font-serif ${
                  status === 'success' ? 'text-green-800 dark:text-green-300' :
                  status === 'already-confirmed' ? 'text-blue-800 dark:text-blue-300' :
                  status === 'error' ? 'text-red-800 dark:text-red-300' :
                  'text-yellow-800 dark:text-yellow-300'
                }`}>{title}</AlertTitle>
                <AlertDescription className="text-sm mt-1 font-sans text-[#7D6E63]">{description}</AlertDescription>
              </div>
            </div>
          </Alert>          {status === 'success' && (
            <div className="bg-[#f0f5f1] p-4 rounded-md mt-4 border border-[#cce5d2]">              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-[#2e7c41]" />
                <h4 className="font-serif font-medium text-[#2e7c41]">Próximos passos:</h4>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#486854] font-sans">
                <li>Você começará a receber nossos conteúdos em até 24 horas</li>
                <li>Verifique sua caixa de entrada e de promoções</li>
                <li>Adicione nosso email na sua lista de contatos para garantir o recebimento</li>
              </ul>
            </div>
          )}{status === 'error' && (            <div className="bg-muted/50 p-4 rounded-md mt-4 border border-red-100 dark:border-red-800/30">              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <h4 className="font-serif font-medium">Como resolver?</h4>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm opacity-90 font-sans text-[#7D6E63]">
                <li>Verifique se você clicou no link correto do email</li>
                <li>Os links de confirmação expiram após 24 horas</li>
                <li>Você pode solicitar um novo e-mail de confirmação</li>
              </ul>
              <div className="mt-3">                <Link href="/blogflorescerhumano/reenviar-confirmacao" className="text-sm text-[#583B1F] hover:text-[#6B7B3F] transition-colors duration-300 font-sans flex items-center gap-1 underline">
                  <Mail className="h-3.5 w-3.5" />
                  Solicitar novo e-mail de confirmação
                </Link>
              </div>
            </div>
          )}
        </CardContent>        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">          <Button 
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
            {status === 'error' && (            <Button 
              variant="default" 
              size="sm"
              asChild
              className="bg-[#583B1F] hover:bg-[#6B7B3F] text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl font-sans"
            >
              <Link href="/blogflorescerhumano/reenviar-confirmacao" className="flex items-center gap-1">
                <Mail className="h-4 w-4 mr-1" />
                Reenviar e-mail de confirmação
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}