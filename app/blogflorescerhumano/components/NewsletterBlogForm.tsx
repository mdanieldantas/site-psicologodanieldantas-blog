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
import { subscribeToNewsletter, type NewsletterFormState } from '../actions/newsletterBlogActions';

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

export function NewsletterBlogForm() {
  const initialState: NewsletterFormState = { message: '', type: 'idle' };
  const [state, formAction] = useActionState(subscribeToNewsletter, initialState);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: {
      email: '',
    },
  });

  React.useEffect(() => {
    if (state.type === 'success') {
      form.reset();
    }
  }, [state, form.reset]);


  return (
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

        {state.message && (
          <p className={`text-sm ${state.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
            {state.message}
          </p>
        )}

        <SubmitButton />
      </form>
    </Form>
  );
}
