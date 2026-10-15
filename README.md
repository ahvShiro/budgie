# Budgie

Aplicação de controle financeiro pessoal e compartilhado. Usuário cadastra receitas e despesas, acompanha resumos no dashboard e pode compartilhar carteiras com outras pessoas para colaboração.

Repositório contém duas aplicações independentes:

- `budgie-backend/` - API REST em Spring Boot
- `budgie-frontend/` -  SPA em React + TypeScript

Frontend em produção: https://budgie.shiroshima.com.br/

## Arquitetura

`budgie-frontend/` consome a API REST exposta por `budgie-backend/` via axios (base URL configurável por variável de ambiente). O backend segue arquitetura em camadas padrão Spring: 
1. `controllers` (recebem HTTP, sem lógica de negócio)
2. `services` (regras de negócio, validação)
3. `repositories` (JPA/Hibernate)
4. `models` (entidades), com `dtos` isolando o que trafega pela API e `configs`/`exceptions` cuidando de segurança (JWT stateless) e tratamento de erro centralizado. 

Persistência em PostgreSQL, local via Docker Compose ou remoto no [Neon](https://neon.tech).

BACKEND: Spring Boot 4, Spring Security + JWT (`java-jwt`), Spring Data JPA/Hibernate, Bean Validation, Spring Mail, Thymeleaf, PostgreSQL, Maven.

FRONTEND: React, TypeScript, Vite, axios, react-router-dom, shadcn/radix-ui, Tailwind v4, `@zxcvbn-ts` (força de senha), sonner (toasts).

## Pré-requisitos

- Java 21+ (para rodar o backend fora do Docker)
- Docker (opcional)
- Node.js 18+ e npm

## Configuração

### Backend

Existem formas diferentes de se rodar o banco de dados e a API. Para testes locais, é recomendado utilizar o Docker tanto para a API quanto para o banco.

Em todas elas o backend lê as configurações de um arquivo `.env` na **raiz do repositório**. O primeiro passo é sempre o mesmo:

```bash
cp .env.example .env
```

Cuidados ao preencher o `.env`:

- **Sem aspas nos valores.** O Docker remove as aspas, mas o Spring mantém como parte do valor (`"senha"` vira uma senha errada)
- **`TOKEN_SECRET`**: qualquer texto com pelo menos 32 caracteres. Para gerar um: `openssl rand -base64 32`
- **`MAIL_USERNAME` / `MAIL_PASSWORD`** (opcional): um Gmail e uma [senha de app](https://myaccount.google.com/apppasswords), escrita sem espaços. Sem isso o sistema funciona, mas os e-mails (boas-vindas e recuperação de senha) não são enviados e aparece um erro no log

As tabelas são criadas automaticamente pelo Hibernate na primeira vez que a API sobe, não é preciso rodar nenhum SQL.

#### Para testes: API e banco no Docker

Só precisa do Docker instalado

1. No `.env`, preencher a parte do banco. Usuário, senha e nome do banco podem ser quaisquer valores: o container do Postgres é criado com eles

   ```properties
   COMPOSE_PROFILES=local-db
   DATASOURCE_USERNAME=budgie
   DATASOURCE_PASSWORD=budgie123
   DATASOURCE_DATABASE=budgie_database
   DATASOURCE_PORT=5432
   DATASOURCE_URL=jdbc:postgresql://postgres:5432/budgie_database
   TOKEN_SECRET=<gerado como especificado>
   ```

   O host da URL é `postgres` (nome do serviço dentro da rede do Docker), não `localhost`

2. Na raiz do repositório, subir tudo:

   ```bash
   docker compose up -d --build
   ```

   A primeira vez demora um tanto, porque o Maven baixa as dependências dentro da imagem

3. Acompanhar até aparecer `Started BudgieBackendApplication`:

   ```bash
   docker compose logs -f budgie-backend
   ```

Para parar: `docker compose down`. Os dados ficam salvos no volume `postgres_data`; para apagar o banco também: `docker compose down -v`.

> O Postgres só usa `DATASOURCE_USERNAME`/`DATASOURCE_PASSWORD` na **primeira** vez que o volume é criado. Se mudar esses valores depois, é necessário rodar `docker compose down -v` para recriar o banco do zero.

#### Para desenvolvimento: API local e banco no Docker

Precisa do Docker e do Java 21+. A API roda direto na máquina, com hot reload do devtools.

1. No `.env`, a mesma configuração do tópico anterior, trocando o host da URL para `localhost` (a API agora está fora do Docker e enxerga o banco pela porta exposta)

   ```properties
   COMPOSE_PROFILES=local-db
   DATASOURCE_URL=jdbc:postgresql://localhost:5432/budgie_database
   ```

2. Subir só o banco:

   ```bash
   docker compose up -d postgres
   ```

3. Rodar a API em `budgie-backend/`:

   ```bash
   cd budgie-backend
   ./mvnw spring-boot:run
   ```

#### Para deploy: API no Docker e banco no Neon

Precisa do Docker e de uma conta no [Neon](https://neon.tech).

1. No painel do Neon, criar um projeto e copiar a connection string. Ela vem neste formato:

   ```
   postgresql://neondb_owner:SENHA@ep-xxxx-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

2. Converter para o formato JDBC e separar usuário e senha:

   - colocar `jdbc:` na frente
   - tirar `neondb_owner:SENHA@` da URL; usuário e senha vão para variáveis próprias
   - tirar o `-pooler` do host
   - manter `sslmode=require` e tirar o `channel_binding`

   ```properties
   COMPOSE_PROFILES=
   DATASOURCE_URL=jdbc:postgresql://ep-xxxx.sa-east-1.aws.neon.tech/neondb?sslmode=require
   DATASOURCE_USERNAME=neondb_owner
   DATASOURCE_PASSWORD=SENHA
   TOKEN_SECRET=<gerado com openssl rand -base64 32>
   ```

   `COMPOSE_PROFILES` vazio faz o Docker **não** subir o Postgres local

3. Apontar CORS e links dos e-mails para o endereço real do frontend:

   ```properties
   CORS_ALLOWED_ORIGINS=https://budgie.shiroshima.com.br
   FRONTEND_BASE_URL=https://budgie.shiroshima.com.br
   ```

4. Subir só a API:

   ```bash
   docker compose up -d --build
   ```

Sem Docker, o mesmo `.env` funciona com `cd budgie-backend && ./mvnw spring-boot:run`.

#### Primeiro administrador

Não existe endpoint que cria admin por decisão arquitetural. Depois de cadastrar a conta pelo frontend ou por `POST /api/v1/auth/register`, promover direto no banco:

```sql
UPDATE users SET auth_role = 'ADMIN' WHERE email = 'SEU EMAIL AQUI';
```

- **Banco no Docker**, a partir da raiz do repositório:

  ```bash
  set -a; . ./.env; set +a
  docker exec budgie-database psql -U "$DATASOURCE_USERNAME" -d "$DATASOURCE_DATABASE" \
    -c "UPDATE users SET auth_role = 'ADMIN' WHERE email = 'SEU EMAIL AQUI';"
  ```

- **Neon**: rodar o `UPDATE` no SQL Editor do painel

Não precisa logar de novo: o token só guarda o e-mail, e o papel é recarregado do banco a cada requisição.

### Frontend

Criar/conferir `budgie-frontend/.env`:

```
VITE_APP_API_BASE_URL=http://localhost:8080
VITE_SUPPORT_EMAIL=<e-mail de suporte exibido na interface>
```

## Como rodar localmente

### Backend

Ver os passos em [Configuração > Backend](#backend), de acordo com a forma escolhida. A API sobe em `http://localhost:8080`.

### Frontend

```bash
cd budgie-frontend
npm install
npm run dev
```

Sobe em `http://localhost:5173` (o CORS do backend já ta liberado para essa origem)

## Endpoints implementados

Todas as rotas exigem `Authorization: Bearer <token>`, exceto as quatro de `auth`.

| Grupo | Rota | Descrição |
| --- | --- | --- |
| Auth | `POST /api/v1/auth/register` | Cria conta de usuário |
| Auth | `POST /api/v1/auth/login` | Autentica e retorna JWT |
| Auth | `POST /api/v1/auth/forgot-password` | Inicia recuperação de senha (token por e-mail) |
| Auth | `POST /api/v1/auth/reset-password` | Redefine senha com token |
| Users | `GET /api/v1/users/me` | Dados do usuário autenticado |
| Users | `PUT /api/v1/users/me` | Atualiza dados do usuário autenticado |
| Users | `PATCH /api/v1/users/me/password` | Altera senha (exige senha atual) |
| Users | `GET /api/v1/users` | Lista usuários (somente ADMIN) |
| Users | `DELETE /api/v1/users/{id}` | Remove usuário (somente ADMIN) |
| Categories | `POST /api/v1/category` | Cria categoria |
| Categories | `GET /api/v1/category` | Lista categorias, filtro opcional `?type=INCOME\|EXPENSE` |
| Categories | `PUT /api/v1/category/{id}` | Atualiza categoria |
| Categories | `DELETE /api/v1/category/{id}` | Remove categoria |
| Wallets | `POST /api/v1/wallet` | Cria carteira; quem cria vira OWNER |
| Wallets | `GET /api/v1/wallet` | Lista carteiras em que o usuário é membro |
| Wallets | `GET /api/v1/wallet/{id}` | Detalha carteira (qualquer membro) |
| Wallets | `PUT /api/v1/wallet/{id}` | Atualiza carteira (somente OWNER) |
| Wallets | `DELETE /api/v1/wallet/{id}` | Desativa carteira e suas transações (somente OWNER) |
| Wallet Members | `POST /api/v1/wallet/{walletId}/member` | Adiciona membro por e-mail (somente OWNER) |
| Wallet Members | `GET /api/v1/wallet/{walletId}/member` | Lista membros (qualquer membro) |
| Wallet Members | `PATCH /api/v1/wallet/{walletId}/member/{userId}` | Altera papel do membro (somente OWNER) |
| Wallet Members | `DELETE /api/v1/wallet/{walletId}/member/{userId}` | Remove membro (somente OWNER) |

As rotas `/api/v1/wallet/{walletId}/transaction` existem no `TransactionController`, mas o service ainda é esqueleto: só o `GET /{id}` responde de verdade, os demais devolvem vazio. Não usar ainda.

Papéis dentro da carteira (`WalletRole`): `OWNER`, `EDITOR`, `VIEWER`. A distinção entre EDITOR e VIEWER só passa a ter efeito quando as transações forem implementadas - hoje os dois têm o mesmo poder, que é ler a carteira e a lista de membros.

Códigos de erro que a API usa: 400 (validação/corpo inválido), 401 (credenciais erradas no login, ou token ausente/inválido/expirado), 403 (autenticado mas sem permissão: não é ADMIN, não é membro, ou é membro mas não é o dono), 404 (recurso não existe), 409 (membro duplicado), 422 (regra de negócio violada).

Todo erro, inclusive 401/403 gerados pelo Spring Security antes de chegar na controller, volta no mesmo formato JSON: `{ timestamp, status, error, message }`. O token JWT vale 24h.

Ainda não há Swagger/OpenAPI configurado no projeto. A documentação de endpoints, por enquanto, é esse README

## Status atual / Roadmap

Implementado ponta a ponta (controller + service + repository + mapper + DTOs): autenticação, usuário, categorias, carteiras e membros de carteira. O compartilhamento de carteira funciona: o dono convida por e-mail, o convidado passa a enxergar a carteira na própria listagem, e os papéis são administrados só pelo dono.

Falta: `Transaction` tem entidade, repository, mapper, controller e DTOs, mas o service ainda é esqueleto - 4 dos 5 métodos devolvem vazio. Junto com ele ficam pendentes o resumo financeiro (`GET /wallets/{id}/summary`) e as regras de papel EDITOR/VIEWER sobre transações.

No frontend: login, cadastro, recuperação/redefinição de senha, suporte, 404 e dashboard estão prontos e roteados, com proteção de rota (`PrivateRoute`/`PublicRoute`), shell autenticado (`AppLayout` com sidebar) e persistência de sessão em `services/session.ts`. `/app/perfil/senha` ainda é placeholder vazio, e o dashboard consome dados mockados de `DashboardService.ts` no formato das respostas reais. Não há tela para carteiras nem para membros - os endpoints existem e ainda não têm consumidor.

## Decisões de projeto

- PostgreSQL via Docker Compose **ou** Neon: o Postgres local fica num profile do Compose (`local-db`), então quem não quer instalar nada usa o Neon e quem quer tudo offline liga o profile. A troca é só no `.env`
- Um único `.env` na raiz para Docker e para `./mvnw`: o Spring importa o arquivo com `optional:`, então não precisa exportar variável no terminal nem configurar a IDE
- Rotas singulares (`/api/v1/category`) em vez do plural sugerido pela documentação do professor: mantido por consistência com o restante das rotas já implementadas; migração para plural fica marcada como decisão a revisitar em conjunto
- Validação duplicada (Bean Validation na entidade e na DTO de request): a entidade funciona como última linha de defesa, independente de qual caminho popula o objeto
- Validação no frontend: implementado para o cliente não precisar fazer uma requisição custosa inválida para o servidor, embora recomendação pessoal do professor para validar pelo backend
- JWT stateless com filtro próprio (`SecurityFilter` antes do filtro padrão do Spring Security) em vez de sessão: token carrega o e-mail do usuário como subject, validado e carregado no `SecurityContextHolder` a cada request
- Expiração do token calculada com `Instant` (sem fuso), não `LocalDateTime` + offset fixo `-03:00`: num container em UTC o offset fixo fazia o token durar 5h em vez de 2h
- `ApiAuthEntryPoint` (401) e `ApiAccessDeniedHandler` (403) próprios: erros que nascem na cadeia de filtros do Spring Security não passam pelo `@RestControllerAdvice`, e sem o entry point o Spring respondia 403 até pra token vencido, então o frontend não conseguia diferenciar sessão expirada de falta de permissão
- Papel ADMIN exigido com `@PreAuthorize("hasRole('ADMIN')")` nos métodos da `UserController`, em vez de regra de URL no `SecurityConfig` como pedia a tarefa: a regra fica colada no método que protege, não depende da ordem dos matchers (uma regra de `/api/v1/users/**` acima de `/users/me` bloquearia o próprio perfil) e não some se o path for renomeado. O 403 nesse caso sai pelo `ApiExceptionHandler`, já que a exceção nasce dentro da controller
- Soft delete (`active = false`) em carteira, categoria e transação, mas **hard delete** em `WalletMember`: membro não é histórico financeiro mas sim concessão de acesso, e revogar é apagar a concessão. Além disso é o que faz a constraint única `(wallet_id, user_id)` funcionar - com soft delete a linha revogada continuaria ocupando o par e a mesma pessoa nunca mais poderia ser re-adicionada
- Dono da carteira registrado em dois lugares: a FK `Wallet.owner` e uma linha `OWNER` em `wallet_members`. A FK é a autoridade e é o que `checkOwner` consulta; a linha existe para que a listagem de carteiras e a de membros não precisem de caso especial para o dono
