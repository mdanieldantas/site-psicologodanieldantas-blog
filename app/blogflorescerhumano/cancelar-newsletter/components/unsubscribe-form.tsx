'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { handleUnsubscribe, UnsubscribeState } from '@/app/blogflorescerhumano/actions/newsletterBlogActions';

// Componente para o botão, mostrando estado de pending
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="destructive">
      {pending ? 'Cancelando...' : 'Sim, Confirmar Cancelamento'}
    </Button>
  );
}

interface UnsubscribeFormProps {
  token: string;
  email: string;
}

export function UnsubscribeForm({ token, email }: UnsubscribeFormProps) {  const initialState: UnsubscribeState = { message: '', type: 'idle' };
  const [state, formAction] = useActionState(handleUnsubscribe, initialState);

  return (
    <div className="container mx-auto px-4 py-8 text-center max-w-md">
      <h1 className="text-2xl font-bold mb-4">Cancelar Inscrição</h1>

      {state.type === 'success' ? (
        <p className="text-green-600 mb-4">{state.message}</p>
      ) : (
        <>
          <p className="mb-4">
            Tem certeza que deseja cancelar a inscrição da newsletter para o e-mail: <br />
            <strong className="break-all">{email}</strong>?
          </p>
          <form action={formAction}>
            <input type="hidden" name="token" value={token} />
            <SubmitButton />
            {state.type === 'error' && (
              <p className="text-red-600 mt-4">{state.message}</p>
            )}
          </form>
        </>
      )}
       {/* Adicionar link para voltar ao blog ou home */}
    </div>
  );
}
