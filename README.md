# 📌 Sistema de Controle de Voluntários  

Projeto acadêmico desenvolvido para gerenciar voluntários de um projeto social, incluindo cadastro, controle de datas de entrada/saída, oficinas em que já atuaram e geração de termos de voluntariado.  

---

## 👥 Integrantes do Grupo
- Vitor de Tulio  
- Victor Motta  
- Mateus Chicoli  
- Pedro Oliveira  

---

## 🎯 Objetivos do Sistema
O sistema visa facilitar a gestão de voluntários e suas atividades dentro do projeto, permitindo:  
- Cadastro de voluntários.  
- Controle de datas de entrada e saída.  
- Associação de voluntários às oficinas.  
- Histórico de participação em oficinas.  
- Geração de termo de voluntariado em PDF.  
- Relatórios de voluntários ativos/inativos.  

---

## ✅ Requisitos Funcionais
| ID   | Requisito Funcional              | Descrição                                                                                                                                                        | Prioridade |
| ---- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RF01 | Cadastro de Voluntário           | O sistema deve permitir o cadastro de voluntários com dados pessoais (nome completo, CPF, RG, e-mail, telefone, endereço)                                        | Alta       |
| RF02 | Registro de Datas                | O sistema deve registrar **data de entrada** e **data de saída** do voluntário no projeto                                                                        | Alta       |
| RF03 | Atualização de Dados             | O sistema deve permitir a edição/atualização dos dados de um voluntário cadastrado                                                                               | Média      |
| RF04 | Inativação de Voluntário         | O sistema deve permitir marcar um voluntário como “inativo” ao registrar sua data de saída                                                                       | Média      |
| RF05 | Cadastro de Oficinas             | O sistema deve permitir cadastrar oficinas com dados básicos (título, descrição, data, local, responsável)                                                       | Alta       |
| RF06 | Associação Voluntário–Oficina    | O sistema deve permitir vincular voluntários às oficinas em que atuaram (com função exercida e período)                                                          | Alta       |
| RF07 | Histórico de Participação        | O sistema deve exibir o histórico completo de oficinas em que cada voluntário atuou                                                                              | Média      |
| RF08 | Geração de Termo de Voluntariado | O sistema deve gerar automaticamente um termo de voluntariado (em PDF) para cada voluntário, contendo dados pessoais, período de atuação e oficinas em que atuou | Alta       |
| RF09 | Download/Impressão do Termo      | O sistema deve permitir o download ou impressão do termo de voluntariado gerado                                                                                  | Média      |
| RF10 | Busca e Filtro de Voluntários    | O sistema deve permitir buscar voluntários por nome, CPF ou oficina em que atuaram                                                                               | Média      |
| RF11 | Autenticação e Perfis de Acesso  | O sistema deve permitir autenticação de usuários e diferenciar permissões (administrador x voluntário)                                                           | Alta       |
| RF12 | Dashboard Resumido (opcional)    | O sistema deve apresentar um painel com número de voluntários ativos, oficinas cadastradas, termos gerados                                                       | Baixa      | 

---

## 🏗️ Arquitetura em Alto Nível

### Tecnologias
- **Frontend:** React + Tailwind
- **Backend:** Node.js (Express)
- **Banco de Dados:** MongoDB  
- **Testes:** Jest
- **CI/CD:** GitHub Actions  
- **Containerização:** Docker  

| Período                             | Atividade                                                                                                                                                                                                                                                                                                                 | Entregáveis                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **15/09 – 22/09** (1ª semana)       | **Planejamento inicial**<br>- Definir tema e equipe<br>- Levantar requisitos funcionais<br>- Desenhar arquitetura em alto nível<br>- Definir estratégia de automação de testes (Jest + GitHub Actions)<br>- Definir tecnologias (React, Node, MongoDB, Docker)<br>- Criar repositório GitHub com README e pastas iniciais | Documento de requisitos + Diagrama de arquitetura + Repositório inicial |
| **23/09 – 29/09** (2ª semana)       | **Configuração do ambiente**<br>- Criar Docker Compose com backend, frontend, MongoDB<br>- Configurar pipeline GitHub Actions (build + testes)<br>- Escrever testes iniciais (placeholder)                                                                                                                                | Ambiente pronto (Docker + GitHub Actions)                               |
| **30/09 – 13/10** (3ª e 4ª semanas) | **Sprint 1 – Desenvolvimento**<br>- Implementar cadastro de voluntários (CRUD)<br>- Implementar cadastro de oficinas (CRUD)<br>- Implementar autenticação básica (admin x voluntário)<br>- Criar testes unitários das funcionalidades implementadas                                                                       | Código + testes funcionando para RF01–RF06                              |
| **14/10 – 18/10** (5ª semana)       | **Sprint Review 1**<br>- Gravar vídeo (até 3 min) mostrando funcionalidades e testes<br>- Submeter repositório atualizado                                                                                                                                                                                                 | Vídeo Sprint 1 + Repositório atualizado                                 |
| **19/10 – 25/10** (6ª semana)       | Ajustes solicitados pelo professor do Sprint 1                                                                                                                                                                                                                                                                            | Correções aplicadas                                                     |
| **26/10 – 16/11** (7ª a 9ª semanas) | **Sprint 2 – Desenvolvimento**<br>- Implementar geração de termo de voluntariado (PDF)<br>- Implementar histórico de atuação de voluntários<br>- Buscar/filtrar voluntários<br>- Exportar dados (CSV/Excel)<br>- Criar testes unitários/integração                                                                        | Código + testes funcionando para RF07–RF12                              |
| **17/11 – 21/11** (10ª semana)      | **Sprint Review 2**<br>- Gravar vídeo (até 3 min) mostrando funcionalidades e testes<br>- Submeter repositório atualizado                                                                                                                                                                                                 | Vídeo Sprint 2 + Repositório atualizado                                 |
| **22/11 – 29/11** (11ª semana)      | Ajustes finais (bugs, novos requisitos, melhorias solicitadas pelo professor)                                                                                                                                                                                                                                             | Versão final do sistema + testes                                        |
| **30/11 – 08/12** (12ª semana)      | **Entrega Final**<br>- Consolidar documentação<br>- Atualizar README e diagramas<br>                                                                                                                                                                                      | Projeto final no GitHub, documentação e testes completos                |


### Diagrama de Arquitetura
![diagrama_oficina2](https://github.com/user-attachments/assets/88e7d72d-0427-41b1-8dea-fe65bb9d3011)
