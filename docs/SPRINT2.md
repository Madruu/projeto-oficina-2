# 📋 Sprint 2 - Documentação

Documentação completa da Sprint 2 do projeto Sistema de Controle de Voluntários.

---

## 🎨 Frontend Completo

Nesta sprint foi desenvolvido todo o **frontend** da aplicação utilizando **React + Vite + Tailwind CSS**, com integração completa ao backend.

### Páginas Implementadas

| Página                            | Descrição             | Funcionalidades                                                |
| --------------------------------- | --------------------- | -------------------------------------------------------------- |
| **Login**                         | Tela de autenticação  | Login com JWT, validação de campos, feedback visual            |
| **Dashboard**                     | Painel principal      | Estatísticas gerais, cards informativos, gráficos de resumo    |
| **Voluntários**                   | Gestão de voluntários | Listagem, busca avançada, filtros, paginação                   |
| **Cadastro de Voluntário**        | Formulário completo   | Todos os campos pessoais, validação, máscaras                  |
| **Detalhes do Voluntário**        | Visualização completa | Dados pessoais, histórico de participação, oficinas associadas |
| **Oficinas**                      | Gestão de oficinas    | Listagem, criação, edição, exclusão                            |
| **Associação Voluntário-Oficina** | Vinculação            | Interface para associar voluntários às oficinas                |

### Componentes Reutilizáveis

```
client/src/components/
├── Layout.jsx           # Layout principal com sidebar e header
├── Modal.jsx            # Modal genérico reutilizável
├── WorkshopForm.jsx     # Formulário de oficinas
├── VolunteerForm.jsx    # Formulário de voluntários
└── PrivateRoute.jsx     # Proteção de rotas autenticadas
```

### Integração com Backend

- ✅ Autenticação JWT com persistência em localStorage
- ✅ Interceptors Axios para token automático
- ✅ Tratamento de erros e feedback visual
- ✅ Loading states em todas as operações
- ✅ Refresh automático de dados

---

## 🔍 Busca Avançada e Filtros

Implementação completa de busca e filtros para voluntários:

### Filtros Disponíveis

| Filtro      | Tipo   | Descrição                                  |
| ----------- | ------ | ------------------------------------------ |
| **Nome**    | Texto  | Busca por nome completo (case-insensitive) |
| **CPF**     | Texto  | Busca por CPF (parcial ou completo)        |
| **Oficina** | Select | Filtra voluntários por oficina associada   |
| **Status**  | Select | Filtra por ativos/inativos                 |

---

## 📜 Histórico de Participação

Implementação do histórico completo de participação dos voluntários:

### Funcionalidades

- ✅ Visualização de todas as oficinas que o voluntário participou
- ✅ Data de associação a cada oficina
- ✅ Ordenação cronológica (mais recente primeiro)
- ✅ Indicador de oficinas ativas/concluídas
- ✅ Estatísticas de participação (total de oficinas, tempo de voluntariado)

### Dados Exibidos

```
Para cada participação:
├── Nome da oficina
├── Data de associação
├── Responsável pela oficina
├── Local da oficina
└── Status (ativa/concluída)
```

---

## 📄 Geração do Termo de Voluntariado

Implementação da geração de PDF com termo de voluntariado utilizando **PDFKit**:

### Conteúdo do Termo

O termo gerado inclui:

1. **Cabeçalho institucional**

   - Logo/título da organização
   - Data de emissão

2. **Dados Pessoais do Voluntário**

   - Nome completo
   - CPF e RG
   - E-mail e telefone
   - Endereço completo

3. **Informações de Voluntariado**

   - Data de entrada
   - Data de saída (se aplicável)
   - Status atual (ativo/inativo)

4. **Histórico de Participação**

   - Lista de todas as oficinas
   - Datas de participação
   - Carga horária (quando disponível)

5. **Rodapé**
   - Espaço para assinaturas
   - Data e local

### Download/Impressão

- ✅ Download direto do PDF
- ✅ Abertura em nova aba para impressão
- ✅ Nome do arquivo: `termo_voluntario_<nome>.pdf`

---

## 📊 Dashboard

