# Conecta

**Plataforma de conexão entre clientes e profissionais de serviços técnicos de informática.**

A Conecta é uma aplicação web desenvolvida como projeto acadêmico com o objetivo de facilitar a conexão entre pessoas que precisam de serviços técnicos de informática e profissionais que oferecem esse tipo de atendimento.

A plataforma permite que clientes encontrem profissionais, consultem seus perfis e solicitem orçamentos. Os profissionais, por sua vez, podem receber solicitações e apresentar propostas de serviço.

## 🌐 Demonstração online

A aplicação está disponível para acesso no seguinte endereço:

**[Acessar Conecta](https://conecta-gilt-two.vercel.app/)**

## 📌 Sobre o projeto

Encontrar profissionais de confiança para resolver problemas relacionados à informática pode ser uma tarefa difícil. Muitas vezes, clientes precisam recorrer a indicações informais, enquanto profissionais autônomos enfrentam dificuldades para divulgar seus serviços e alcançar novos clientes.

A Conecta propõe uma solução digital para aproximar esses dois públicos, centralizando a descoberta de profissionais e o processo inicial de solicitação e apresentação de orçamentos.

O projeto foi desenvolvido como um MVP (*Minimum Viable Product*), priorizando as funcionalidades essenciais para demonstrar a proposta de valor da plataforma.

## 🎯 Objetivos

- Facilitar a busca por profissionais de informática.
- Disponibilizar perfis com informações sobre os serviços oferecidos.
- Permitir que clientes solicitem orçamentos.
- Possibilitar que profissionais recebam solicitações e enviem propostas.
- Centralizar o processo inicial de conexão entre clientes e profissionais.

## ⚙️ Funcionalidades do MVP

### 👤 Para clientes

- Cadastro e autenticação na plataforma.
- Navegação pelo catálogo de profissionais.
- Consulta aos perfis e informações dos profissionais.
- Solicitação de orçamentos.
- Acompanhamento das solicitações realizadas.
- Visualização das propostas recebidas.

### 🧑‍🔧 Para profissionais

- Cadastro e autenticação na plataforma.
- Acesso à área profissional.
- Visualização e gerenciamento das solicitações recebidas.
- Elaboração e envio de propostas de orçamento.
- Acompanhamento das propostas enviadas.

### 🔐 Segurança e controle de acesso

- Autenticação integrada ao Supabase.
- Controle de acesso conforme o perfil do usuário.
- Políticas de segurança no banco de dados utilizando Row Level Security (RLS).
- Proteção das operações de acordo com as permissões de cada usuário.

## 🖥️ Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Next.js | Framework principal da aplicação |
| React | Construção da interface |
| TypeScript | Tipagem estática e organização do código |
| Tailwind CSS | Estilização e responsividade |
| Supabase | Backend, autenticação e banco de dados PostgreSQL |
| Git | Controle de versão |
| GitHub | Hospedagem do repositório |
| Vercel | Hospedagem e publicação da aplicação |

## 🏗️ Arquitetura e funcionamento

A Conecta utiliza uma arquitetura baseada em Next.js e Supabase.

O Next.js é responsável pela interface, navegação e funcionalidades da aplicação. O Supabase fornece os serviços de autenticação e persistência dos dados, permitindo que os diferentes perfis de usuários interajam com a plataforma.

O fluxo principal do MVP funciona da seguinte maneira:

1. O usuário acessa a plataforma e realiza seu cadastro ou login.
2. O cliente navega pelo catálogo e seleciona um profissional.
3. O cliente envia uma solicitação de orçamento.
4. O profissional recebe e consulta a solicitação.
5. O profissional elabora e envia uma proposta.
6. O cliente pode consultar a proposta recebida.

### Fluxo simplificado

```text
             CONECTA
                |
        Autenticação
                |
       +--------+--------+
       |                 |
     CLIENTE         PROFISSIONAL
       |                 |
 Buscar profissionais   Receber solicitações
       |                 |
 Consultar perfil       Analisar solicitação
       |                 |
 Solicitar orçamento    Enviar proposta
       |                 |
       +--------+--------+
                |
       Acompanhar propostas
```

## 🧰 Pré-requisitos

Para executar o projeto localmente, é necessário ter:

- Node.js instalado.
- npm (gerenciador de pacotes).
- Git.
- Uma conta e um projeto no Supabase.

## 🚀 Como executar o projeto localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/LuizDev1/Conecta.git
```

Entre na pasta do projeto:

```bash
cd Conecta
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo chamado `.env.local` na raiz do projeto.

Adicione as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
```

Os valores podem ser encontrados nas configurações do projeto Supabase, na seção de API.

> **Importante:** substitua os valores de exemplo pelas credenciais do seu próprio projeto Supabase. Nunca publique chaves privadas, senhas ou arquivos de ambiente com credenciais reais no repositório.

### 4. Executar a aplicação

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

## 📦 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run start` | Inicia a aplicação em produção |
| `npm run lint` | Executa a análise estática do código |

## 🔑 Contas demonstrativas

Para facilitar a avaliação e demonstração das funcionalidades, a plataforma disponibiliza contas previamente cadastradas.

**Senha padrão de todas as contas:**

```text
Conecta2026!
```

### Conta de cliente

| E-mail | Senha |
|---|---|
| `cliente.demo@conecta.local` | `Conecta2026!` |

### Contas de profissionais

| Perfil | E-mail | Senha |
|---|---|---|
| Técnico em Informática | `profissional.pc@conecta.local` | `Conecta2026!` |
| Técnico em Redes | `profissional.redes@conecta.local` | `Conecta2026!` |
| Técnico em Hardware | `profissional.hardware@conecta.local` | `Conecta2026!` |

> **Atenção:** essas credenciais são destinadas exclusivamente à demonstração e avaliação acadêmica do projeto. Não utilize essas contas para armazenar informações pessoais ou dados reais. As contas e os dados demonstrativos pertencem ao ambiente de homologação da aplicação.

## ☁️ Hospedagem e publicação

A aplicação está hospedada na Vercel, com integração ao repositório GitHub.

O Supabase é utilizado como serviço de backend, fornecendo autenticação e banco de dados.

**Endereço da aplicação:**

[https://conecta-gilt-two.vercel.app/](https://conecta-gilt-two.vercel.app/)

A integração com o GitHub permite que novas alterações na branch principal sejam utilizadas para gerar novas versões publicadas da aplicação.

## 📱 Responsividade

A interface foi desenvolvida considerando diferentes tamanhos de tela, permitindo o acesso por computadores, tablets e dispositivos móveis.

A proposta visual prioriza uma experiência minimalista, com navegação clara, componentes padronizados e uma identidade visual consistente.

## 🚧 Limitações e escopo do MVP

A versão atual da Conecta tem como foco validar o fluxo principal de conexão entre clientes e profissionais.

Por isso, algumas funcionalidades estão fora do escopo desta versão:

- Processamento de pagamentos pela plataforma.
- Chat em tempo real entre clientes e profissionais.
- Sistema de avaliações e reputação.
- Mediação de conflitos.
- Agendamento avançado de serviços.

Essas funcionalidades poderão
