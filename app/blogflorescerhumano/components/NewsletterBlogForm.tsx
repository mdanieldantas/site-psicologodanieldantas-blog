'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, AlertCircle } from 'lucide-react';
import { subscribeToNewsletter, resendConfirmationEmail, type NewsletterFormState } from '../actions/newsletterBlogActions';

const NewsletterSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um endereço de e-mail válido.' }),
});

type NewsletterFormValues = z.infer<typeof NewsletterSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? 'Enviando...' : 'Inscrever-se'}
    </Button>
  );
}

function ResendButton({ email }: { email: string }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      aria-disabled={pending}
      variant="outline" 
      size="sm"
      className="mt-2"
    >
      {pending ? 'Reenviando...' : 'Reenviar e-mail de confirmação'}
    </Button>
  );
}

export function NewsletterBlogForm() {
  const initialState: NewsletterFormState = { message: '', type: 'idle' };
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState);
  const [resendState, resendAction] = useActionState(resendConfirmationEmail, initialState);
  const [showResendForm, setShowResendForm] = React.useState(false);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: {
      email: '',
    },
  });

  const resendForm = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: {
      email: state.email || '',
    },
  });

  // Reset o formulário principal quando há sucesso
  React.useEffect(() => {
    if (state.type === 'success' && !state.status) {
      form.reset();
    }
    
    // Preenche automaticamente o email no formulário de reenvio
    if (state.email && state.status === 'pendente') {
      resendForm.setValue('email', state.email);
    }
  }, [state, form, resendForm]);

  // Exibir o formulário de reenvio quando o status for pendente
  React.useEffect(() => {
    if (state.status === 'pendente') {
      setShowResendForm(true);
    } else {
      setShowResendForm(false);
    }
  }, [state.status]);

  return (
    <div className="space-y-4">
      {/* Formulário principal de inscrição */}
      <Form {...form}>
        <form action={formAction} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Seu melhor e-mail</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu melhor e-mail"
                    {...field}
                    type="email"
                    aria-label="Endereço de e-mail para newsletter"
                    className="bg-white text-gray-900 placeholder-gray-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {state.message && state.type === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <Mail className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{state.message}</AlertDescription>
            </Alert>
          )}

          {state.message && state.type === 'error' && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{state.message}</AlertDescription>
            </Alert>
          )}

          {!showResendForm && <SubmitButton />}
        </form>
      </Form>

      {/* Formulário de reenvio de confirmação */}
      {showResendForm && (
        <Form {...resendForm}>
          <form action={resendAction} className="border-t pt-4 mt-4 border-gray-200">
            <h4 className="text-sm font-medium mb-2">Não recebeu o email de confirmação?</h4>
            
            <FormField
              control={resendForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email para reenvio</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      aria-label="Email para reenvio de confirmação"
                      className="bg-white text-gray-900 placeholder-gray-500 mb-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {resendState.message && resendState.type === 'success' && (
              <Alert className="bg-green-50 border-green-200 mb-2">
                <Mail className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{resendState.message}</AlertDescription>
              </Alert>
            )}

            {resendState.message && resendState.type === 'error' && (
              <Alert className="bg-red-50 border-red-200 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{resendState.message}</AlertDescription>
              </Alert>
            )}

            <ResendButton email={resendForm.getValues('email')} />
          </form>
        </Form>
      )}
    </div>
  );
}
