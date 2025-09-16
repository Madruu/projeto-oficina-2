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

### Diagrama de Arquitetura
![diagrama_oficina2](https://github.com/user-attachments/assets/88e7d72d-0427-41b1-8dea-fe65bb9d3011)
