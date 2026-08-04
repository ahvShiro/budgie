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

| Grupo | Rota | Descrição |
| --- | --- | --- |
| Auth | `POST /api/v1/auth/register` | Cria conta de usuário |
| Auth | `POST /api/v1/auth/login` | Autentica e retorna JWT |
| Auth | `POST /api/v1/auth/forgot-password` | Inicia recuperação de senha (token por e-mail) |
| Auth | `POST /api/v1/auth/reset-password` | Redefine senha com token |
| Users | `GET /api/v1/users/me` | Dados do usuário autenticado |
| Users | `PUT /api/v1/users/me` | Atualiza dados do usuário autenticado |
| Users | `PATCH /api/v1/users/me/password` | Altera senha (exige senha atual) |
| Categories | `GET/POST/PUT/DELETE /api/v1/category` | CRUD completo de categorias |

Ainda não há Swagger/OpenAPI configurado no projeto. A documentação de endpoints, por enquanto, é esse README

## Status atual / Roadmap

Implementado ponta a ponta (controller + service + repository + DTOs): autenticação, usuário e categorias.

Modelado como entidade mas ainda sem repository/service/controller: `Wallet`, `WalletMember`, `Transaction` - CRUD de carteiras, membros, transações e o resumo financeiro (`/summary`) do dashboard ainda faltam.

No frontend: telas de login, cadastro e recuperação/redefinição de senha estão prontas e roteadas. `/app/dashboard` e `/app/perfil/senha` ainda são placeholders vazios. Faltam o dashboard em si, um wrapper de rota protegida e persistência de sessão.

## Decisões de projeto

- MySQL via XAMPP em vez de PostgreSQL: ambiente já disponível localmente e utilizado durante as aulas
- Rotas singulares (`/api/v1/category`) em vez do plural sugerido pela documentação do professor: mantido por consistência com o restante das rotas já implementadas; migração para plural fica marcada como decisão a revisitar em conjunto
- Validação duplicada (Bean Validation na entidade e na DTO de request): a entidade funciona como última linha de defesa, independente de qual caminho popula o objeto
- Validação no frontend: implementado para o cliente não precisar fazer uma requisição custosa inválida para o servidor, embora recomendação pessoal do professor para validar pelo backend
- JWT stateless com filtro próprio (`SecurityFilter` antes do filtro padrão do Spring Security) em vez de sessão: token carrega o e-mail do usuário como subject, validado e carregado no `SecurityContextHolder` a cada request
