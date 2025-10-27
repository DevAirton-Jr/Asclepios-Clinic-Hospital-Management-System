# Clínica Asclepios — Sistema de Gestão Hospitalar

Interface moderna de gestão hospitalar com módulos de Pacientes, Agendamentos, Farmácia, Financeiro, Relatórios e um assistente virtual integrado (EVA). Este repositório é 100% frontend (React); os dados e autenticação são simulados via Context API e `localStorage`.

## Visão Geral
- SPA em React com Context API (estado global)
- UI com Bootstrap e React-Bootstrap
- Navegação com React Router
- Gráficos com Chart.js (quando aplicável)
- Sem backend neste repositório (planejado para próxima fase)

## Funcionalidades
- Autenticação simulada de funcionários (login/logout)
- Dashboard com visão geral
- Gerenciamento de pacientes
- Agendamentos de consultas e procedimentos
- Farmácia e controle de medicamentos
- Recursos humanos e gestão de funcionários
- Financeiro (receitas, despesas) e relatórios básicos
- Chatbot EVA para atalhos e consultas rápidas

## Instalação e Desenvolvimento
- Pré-requisitos: Node 16+ e npm 8+
- Instalar dependências: `npm install`
- Iniciar em dev: `npm start` (porta padrão `3000`; em alguns ambientes `3001`)
- Testes manuais:
  - Login (background, logo, contraste)
  - EVA (abrir, enviar `ajuda`, navegação e consultas)
  - Perfil (upload e exibição do avatar no header)

## Chatbot EVA
Assistente integrado para atalhos de navegação e consultas rápidas.

- Acesso: botão flutuante no canto inferior direito (ícone de robô)
- Interface: modal de chat com histórico e campo de entrada
- Dados: `DataContext` (conteúdos simulados) e `AuthContext` (usuário atual)

### Comandos da EVA
- Navegação: `abrir pacientes`, `abrir agendamentos`, `abrir farmácia`, `abrir financeiro`, `abrir relatórios`, `abrir dashboard`
- Consultas: `quantos pacientes`, `quantos agendamentos`, `quantos funcionários`, `total de receitas`, `total de despesas`, `buscar paciente <nome>`
- Small talk: `bom dia`, `oi`, `tudo bem`, `obrigado`, etc.
- Ajuda: `ajuda` ou `comandos` — exibe a lista no chat

## Perfil do Usuário (Avatar)
- Upload: no modal “Perfil”, escolha uma imagem (`accept="image/*"`)
- Preview: exibição circular antes de salvar
- Persistência: `updateUserProfile` no `AuthContext` (localStorage)
- Header: avatar visível ao lado do nome do usuário

## Estrutura do Projeto
- `src/components/EVAChat.js` — modal do chatbot e intenções
- `src/components/Layout.js` — header, sidebar e botão EVA flutuante
- `src/components/PerfilUsuario.js` — modal de perfil com upload de avatar
- `src/pages/Login.js` — tela de login com design moderno
- `src/context/AuthContext.js` — autenticação e perfil (localStorage)
- `src/context/DataContext.js` — dados simulados e operações

## Convenções
- Idioma: Português (Brasil)
- Estilo: React + Bootstrap, ícones `react-icons`
- Estado: Context API, sem Redux
- Assets: imagens em `src/assets/images/`

## Scripts
- `npm start` — servidor de desenvolvimento
- `npm build` — build de produção
- `npm test` — testes (se aplicável)

## Roadmap (próxima fase)
- Backend Node/Express com persistência (MongoDB ou Postgres)
- API REST para pacientes, agendamentos, farmácia e financeiro
- Integração do frontend via `axios` com autenticação JWT
- Log da EVA por usuário e comandos com confirmação

