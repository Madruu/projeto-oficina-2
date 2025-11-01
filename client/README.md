# 🎨 Frontend - Sistema de Controle de Voluntários

Este é o frontend do Sistema de Controle de Voluntários, desenvolvido com React e Tailwind CSS.

---

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn
- Docker e Docker Compose (para ambiente dockerizado)

---

## 🐳 Executando com Docker Compose

O frontend pode ser executado via Docker Compose junto com o backend e MongoDB.

### 1. Configurar variáveis de ambiente

Certifique-se de que o arquivo `.env` na raiz do projeto está configurado (opcional para o client).

### 2. Iniciar os serviços

```bash
# Na raiz do projeto
docker compose up frontend backend
```

Para executar em background:

```bash
docker compose up -d frontend backend
```

### 3. Verificar se está funcionando

O frontend estará disponível em `http://localhost:3000`

---

## 💻 Executando localmente (sem Docker)

### 1. Instalar dependências

```bash
cd client
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### 3. Build para produção

```bash
npm run build
```

O build será gerado na pasta `dist/`

### 4. Preview do build

```bash
npm run preview
```

---

## 🏗️ Estrutura do Projeto

```
client/
├── src/
│   ├── pages/
│   │   └── Login.jsx           # Página de login
│   ├── App.jsx                 # Componente principal com rotas
│   ├── main.jsx                # Entry point da aplicação
│   └── index.css               # Estilos globais (Tailwind)
├── index.html                  # HTML principal
├── vite.config.js              # Configuração do Vite
├── tailwind.config.js           # Configuração do Tailwind CSS
├── postcss.config.js            # Configuração do PostCSS
├── Dockerfile                   # Dockerfile para produção (Nginx)
├── Dockerfile.dev               # Dockerfile para desenvolvimento
├── .dockerignore                # Arquivos ignorados no build Docker
├── package.json                 # Dependências do projeto
└── README.md                    # Este arquivo
```

---

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com hot reload
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm test` - Executa os testes (a implementar)
- `npm run lint` - Executa o linter (a implementar)

---

## 🎨 Tecnologias

- **React** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento para aplicações React
- **PostCSS** - Processador de CSS
- **Docker** - Containerização

---

## 🔗 Rotas

### GET /login
Página de login com campos de email e senha.

---

## 🐳 Docker

### Build da imagem (desenvolvimento)

```bash
docker build -f Dockerfile.dev -t oficina-2-frontend-dev ./client
```

### Build da imagem (produção)

```bash
docker build -t oficina-2-frontend ./client
```

### Executar container (desenvolvimento)

```bash
docker run -p 3000:3000 -v $(pwd)/client:/app oficina-2-frontend-dev
```

### Executar container (produção)

```bash
docker run -p 3000:80 oficina-2-frontend
```

---

## 📝 Notas

- O frontend utiliza Vite como build tool para desenvolvimento rápido
- Tailwind CSS está configurado e funcionando
- Hot reload está habilitado para desenvolvimento com Docker
- Em produção, o frontend é servido via Nginx
- A porta padrão é 3000 (configurável via `CLIENT_PORT` no `.env`)

---

## 🚀 Deploy em Produção

Para deploy em produção, utilize o `docker-compose.prod.yml`:

```bash
docker compose -f docker-compose.prod.yml up -d
```

O frontend será servido via Nginx na porta 3000 (ou a porta configurada em `CLIENT_PORT`).

