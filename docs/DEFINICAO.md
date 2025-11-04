## 🧩 Visão Geral do Projeto

Este repositório contém uma aplicação **full-stack** dividida em duas partes principais:

- **`client`** → frontend em **React (Vite + Tailwind CSS)**
- **`server`** → backend em **Node.js (Express)** com **MongoDB (Mongoose)**

O sistema também conta com **autenticação JWT**, **testes automatizados com Jest**, **pipeline CI via GitHub Actions** e **execução em containers Docker**.

---

## ⚙️ Tecnologias Utilizadas

| Camada          | Tecnologias               |
| --------------- | ------------------------- |
| Frontend        | React, Vite, Tailwind CSS |
| Backend         | Node.js, Express          |
| Banco de Dados  | MongoDB (Mongoose)        |
| Testes          | Jest + Supertest          |
| CI/CD           | GitHub Actions            |
| Containerização | Docker + Docker Compose   |

---

## 🗂️ Estrutura do Repositório

📦 sistema-voluntarios
┣ 📂 client # Frontend (React + Vite)
┣ 📂 server # Backend (Node + Express + MongoDB)
┣ 📂 .github/workflows # Pipeline CI (GitHub Actions)
┣ 📂 docs # Documentação do projeto
┣ 📜 docker-compose.yml # Orquestração local (frontend, backend, mongo)
┣ 📜 package.json
┗ 📜 README.md

---

## 🧱 Requisitos do Sistema

- **Node.js** v16+
- **npm** v8+ (ou pnpm/yarn)
- **Docker & Docker Compose** (opcional, mas recomendado)

---

## ✅ Requisitos Funcionais

| ID   | Requisito                        | Descrição                                                                                         | Prioridade |
| ---- | -------------------------------- | ------------------------------------------------------------------------------------------------- | ---------- |
| RF01 | Cadastro de Voluntário           | Permitir o cadastro de voluntários com dados pessoais (nome, CPF, RG, e-mail, telefone, endereço) | Alta       |
| RF02 | Registro de Datas                | Registrar **data de entrada** e **data de saída**                                                 | Alta       |
| RF03 | Atualização de Dados             | Editar e atualizar informações de voluntários                                                     | Média      |
| RF04 | Inativação de Voluntário         | Marcar voluntário como inativo ao registrar a saída                                               | Média      |
| RF05 | Cadastro de Oficinas             | Cadastrar oficinas com título, descrição, data e responsável                                      | Alta       |
| RF06 | Associação Voluntário–Oficina    | Vincular voluntários às oficinas que participaram                                                 | Alta       |
| RF07 | Histórico de Participação        | Exibir histórico completo de oficinas por voluntário                                              | Média      |
| RF08 | Geração de Termo de Voluntariado | Gerar PDF com dados pessoais e histórico de atuação                                               | Alta       |
| RF09 | Download/Impressão do Termo      | Permitir download ou impressão do termo                                                           | Média      |
| RF10 | Busca e Filtro de Voluntários    | Buscar por nome, CPF ou oficina                                                                   | Média      |
| RF11 | Autenticação e Perfis            | Diferenciar permissões de **Admin** e **Voluntário** via JWT                                      | Alta       |
| RF12 | Dashboard (opcional)             | Exibir resumo com estatísticas gerais                                                             | Baixa      |

---

## 🏗️ Arquitetura em Alto Nível

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js (Express)
- **Banco:** MongoDB
- **Testes:** Jest
- **CI/CD:** GitHub Actions
- **Containerização:** Docker

---

## 📅 Cronograma

| Período           | Atividade                                                               | Entregáveis                                       |
| ----------------- | ----------------------------------------------------------------------- | ------------------------------------------------- |
| **15/09 – 22/09** | Planejamento inicial, levantamento de requisitos e setup do repositório | Documento de requisitos + diagrama + repo inicial |
| **23/09 – 29/09** | Configuração do ambiente (Docker + GitHub Actions)                      | Pipeline e containers prontos                     |
| **30/09 – 13/10** | Sprint 1 – CRUD de voluntários e oficinas + autenticação                | Código + testes RF01–RF06                         |
| **14/10 – 18/10** | Sprint Review 1 + vídeo demonstrativo                                   | Vídeo Sprint 1                                    |
| **26/10 – 16/11** | Sprint 2 – termo de voluntariado + filtros + histórico                  | Código + testes RF07–RF12                         |
| **17/11 – 21/11** | Sprint Review 2 + vídeo final                                           | Vídeo Sprint 2                                    |
| **30/11 – 08/12** | Entrega final e documentação                                            | Projeto completo + README atualizado              |

---

## 🧭 Diagrama de Arquitetura

![diagrama_oficina2](https://github.com/user-attachments/assets/88e7d72d-0427-41b1-8dea-fe65bb9d3011)

---

## 📹 Vídeo Demonstrativo

🎥 _Demonstração do sistema completo: autenticação JWT, CRUD de voluntários e oficinas, geração de termo em PDF e execução automática de testes via GitHub Actions._

(Link do vídeo será adicionado aqui após upload.)

---

## 🪪 Licença

Distribuído sob a licença **ISC**. Consulte o `package.json` para mais detalhes.
