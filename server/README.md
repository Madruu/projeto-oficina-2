# 🚀 Backend - Sistema de Controle de Voluntários

Este é o backend do Sistema de Controle de Voluntários, desenvolvido com Node.js e Express.

---

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn
- Docker e Docker Compose (para ambiente dockerizado)
- MongoDB instalado e rodando localmente

---

## 🐳 Executando com Docker Compose

O backend pode ser executado via Docker Compose, conectando-se ao MongoDB local da sua máquina.

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
NODE_ENV=development
MONGO_DATABASE=oficina2
# Se seu MongoDB não tem autenticação, deixe vazio:
MONGO_ROOT_USERNAME=
MONGO_ROOT_PASSWORD=
# Se seu MongoDB tem autenticação:
# MONGO_ROOT_USERNAME=admin
# MONGO_ROOT_PASSWORD=password
```

### 2. Iniciar o backend

```bash
# Na raiz do projeto
docker compose up
```

Para executar em background:

```bash
docker compose up -d
```

### 3. Verificar se está funcionando

O backend estará disponível em `http://localhost:3000`

Teste a rota de saúde:

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{ "status": "OK" }
```

### 4. Parar os serviços

```bash
docker compose down
```

---

## 💻 Executando localmente (sem Docker)

### 1. Instalar dependências

```bash
cd server
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` no diretório `server/`:

```env
PORT=3000
NODE_ENV=development
# MongoDB local sem autenticação
MONGO_URI=mongodb://localhost:27017/oficina2
# MongoDB local com autenticação
# MONGO_URI=mongodb://admin:password@localhost:27017/oficina2?authSource=admin
```

### 3. Iniciar o servidor

```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

---

## 🏗️ Estrutura do Projeto

```
server/
├── src/
│   ├── routes/
│   │   └── health.routes.js    # Rotas de saúde da API
│   └── server.js               # Arquivo principal do servidor
├── Dockerfile                  # Configuração Docker do backend
├── .dockerignore              # Arquivos ignorados no build Docker
├── package.json               # Dependências do projeto
└── README.md                  # Este arquivo
```

---

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon
- `npm start` - Inicia o servidor em modo produção
- `npm test` - Executa os testes (a implementar)
- `npm run lint` - Executa o linter ESLint

---

## 🔗 Endpoints

### GET /health

Rota de saúde da API, retorna o status do servidor.

**Resposta:**

```json
{
  "status": "OK"
}
```

---

## 🔧 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Docker** - Containerização
- **dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Controle de acesso cross-origin

---
