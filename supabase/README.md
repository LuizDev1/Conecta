# Supabase local: preparação da demonstração

Este diretório contém o histórico SQL do projeto Conecta.

## O que precisa ser criado manualmente

As contas abaixo devem ser criadas pelo **Supabase Dashboard > Authentication > Users**
ou pelo fluxo público de cadastro da aplicação:

- `cliente.demo@conecta.local` — conta cliente
- `profissional.pc@conecta.local` — conta profissional
- `profissional.redes@conecta.local` — conta profissional
- `profissional.hardware@conecta.local` — conta profissional

Não use uma chave `service_role`, senha administrativa ou segredo em arquivos,
scripts do frontend ou no repositório. A senha das contas demonstrativas deve
ser informada apenas ao responsável pela apresentação.

Para cada conta criada, o cadastro da aplicação deve informar `full_name` e
`role` nos metadados. Caso uma conta já exista no Auth sem perfil, execute o
backfill existente no projeto antes do seed.

## O que o seed faz

Depois que as contas acima existem no Auth, `supabase/seed.sql`:

- Localiza os usuários pelos e-mails.
- Atualiza os perfis já criados pelo trigger.
- Marca os profissionais como disponíveis e demonstrativos.
- Configura especialidades, categorias e regiões dos profissionais.
- Configura uma conta cliente demonstrativa.
- Cria solicitações de exemplo quando ainda não existem.
- Cria uma proposta demonstrativa correspondente.

O seed não cria usuários no Auth, não usa credenciais administrativas e pode
ser executado novamente sem duplicar as solicitações já marcadas como `DEMO`.

## Ordem de execução

1. Aplique todas as migrações em ordem numérica.
2. Confirme a criação das contas demonstrativas no Auth.
3. Confirme que os e-mails estão confirmados, caso a confirmação por e-mail esteja ativa.
4. Execute `supabase/seed.sql`.
5. Valide os profissionais em `/profissionais`.
6. Execute o fluxo cliente-profissional manualmente.

## Migrações

Não altere ou renomeie migrações já aplicadas. O arquivo
`20261123000300_harden_quote_permissions.sql` é incremental e contém as
correções adicionais de RLS e proteção das solicitações/propostas.
