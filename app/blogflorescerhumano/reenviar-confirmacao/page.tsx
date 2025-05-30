'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

// Componentes UI
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Ícones
import { ArrowLeft, Mail, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

// Imports para server actions
import { resendConfirmationEmail, type NewsletterFormState } from '../actions/newsletterBlogActions';

// Schema para validação
const ResendSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
});

type ResendFormValues = z.infer<typeof ResendSchema>;

// Componente para o botão, mostrando estado de pending
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full bg-[#735B43] hover:bg-[#5d4935] text-white"
    >
      {pending ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          Enviando...
        </>
      ) : (
        'Reenviar E-mail de Confirmação'
      )}
    </Button>
  );
}

export default function ReenviarConfirmacaoPage() {
  const initialState: NewsletterFormState = { message: '', type: 'idle' };
  const [state, formAction] = useActionState(resendConfirmationEmail, initialState);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ResendFormValues>({
    resolver: zodResolver(ResendSchema),
    defaultValues: {
      email: '',
    },
  });

  // Reset form e atualiza estado quando houver resposta
  const onSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4" style={{ backgroundColor: '#f9f5f0' }}>
      <Card className="w-full max-w-md shadow-lg animate-in fade-in duration-500 slide-in-from-bottom-4" 
        style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e0d8'
        }}>
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <div className="w-40 h-20 relative mb-4">
            <Image 
              src="/blogflorescerhumano/logos-blog/navbar-logo-florescer-humano-horizontal.webp" 
              alt="Logo Florescer Humano" 
              fill 
              style={{objectFit: 'contain'}} 
            />
          </div>
          <CardTitle className="text-2xl font-serif text-[#735B43]">Reenviar E-mail de Confirmação</CardTitle>
          <CardDescription className="text-[#8A7A68]">Florescer Humano - Blog</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {!submitted || state.type === 'error' ? (
            <>
              <p className="text-center mb-4 text-gray-600">
                Digite seu e-mail abaixo para receber um novo link de confirmação para sua inscrição na newsletter.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} action={formAction} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seu e-mail</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="seuemail@exemplo.com"
                            {...field}
                            type="email"
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {state.message && state.type === 'error' && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">{state.message}</AlertDescription>
                    </Alert>
                  )}

                  <SubmitButton />
                </form>
              </Form>
            </>
          ) : state.type === 'success' && (
            <Alert className="bg-green-50 border-green-200 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <AlertTitle className="text-green-800">E-mail Reenviado!</AlertTitle>
                  <AlertDescription className="text-sm mt-1">
                    {state.message}
                  </AlertDescription>
                </div>
              </div>
              
              <div className="bg-[#f0f5f1] p-4 rounded-md mt-4 border border-[#cce5d2]">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-[#2e7c41]" />
                  <p className="font-medium text-[#2e7c41]">O que fazer agora:</p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-[#486854]">
                  <li>Verifique sua caixa de entrada</li>
                  <li>Confira também sua pasta de Spam/Lixo Eletrônico</li>
                  <li>Clique no link de confirmação que enviamos</li>
                </ul>
              </div>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button 
            variant="outline"
            size="sm" 
            asChild
            className="border-[#735B43] hover:bg-[#f5f0e9] hover:text-[#5d4935]"
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
