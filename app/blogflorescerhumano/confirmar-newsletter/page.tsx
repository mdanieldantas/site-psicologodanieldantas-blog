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
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Mail, Info, AlertTriangle, ExternalLink } from "lucide-react";

export default async function ConfirmarNewsletterPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
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
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4" style={{ backgroundColor: '#f9f5f0' }}>
      <Card className="w-full max-w-md shadow-lg animate-in fade-in duration-500 slide-in-from-bottom-4" 
        style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e0d8'
        }}>
        <CardHeader className="flex flex-col items-center text-center pb-2">          <div className="w-40 h-20 relative mb-4">
            <Image 
              src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.png" 
              alt="Logo Florescer Humano" 
              fill 
              style={{objectFit: 'contain'}} 
            />
          </div><CardTitle className="text-2xl font-serif text-[#735B43]">Confirmação da Newsletter</CardTitle>
          <CardDescription className="text-[#8A7A68]">Florescer Humano - Blog</CardDescription>
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
              
              <div>
                <AlertTitle className={`${
                  status === 'success' ? 'text-green-800 dark:text-green-300' :
                  status === 'already-confirmed' ? 'text-blue-800 dark:text-blue-300' :
                  status === 'error' ? 'text-red-800 dark:text-red-300' :
                  'text-yellow-800 dark:text-yellow-300'
                }`}>{title}</AlertTitle>
                <AlertDescription className="text-sm mt-1">{description}</AlertDescription>
              </div>
            </div>
          </Alert>          {status === 'success' && (
            <div className="bg-[#f0f5f1] p-4 rounded-md mt-4 border border-[#cce5d2]">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-[#2e7c41]" />
                <h4 className="font-medium text-[#2e7c41]">Próximos passos:</h4>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm text-[#486854]">
                <li>Você começará a receber nossos conteúdos em até 24 horas</li>
                <li>Verifique sua caixa de entrada e de promoções</li>
                <li>Adicione nosso email na sua lista de contatos para garantir o recebimento</li>
              </ul>
            </div>
          )}{status === 'error' && (
            <div className="bg-muted/50 p-4 rounded-md mt-4 border border-red-100 dark:border-red-800/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <h4 className="font-medium">Como resolver?</h4>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm opacity-90">
                <li>Verifique se você clicou no link correto do email</li>
                <li>Os links de confirmação expiram após 48 horas</li>
                <li>Se necessário, inscreva-se novamente em nosso blog</li>
              </ul>
            </div>
          )}
        </CardContent>        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">          <Button 
            variant="outline"
            size="sm" 
            asChild
            className="border-[#735B43] hover:bg-[#f5f0e9] hover:text-[#5d4935] bg-[#735B43] text-white"
          >
            <Link href="/blogflorescerhumano" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Blog
            </Link>
          </Button>
            {status === 'error' && (
            <Button 
              variant="default" 
              size="sm"
              asChild
              className="animate-pulse bg-[#735B43] hover:bg-[#5d4935] text-white"
            >
              <Link href="/blogflorescerhumano#newsletter" className="flex items-center gap-1">
                Inscrever-se novamente
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}