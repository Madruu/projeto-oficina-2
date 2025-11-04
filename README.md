# 📌 Sistema de Controle de Voluntários - Definição do Projeto

Projeto acadêmico desenvolvido para gerenciar voluntários de um projeto social, permitindo o **cadastro de participantes**, **controle de datas de entrada e saída**, **registro das oficinas em que atuaram** e **geração automática de termos de voluntariado**.

---

## 👥 Integrantes do Grupo

- **Mateus Chicoli Pedreira**
- **Pedro Henrique Lima Donini**
- **Victor Motta de Oliveira**
- **Vitor Encinas Negrão de Tulio**

---

## 🚀 Quick Start

### Pré-requisitos

- **Node.js** v20+ instalado
- **npm** v8+ (vem com o Node.js)
- **MongoDB** rodando localmente (ou usar Docker)
- **Git** para clonar o repositório

### Instalação

1. **Clone o repositório:**

```bash
git clone <url-do-repositorio>
cd oficina-2
```

2. **Instale as dependências (workspaces):**

```bash
npm install
```

Isso instalará automaticamente as dependências de `client` e `server` devido à configuração de workspaces.

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` dentro da pasta `server/`:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/oficina2
JWT_SECRET=sua_chave_secreta_aqui
```

> 💡 **Nota:** Em ambiente Docker, use `mongodb://mongo:27017/oficina2` como URI.

---

## 🧩 Scripts Principais

### Rodar tudo em modo desenvolvimento:

```bash
npm run dev
```

Inicia o backend (porta 3000) e frontend (porta 5173) simultaneamente.

### Apenas backend:

```bash
npm run dev:server
```

Inicia apenas o servidor Express na porta 3000.

### Apenas frontend:

```bash
npm run dev:client
```

Inicia apenas o frontend React/Vite na porta 5173.

### Rodar testes:

```bash
npm run test
```

Executa os testes do workspace `server` usando Jest.

### Rodar testes com coverage:

```bash
npm run test:coverage
```

Executa os testes e gera relatório de cobertura.

### Build do projeto:

```bash
npm run build
```

Builda todos os workspaces (client e server).

### Subir containers Docker:

```bash
docker compose up --build
```

### Parar containers:

```bash
docker compose down
```

---

## 📂 Estrutura do Projeto

Este é um projeto **monorepo** usando npm workspaces:

```
oficina-2/
├── client/              # Frontend React + Vite + Tailwind CSS
├── server/              # Backend Node.js + Express + MongoDB
├── docs/                # Documentação do projeto
│   ├── DEFINICAO.md     # Definição do projeto, requisitos, cronograma
│   └── SPRINT1.md       # Documentação da Sprint 1
├── .github/workflows/   # Pipeline CI/CD (GitHub Actions)
└── docker-compose.yml   # Orquestração Docker
```

---

## 🔄 CI/CD

O projeto possui pipeline CI/CD configurado com **GitHub Actions** que executa automaticamente em push e pull requests.

📄 **Arquivo:** `.github/workflows/ci.yml`

**Etapas do pipeline:**

1. Instalação de dependências
2. Execução de testes com coverage
3. Build do projeto

Para mais detalhes, consulte [SPRINT1.md](docs/SPRINT1.md#-integração-contínua-cicd).

---

## 🛠️ Tecnologias

| Camada          | Tecnologias               |
| --------------- | ------------------------- |
| Frontend        | React, Vite, Tailwind CSS |
| Backend         | Node.js, Express          |
| Banco de Dados  | MongoDB (Mongoose)        |
| Testes          | Jest + Supertest          |
| CI/CD           | GitHub Actions            |
| Containerização | Docker + Docker Compose   |

---

## 📡 API

A API está disponível em `http://localhost:3000` (em desenvolvimento).

### Endpoints principais:

- **Autenticação:** `/auth/login`, `/auth/register`
- **Voluntários:** `/voluntarios` (CRUD completo)
- **Oficinas:** `/oficinas` (CRUD completo)
- **Health Check:** `/health`

Para documentação completa dos endpoints, consulte [SPRINT1.md](docs/SPRINT1.md#-api-endpoints).