Implementação do painel de controle com estatísticas gerais:

### Métricas Exibidas

| Card                     | Descrição                                  |
| ------------------------ | ------------------------------------------ |
| **Total de Voluntários** | Número total de voluntários cadastrados    |
| **Voluntários Ativos**   | Quantidade de voluntários com status ativo |
| **Total de Oficinas**    | Número total de oficinas cadastradas       |
| **Associações**          | Total de vínculos voluntário-oficina       |

### Características do Dashboard

- ✅ Atualização automática dos dados
- ✅ Design responsivo (mobile-friendly)
- ✅ Indicadores visuais (ícones, cores)
- ✅ Links rápidos para ações principais

---

## 🔗 Associação Voluntário-Oficina

Interface completa para gerenciar vínculos entre voluntários e oficinas:

### Funcionalidades

- ✅ Seleção de voluntário com busca
- ✅ Seleção múltipla de oficinas (checkboxes)
- ✅ Indicador de oficinas já associadas
- ✅ Data de associação automática
- ✅ Feedback visual de sucesso/erro
- ✅ Prevenção de duplicatas

---

## 🧪 Testes da Sprint 2

Os testes existentes foram mantidos e novos cenários foram cobertos:

**Executar testes:**

```bash
npm run test              # Executa testes
npm run test:coverage     # Executa com relatório de cobertura
```

**Cobertura mantida:**

- ✅ Autenticação (login, register)
- ✅ Middleware de autenticação e autorização
- ✅ CRUD completo de Voluntários
- ✅ CRUD completo de Oficinas
- ✅ Health check da API
- ✅ Geração de termo PDF

---

## 📡 Novos Endpoints da API

### 📄 Termo de Voluntariado (`/voluntarios/:id/termo`)

| Método | Endpoint                 | Descrição                         | Acesso |
| ------ | ------------------------ | --------------------------------- | ------ |
| `GET`  | `/voluntarios/:id/termo` | Gera PDF do termo de voluntariado | Admin  |

---

## 📦 Entregas da Sprint 2

### ✅ Funcionalidades Implementadas

- ✅ Frontend completo em React + Tailwind CSS
- ✅ Integração frontend-backend via API REST
- ✅ Sistema de busca avançada com múltiplos filtros
- ✅ Histórico de participação por voluntário
- ✅ Geração de termo de voluntariado em PDF
- ✅ Download e impressão do termo
- ✅ Dashboard com estatísticas
- ✅ Interface de associação voluntário-oficina
- ✅ Design responsivo

### 📝 Requisitos Atendidos

- ✅ **RF07** - Histórico de Participação
- ✅ **RF08** - Geração de Termo de Voluntariado
- ✅ **RF09** - Download/Impressão do Termo
- ✅ **RF10** - Busca e Filtro de Voluntários
- ✅ **RF12** - Dashboard com estatísticas

### 📊 Resumo de Requisitos por Sprint

| Requisito                               | Sprint 1 | Sprint 2 |
| --------------------------------------- | -------- | -------- |
| RF01 - Cadastro de Voluntário           | ✅       | -        |
| RF02 - Registro de Datas                | ✅       | -        |
| RF03 - Atualização de Dados             | ✅       | -        |
| RF04 - Inativação de Voluntário         | ✅       | -        |
| RF05 - Cadastro de Oficinas             | ✅       | -        |
| RF06 - Associação Voluntário–Oficina    | ✅       | -        |
| RF07 - Histórico de Participação        | -        | ✅       |
| RF08 - Geração de Termo de Voluntariado | -        | ✅       |
| RF09 - Download/Impressão do Termo      | -        | ✅       |
| RF10 - Busca e Filtro de Voluntários    | -        | ✅       |
| RF11 - Autenticação e Perfis            | ✅       | -        |
| RF12 - Dashboard                        | -        | ✅       |

---

## 🔗 Links Relacionados

- [README Principal](../README.md) - Como rodar o projeto
- [Definição do Projeto](DEFINICAO.md) - Visão geral e requisitos
- [Sprint 1](SPRINT1.md) - Documentação da Sprint 1
