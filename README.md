# Teste Técnico – Desenvolvedor Backend

Este é um projeto desenvolvido com NestJS como parte do teste para uma entrevista de emprego para a posição de desenvolvimento backend na empresa SGA. O objetivo deste projeto é demonstrar habilidades e práticas em desenvolvimento backend utilizando NestJS.

## Requisitos

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (Banco de Dados)
- [Redis](https://redis.io/) (Cache)

## Inicialização Local

**Clone o repositório**

```bash
git clone https://github.com/delkawy/teste-sga.git
cd teste-sga
```

**Instale as dependências**

```bash
yarn install
```

**Configure o ambiente**

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente necessárias. Veja o arquivo `.env.example` para uma referência das variáveis necessárias.

**Rodar as Migrations**

Após configurar as variáveis de ambiente, execute o seguinte comando para criar o banco de dados:

```bash
yarn prisma migrate deploy
```

**Inicie o servidor localmente**

```bash
yarn start:dev
```

O servidor estará disponível em http://localhost:3000.

## Rodar via Docker

Para iniciar os containers do Docker Compose, execute:

```bash
docker-compose up
```

Isso iniciará o PostgreSQL e o Redis em containers Docker. O NestJS será executado dentro do container configurado no Docker Compose. As migrations serão executadas automaticamente.

## Documentação com Swagger

Após inicializar a api, a documentação com [Swagger](https://swagger.io/) está disponível na rota `/docs`
