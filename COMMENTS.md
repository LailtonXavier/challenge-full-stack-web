# 💬 Comentários do Projeto - Módulo Acadêmico (Back-End e Front-End)

Este documento visa detalhar as decisões técnicas tomadas, as ferramentas utilizadas e as considerações sobre o desenvolvimento deste Back-End.

---

## 1. Decisão da Arquitetura Utilizada

**Arquitetura:** Clean Architecture (Arquitetura Limpa).

**Motivação:**
A escolha pela **Clean Architecture** foi estratégica e orientada pela escalabilidade e manutenibilidade do projeto.

1.  **Separação de Preocupações:** Ela garante que as regras de negócio (Use Cases e Entidades) sejam independentes de detalhes de infraestrutura (Frameworks, Bancos de Dados, UI, etc.). Isso isola o core da aplicação, tornando-o mais robusto e fácil de testar.
2.  **Escalabilidade e Longa Duração:** Pensando em um cenário de crescimento, a arquitetura facilita a adição de novas funcionalidades ou a migração de tecnologias (ex: trocar o ORM ou o banco de dados) sem impactar o núcleo da aplicação.
3.  **Organização e Padrão:** A estrutura de pastas bem definida (Core, Application, Infra) proporciona uma organização lógica que acelera o onboarding de novos desenvolvedores e padroniza a localização de cada componente (Controller, Use Case, Repository).
4.  **Aprendi que não desenvolvemos pra nós mesmos!** Mas sim para o dev que virá apartir de mim.

---

## 2.1 Lista de Bibliotecas de Terceiros Utilizadas - BackEnd

O projeto utilizou um conjunto de ferramentas modernas e robustas para garantir qualidade, segurança e eficiência no desenvolvimento:

| Categoria | Biblioteca/Ferramenta | Finalidade |
| :--- | :--- | :--- |
| **Padrões de Código** | `eslint`, `prettier` | Manter um código limpo, consistente e padronizado em todo o projeto. |
| **Testes** | `jest`, `ts-jest` | Criação de Testes Unitários e de Integração, garantindo a confiabilidade das regras de negócio e a comunicação entre camadas. |
| **Validação** | `zod` | Validação estrita dos DTOs (Data Transfer Objects) de entrada e saída, substituindo validações manuais. |
| **Banco de Dados** | `prisma`, `postgresql` | ORM (Object-Relational Mapping) moderno e tipado para interagir com o PostgreSQL, garantindo segurança e migrações eficientes. |
| **Autenticação** | `jsonwebtoken` (JWT), `bcrypt` | Geração e verificação de tokens seguros para autenticação, e hashing seguro de senhas. |
| **Infraestrutura** | `Docker` | Containerização do ambiente de desenvolvimento e produção (aplicação e banco de dados), garantindo portabilidade e fácil setup. |
| **Documentação** | `swagger-jsdoc`, `swagger-ui-express` | Geração de documentação interativa (OpenAPI) para os endpoints da API. |
| **Controle de Versão** | `husky` | Hooks de Git para automatizar validações e formatação de código antes de cada commit. |
| **Tratamento de Erros** | Classes de Erros Personalizadas | Implementação de um sistema de erros padronizado e centralizado (`AppError`, `NotFoundError`, etc.). |

---
## 2.2 Lista de Bibliotecas de Terceiros Utilizadas - FrontEnd

O projeto utilizou um conjunto de ferramentas modernas e robustas para garantir qualidade, segurança e eficiência no desenvolvimento:

| Categoria | Biblioteca/Ferramenta | Finalidade |
| :--- | :--- | :--- |
| **Framework UI** | `vue` | Biblioteca/Framework principal para a construção da interface de usuário (UI). |
| **Componentes UI** | `vuetify` | Framework de componentes UI (baseado em Material Design) para Vue.js. |
| **Plugin Vuetify** | `vite-plugin-vuetify` | Plugin para o bundler Vite otimizar a importação e uso do Vuetify. |
| **Iconografia** | `@mdi/font` | Fonte de ícones do Material Design Icons, usada pelo Vuetify. |
| **Roteamento** | `vue-router` | Gerenciamento de rotas e navegação dentro da aplicação Vue.js. |
| **Gerenciamento de Estado** | `pinia` | Biblioteca de gerenciamento de estado leve e tipada para Vue.js. |
| **Requisições HTTP** | `axios` | Cliente HTTP baseado em Promises, usado para comunicação com o backend (APIs). |
| **Gerenciamento de Query** | `@tanstack/vue-query` | Ferramenta para gerenciar, armazenar em cache e sincronizar o estado assíncrono (dados do servidor). |
| **Validação** | `zod` | Biblioteca de declaração e validação de esquemas (usada para validar dados e formulários). |
| **Validação de Formulários** | `vee-validate` | Biblioteca de validação de formulários para Vue.js. |
| **Integração Validação** | `@vee-validate/zod` | Adaptador para integrar o `vee-validate` com o `zod` para definição de esquemas. |
| **Notificações/Toasts** | `vue-sonner` | Biblioteca para exibir notificações/toasts não obstrutivas na interface. |
---

## 3. O Que Você Melhoraria se Tivesse Mais Tempo
### Back-End e Back-End

Com tempo adicional para refinamento, as seguintes melhorias seriam implementadas:

1.  **Testes End-to-End (E2E):** Implementação de uma suíte de testes E2E para simular o comportamento real do usuário, passando por todas as camadas da aplicação (da requisição HTTP ao banco de dados e vice-versa).
2.  **Rotas `Employee` Adicionais:** Expandir o endpoint `Employee` com rotas de gestão de perfil:
    * `PUT /employees/{id}`: Rota para editar informações (nome, senha).
    * `POST /employees/{id}/profile-picture`: Rota para upload e gerenciamento de fotos de perfil.
3.  **Chatbot de Suporte Integrado (Bônus Avançado):** Criação de um serviço de chatbot utilizando Inteligência Artificial (IA) para fornecer suporte instantâneo ao usuário, respondendo dúvidas sobre o funcionamento do módulo acadêmico e rotinas do sistema. (Experiência em projetos anteriores me permite estimar a viabilidade desta integração).
4.  **Adicionaria uma nova rota de 'Esqueci a senha':** Criaria uma logica para enviar  um codigo para o e-mail do usuario para mudar a senha.
5.  **Criaria testes no FrontEnd :** Pra ter uma segurança nos componentes criaria testes Unitarios e de Integração no Front-End.

---

## 4. Quais Requisitos Obrigatórios que Não Foram Entregues

Todos os requisitos obrigatórios estabelecidos no desafio foram **entregues** e validados.

O foco foi entregar não apenas o mínimo funcional, mas um produto **completo e de nível profissional**, o que incluiu diversos itens bônus como:

* Tratamento de erros padronizado.
* Validação estrita de DTOs (`zod`).
* Configuração completa de testes unitários e de integração (`jest`).
* Documentação interativa (`Swagger/OpenAPI`).
* Uso de Docker para orquestração de ambiente.

**Objetivo:** Meu objetivo foi utilizar este desafio como uma oportunidade para demonstrar proficiência em práticas de desenvolvimento moderno e a paixão por criar software de alta qualidade.