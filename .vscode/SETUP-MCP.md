# Guia de Instalação do Context7 MCP

Este guia explica como configurar o Context7 MCP (Model Context Protocol) no VS Code para obter respostas mais precisas e atualizadas do GitHub Copilot.

## Pré-requisitos

- VS Code instalado
- Extensão GitHub Copilot instalada e configurada
- Extensão GitHub Copilot Chat instalada
- Node.js instalado (necessário para o comando `npx`)

## Passo a Passo para Configuração

### 1. Configurar os arquivos necessários

A pasta `.vscode` já contém os arquivos necessários:

- `mcp.json`: Define o servidor MCP
- `settings.json`: Ativa o MCP no projeto
- `tasks.json`: Configura a inicialização automática

### 2. Verificar a estrutura dos arquivos

O arquivo `mcp.json` deve conter:

```json
{
  "servers": {
    "Context7": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

O arquivo `settings.json` deve conter:

```json
{
  "chat.mcp.enabled": true,
  "chat.mcp.discovery.enabled": true,
  "task.autoDetect": "on",
  "task.allowAutomaticTasks": "on"
}
```

O arquivo `tasks.json` deve conter:

```json
{
  "version": "2.0.0",
  "tasks": [
    {      "label": "Iniciar Context7 MCP",
      "type": "shell",
      "command": "npx", // Executa o comando npx diretamente
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "problemMatcher": [],
      "presentation": {
        "reveal": "silent",
        "panel": "dedicated",
        "showReuseMessage": false,
        "clear": true
      },
      "runOptions": {
        "runOn": "folderOpen" // Tenta iniciar ao abrir a pasta
      },
      "group": {
        "kind": "build",
        "isDefault": true
      }
    }
  ]
}
```

### 3. Inicialização Automática vs. Manual (Importante!)

**Inicialização Automática (via `tasks.json`)**:

- A configuração atual em `tasks.json` tenta iniciar o servidor MCP automaticamente ao abrir o projeto usando o comando `npx`.
- **Limitação**: Este método apenas inicia o processo do servidor, mas **não o integra com o painel de servidores MCP do VS Code**. O servidor pode estar rodando em segundo plano, mas o painel MCP pode mostrá-lo como "Parado".
- **Problemas comuns**: Pode falhar devido a configurações de PATH, permissões do shell (especialmente no Windows/PowerShell) ou políticas de execução de tarefas automáticas do VS Code.

**Inicialização Manual (Recomendado)**:

- **Método**: Usar o comando interno do VS Code.
  1. Pressione `Ctrl+Shift+P`.
  2. Digite "MCP: List Servers".
  3. Selecione "Context7" na lista.
  4. Clique em "Iniciar Servidor".
- **Benefício**: Garante a **integração completa** com o painel MCP do VS Code, mostrando o status correto ("Em execução") e permitindo controle (Parar/Reiniciar).
- **Confiabilidade**: Funciona de forma mais consistente em diferentes sistemas operacionais e configurações.

**Conclusão**: Devido às limitações da inicialização automática via `tasks.json`, **o método recomendado para iniciar o servidor Context7 é manualmente através do comando "MCP: List Servers" > "Iniciar Servidor"**.

### 4. Habilitando Tarefas Automáticas (Opcional)

Se você ainda quiser *tentar* a inicialização automática (ciente das limitações), siga os passos abaixo. Lembre-se que mesmo habilitando, pode não funcionar perfeitamente com a integração do painel MCP.

#### Considerações de Segurança

A configuração `task.allowAutomaticTasks` controla se o VS Code pode executar tarefas automaticamente ao abrir o projeto:

- **Benefício**: Conveniência de ter o servidor MCP iniciado automaticamente sem intervenção manual
- **Risco potencial**: Em projetos desconhecidos, tarefas automáticas poderiam executar código não confiável
- **Recomendação**: Ativar apenas em projetos confiáveis que você conhece e revisou

#### Como habilitar tarefas automáticas

**Método 1: Pela interface gráfica**

1. Abra as configurações do VS Code:
   - Pressione `Ctrl+,` (vírgula)
   - Ou clique em "File" > "Preferences" > "Settings"

2. Na barra de pesquisa das configurações, digite: `task.allowAutomaticTasks`

3. Localize a opção "Tasks: Allow Automatic Tasks" e altere o valor para `on` usando o menu suspenso

**Método 2: Pela notificação**

1. Quando o VS Code perguntar se deseja permitir tarefas automáticas para este workspace, clique em "Permitir"

**Método 3: Pelo comando**

1. Pressione `Ctrl+Shift+P` para abrir a paleta de comandos
2. Digite "Manage Automatic Tasks" e selecione
3. Escolha "Allow Automatic Tasks"

**Método 4: Verificando o status atual**

1. Pressione `Ctrl+Shift+P`
2. Digite "task.allowAutomaticTasks" 
3. Certifique-se de que a configuração esteja definida como "on"

### 5. Inicialização Manual (Método Recomendado)

Este é o método mais confiável para garantir a integração com o VS Code:

1. Pressione `Ctrl+Shift+P` para abrir a paleta de comandos.
2. Digite "MCP: List Servers" e selecione.
3. Na lista, clique em "Context7".
4. Selecione "Iniciar Servidor".
5. Aguarde a inicialização (verifique os logs na aba "Saída" > "MCP: Context7").

### 6. Verificar se o servidor está rodando

Para verificar se o Context7 MCP está em execução:

1. Pressione `Ctrl+Shift+P`
2. Digite "MCP: List Servers" e selecione
3. Na lista, o servidor "Context7" deve aparecer com status "Em execução" ou "Running"

Você também pode ver os logs do servidor na aba "Saída" do VS Code, selecionando "MCP: Context7" no menu suspenso.

### 7. Usando o Context7 com o Copilot

- Abra o GitHub Copilot Chat (`Ctrl+Shift+I`)
- Faça perguntas que se beneficiem de documentação atualizada, por exemplo:
  - "Como implementar o App Router no Next.js 14?"
  - "Quais são as novas funcionalidades do React 19?"
  - "Como usar a última versão do Stripe com TypeScript?"

## Solução de Problemas

Se o servidor não iniciar:

1. Verifique se o Node.js está instalado e acessível no Path
   ```bash
   node --version
   npx --version
   ```

2. Tente executar o comando do Context7 MCP diretamente no terminal:
   ```bash
   npx -y @upstash/context7-mcp@latest
   ```

3. Verifique os logs na aba "Output/Saída" do VS Code:
   - Pressione `Ctrl+Shift+U`
   - Selecione "MCP: Context7" no menu suspenso

4. Reinicie o VS Code e tente iniciar o servidor novamente