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
Persistência em MySQL, rodando localmente via XAMPP.

BACKEND: Spring Boot 3, Spring Security + JWT (`java-jwt`), Spring Data JPA/Hibernate, Bean Validation, Spring Mail, Thymeleaf, MySQL, Maven.

FRONTEND: React, TypeScript, Vite, axios, react-router-dom, shadcn/radix-ui, Tailwind v4, `@zxcvbn-ts` (força de senha), sonner (toasts).

## Pré-requisitos

- Java 21+
- Maven
- Node.js 18+ e npm
- MySQL rodando localmente (via XAMPP), porta padrão 3306

## Configuração

### Backend

Editar `budgie-backend/src/main/resources/application-secrets-example.properties` com: senha do usuário do banco, chave para assinar o JWT, e senha/app-password da conta de e-mail configurada em spring.mail.username

Criar no MySQL (XAMPP) um banco chamado `budgie_database`. As tabelas são criadas/atualizadas automaticamente pelo Hibernate (`spring.jpa.hibernate.ddl-auto=update`)

### Frontend

Criar/conferir `budgie-frontend/.env`:

```
VITE_APP_API_BASE_URL=http://localhost:8080
VITE_SUPPORT_EMAIL=<e-mail de suporte exibido na interface>
```

## Como rodar localmente

### Backend

```bash
cd budgie-backend
./mvnw spring-boot:run
```

Sobe em `http://localhost:8080`

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
| Users | `GET /api/v1/users` | Lista usuários |
| Users | `DELETE /api/v1/users/{id}` | Remove usuário |
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

Códigos de erro que a API usa: 400 (validação/corpo inválido), 401 (credenciais), 403 (não é membro, ou é membro mas não é o dono), 404 (recurso não existe), 409 (membro duplicado), 422 (regra de negócio violada).

Ainda não há Swagger/OpenAPI configurado no projeto. A documentação de endpoints, por enquanto, é esse README

## Status atual / Roadmap

Implementado ponta a ponta (controller + service + repository + mapper + DTOs): autenticação, usuário, categorias, carteiras e membros de carteira. O compartilhamento de carteira funciona: o dono convida por e-mail, o convidado passa a enxergar a carteira na própria listagem, e os papéis são administrados só pelo dono.

Falta: `Transaction` tem entidade, repository, mapper, controller e DTOs, mas o service ainda é esqueleto - 4 dos 5 métodos devolvem vazio. Junto com ele ficam pendentes o resumo financeiro (`GET /wallets/{id}/summary`) e as regras de papel EDITOR/VIEWER sobre transações.

No frontend: login, cadastro, recuperação/redefinição de senha, suporte, 404 e dashboard estão prontos e roteados, com proteção de rota (`PrivateRoute`/`PublicRoute`), shell autenticado (`AppLayout` com sidebar) e persistência de sessão em `services/session.ts`. `/app/perfil/senha` ainda é placeholder vazio, e o dashboard consome dados mockados de `DashboardService.ts` no formato das respostas reais. Não há tela para carteiras nem para membros - os endpoints existem e ainda não têm consumidor.

## Decisões de projeto

- MySQL via XAMPP em vez de PostgreSQL: ambiente já disponível localmente e utilizado durante as aulas
- Rotas singulares (`/api/v1/category`) em vez do plural sugerido pela documentação do professor: mantido por consistência com o restante das rotas já implementadas; migração para plural fica marcada como decisão a revisitar em conjunto
- Validação duplicada (Bean Validation na entidade e na DTO de request): a entidade funciona como última linha de defesa, independente de qual caminho popula o objeto
- Validação no frontend: implementado para o cliente não precisar fazer uma requisição custosa inválida para o servidor, embora recomendação pessoal do professor para validar pelo backend
- JWT stateless com filtro próprio (`SecurityFilter` antes do filtro padrão do Spring Security) em vez de sessão: token carrega o e-mail do usuário como subject, validado e carregado no `SecurityContextHolder` a cada request
- Soft delete (`active = false`) em carteira, categoria e transação, mas **hard delete** em `WalletMember`: membro não é histórico financeiro mas sim concessão de acesso, e revogar é apagar a concessão. Além disso é o que faz a constraint única `(wallet_id, user_id)` funcionar - com soft delete a linha revogada continuaria ocupando o par e a mesma pessoa nunca mais poderia ser re-adicionada
- Dono da carteira registrado em dois lugares: a FK `Wallet.owner` e uma linha `OWNER` em `wallet_members`. A FK é a autoridade e é o que `checkOwner` consulta; a linha existe para que a listagem de carteiras e a de membros não precisem de caso especial para o dono
