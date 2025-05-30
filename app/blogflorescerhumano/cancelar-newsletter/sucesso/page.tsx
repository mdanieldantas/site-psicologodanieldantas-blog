import Image from 'next/image';
import Link from 'next/link';

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
import { Heart, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function CancelamentoSucessoPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4 bg-[#F8F5F0]">
      <Card className="w-full max-w-md shadow-lg animate-in fade-in duration-500 slide-in-from-bottom-4 bg-white border border-[#E8E6E2] rounded-lg">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <div className="w-40 h-20 relative mb-4">
            <Image 
              src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.webp" 
              alt="Logo Florescer Humano" 
              fill 
              style={{objectFit: 'contain'}} 
            />
          </div>
          <CardTitle className="text-2xl font-serif text-[#583B1F]">Até breve!</CardTitle>
          <CardDescription className="text-[#7D6E63] font-sans">Florescer Humano - Blog</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert className="bg-green-50 border-green-200 shadow-sm rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <AlertTitle className="font-serif text-green-800">Cancelamento realizado com sucesso</AlertTitle>
                <AlertDescription className="text-sm mt-1 font-sans text-[#7D6E63]">
                  Sua inscrição foi cancelada conforme solicitado. Você não receberá mais nossos e-mails.
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <div className="bg-[#F8F5F0] p-6 rounded-lg border border-[#E8E6E2] text-center">
            <Heart className="h-8 w-8 text-[#A57C3A] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-semibold text-[#583B1F] mb-3">
              Obrigado por ter caminhado conosco
            </h3>
            <p className="text-sm text-[#7D6E63] font-sans leading-relaxed mb-4">
              Foi uma honra fazer parte da sua jornada de crescimento pessoal e autoconhecimento. 
              Desejamos que sua caminhada continue repleta de descobertas e transformações positivas.
            </p>
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <p className="text-xs text-[#7D6E63] font-sans">
                <strong className="text-[#583B1F]">Lembre-se:</strong> Você pode se inscrever novamente 
                em nossa newsletter quando quiser. Estaremos sempre aqui para apoiá-lo.
              </p>
            </div>
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
