# Componente AgendamentoBotao

Este componente fornece um botão de agendamento reutilizável que abre o modal de WhatsApp quando clicado.

## Importação

```tsx
import AgendamentoBotao from '@/app/blogflorescerhumano/components/agendamento-botao';
```

## Como usar

```tsx
// Uso básico
<AgendamentoBotao />

// Personalizar texto
<AgendamentoBotao>Agendar consulta agora</AgendamentoBotao>

// Exemplo com diferentes variantes e tamanhos
<AgendamentoBotao variant="primary" size="md" />
<AgendamentoBotao variant="secondary" size="lg" fullWidth={true} />
<AgendamentoBotao variant="ghost" size="sm" icon={false}>Sem ícone</AgendamentoBotao>

// Com classes personalizadas
<AgendamentoBotao className="mt-8 mx-auto" />
```

## Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| variant | 'primary' \| 'secondary' \| 'ghost' | 'primary' | Estilo visual do botão |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Tamanho do botão |
| fullWidth | boolean | false | Se o botão deve ocupar a largura total disponível |
| className | string | '' | Classes CSS adicionais para personalização |
| icon | boolean | true | Se deve mostrar o ícone de calendário |
| children | ReactNode | 'Agendar primeira sessão' | Conteúdo de texto do botão |

## Observações

- Este botão requer que o componente esteja dentro de um `WhatsAppModalProvider` para funcionar corretamente
- Certifique-se de que o arquivo `layout.tsx` da página inclua o `WhatsAppModalProvider`
