# Conecta

**Marketplace de serviços técnicos de informática**

A Conecta é uma plataforma digital desenvolvida com o objetivo de aproximar pessoas que precisam de serviços técnicos de informática de profissionais que oferecem esse tipo de atendimento.

A proposta é facilitar a busca por profissionais, permitir a visualização de seus perfis e especialidades e organizar a solicitação e o envio de orçamentos em um único ambiente.

O projeto foi desenvolvido como parte de uma atividade acadêmica da disciplina de Startups da Universidade Católica de Brasília (UCB).

> **Status do projeto:** MVP acadêmico e demonstrativo. O sistema implementa o fluxo principal de solicitação e envio de propostas, mas não representa uma operação comercial em produção.

## Funcionalidades

O MVP contempla dois tipos de usuários: clientes e profissionais.

### Para clientes
- Visualização e busca de profissionais cadastrados.
- Consulta aos perfis, apresentações e especialidades dos profissionais.
- Cadastro e autenticação de usuários.
- Solicitação de orçamentos para serviços técnicos.
- Acompanhamento das solicitações realizadas.
- Visualização das propostas recebidas.

### Para profissionais
- Cadastro e autenticação de profissionais.
- Criação e atualização do perfil profissional.
- Apresentação de especialidades e categorias de serviços.
- Visualização das solicitações de orçamento recebidas.
- Envio de propostas com valores e mensagens.
- Acompanhamento das solicitações atendidas.

## Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| [Next.js](https://nextjs.org/) | Framework para desenvolvimento da aplicação web |
| [React](https://react.dev/) | Construção da interface |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização da interface |
| [Supabase](https://supabase.com/) | Autenticação e banco de dados |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional utilizado pelo Supabase |
| [Git](https://git-scm.com/) e [GitHub](https://github.com/) | Controle de versão e hospedagem do código |

## Como executar o projeto

### 1. Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão LTS recomendada).
- [Git](https://git-scm.com/).
- Um projeto criado no [Supabase](https://supabase.com/).

### 2. Clonar o repositório

Abra o terminal e execute:

```bash
git clone https://github.com/LuizDev1/Conecta.git
```

Entre na pasta do projeto:

```bash
cd Conecta
```

### 3. Instalar as dependências

Execute o comando:

```bash
npm install
```

### 4. Configurar o Supabase

A aplicação utiliza o Supabase para autenticação e armazenamento dos dados.

Crie um projeto no [painel do Supabase](https://supabase.com/dashboard) e obtenha as informações de conexão em:

**Project Settings → API**

Na raiz do projeto, existe um arquivo `.env.example`. Crie uma cópia dele com o nome `.env.local`:

```bash
cp .env.example .env.local
```

No Windows PowerShell, caso prefira, utilize:

```powershell
Copy-Item .env.example .env.local
```

Abra o arquivo `.env.local` e preencha as variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel
```

Substitua os valores de exemplo pelas informações do seu próprio projeto Supabase.

**Importante:** nunca publique senhas, tokens administrativos ou chaves `service_role` no repositório. O arquivo `.env.local` contém configurações locais e não deve ser enviado ao Git.

### 5. Configurar o banco de dados

As instruções e os arquivos SQL necessários estão no diretório `supabase/`.

Para preparar o banco de dados:

1. Acesse o painel do seu projeto Supabase.
2. Abra o **SQL Editor**.
3. Localize os arquivos SQL de migração no repositório, em `supabase/migrations/supabase/migrations/`.
4. Execute as migrações em ordem numérica, começando pela criação dos perfis e seguindo pelas migrações do marketplace e de permissões.
5. Confira se as tabelas e políticas de segurança foram criadas corretamente.

Os arquivos de migração devem ser executados uma única vez, na ordem indicada. Não execute novamente migrações que já tenham sido aplicadas.

### 6. Executar a aplicação

Com as dependências instaladas e o Supabase configurado, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível no endereço:

**http://localhost:3000**

Para encerrar o servidor, utilize `Ctrl + C` no terminal.

## Scripts disponíveis

Os seguintes comandos podem ser executados na raiz do projeto:

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run start` | Inicia a aplicação em modo de produção |
| `npm run lint` | Executa a verificação estática do código com ESLint |

## Estrutura do projeto

A organização principal dos diretórios é:

```text
Conecta/
├── app/                  # Páginas e rotas da aplicação
│   ├── auth/             # Fluxos de autenticação
│   ├── cliente/          # Área do cliente
│   ├── profissional/     # Área do profissional
│   └── profissionais/    # Listagem e perfis públicos
├── components/           # Componentes reutilizáveis
│   └── ui/               # Componentes de interface
├── lib/                  # Bibliotecas e configurações
│   └── supabase/         # Clientes e integração com Supabase
├── public/               # Arquivos estáticos
├── supabase/
│   ├── migrations/       # Migrações do banco de dados
│   ├── seed.sql          # Dados demonstrativos
│   └── README.md         # Orientações de preparação do Supabase
├── .env.example          # Modelo das variáveis de ambiente
├── package.json          # Dependências e scripts
└── README.md             # Documentação do projeto
```

## Dados demonstrativos

O projeto disponibiliza um arquivo `supabase/seed.sql` para auxiliar na preparação de dados demonstrativos.

Esse arquivo configura perfis, profissionais, solicitações e propostas de exemplo. Entretanto, ele **não cria automaticamente as contas de autenticação**.

Para utilizar os dados demonstrativos:

1. Crie as contas necessárias em **Supabase → Authentication → Users**, seguindo as orientações de `supabase/README.md`.
2. Confirme que os perfis correspondentes foram criados.
3. Execute o arquivo `supabase/seed.sql` no SQL Editor.
4. Acesse a aplicação e teste os fluxos de cliente e profissional.

As contas demonstrativas são destinadas à apresentação e aos testes do MVP. Não compartilhe senhas ou credenciais administrativas publicamente.

## Escopo do MVP

O projeto prioriza a demonstração do fluxo principal da plataforma:

1. O cliente acessa a listagem de profissionais.
2. Consulta o perfil do profissional escolhido.
3. Envia uma solicitação de orçamento.
4. O profissional visualiza a solicitação recebida.
5. O profissional envia uma proposta.
6. O cliente consulta a proposta recebida.

Recursos como pagamentos integrados, chat em tempo real, sistema de avaliações e reputação e mediação de serviços não fazem parte da implementação atual do MVP.

## Finalidade acadêmica

A Conecta foi desenvolvida como um projeto acadêmico para explorar uma solução digital voltada à conexão entre clientes e profissionais de informática.

O sistema tem finalidade demonstrativa e educacional. Sua implementação permite apresentar o funcionamento do fluxo principal proposto, servindo como base para futuras melhorias, testes com usuários e evolução da solução.

## Repositório

- **GitHub:** https://github.com/LuizDev1/Conecta
- **Tecnologias principais:** Next.js, React, TypeScript e Supabase.
