# Asclepios Clinic — Hospital Management System

![React](https://img.shields.io/badge/React-18.2.0-20232A?logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-6.26-CA4245?logo=reactrouter&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-563D7C?logo=bootstrap&logoColor=white)
![React Bootstrap](https://img.shields.io/badge/React_Bootstrap-2.10-38BDF8?logo=react&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4.3-F5788D?logo=chartdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933?logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Status](https://img.shields.io/badge/Status-In_Development-yellow)
![Platform](https://img.shields.io/badge/Platform-Web-lightgrey)

Modern hospital management interface with modules for Patients, Appointments, Pharmacy, Finance, Reports, and an integrated virtual assistant (EVA).  
This repository is 100% frontend (React); data and authentication are simulated via Context API and `localStorage`.

![UI Preview](public/logo512.png)

## Overview
- React SPA with Context API (global state)
- UI built with Bootstrap and React-Bootstrap
- Navigation using React Router
- Charts powered by Chart.js (where applicable)
- No backend is included in this repository (planned for a future phase)

## Features
- Simulated staff authentication (login/logout)
- Dashboard with general overview
- Patient management
- Appointment and procedure scheduling
- Pharmacy and medication control
- Human resources and staff management
- Finance (revenue, expenses) and basic reports
- EVA chatbot for shortcuts and quick queries
- Language switcher (EN/PT) — default: English

## Design
- Glassmorphism theme with translucent surfaces, blur and soft shadows
- Dark blue background gradient and blue-accent highlights
- Neutralized primary variants; consistent dark/secondary actions

## Installation and Development
- **Prerequisites:** Node 16+ and npm 8+
- **Install dependencies:** `npm install`
- **Start development:** `npm start` (default port `3000`). If you prefer a fixed port: PowerShell `\` `$env:PORT=3011; npm start` or CMD `\` `set PORT=3011 && npm start`.
- **Manual tests:**
  - Login (background, logo, contrast)
  - EVA (open, send `help`, navigation, and queries)
  - Profile (upload and display avatar in the header)

## EVA Chatbot
Integrated assistant for navigation shortcuts and quick queries.

- **Access:** floating button at the bottom-right corner (robot icon)
- **Interface:** chat modal with message history and input field
- **Data:** `DataContext` (simulated content) and `AuthContext` (current user)

### EVA Commands (Updated 05.11)
- **Navigation (EN):** `open patients`, `open appointments`, `open pharmacy`, `open finance`, `open reports`, `open dashboard`
- **Navigation (PT):** `abrir pacientes`, `abrir agendamentos`, `abrir farmácia`, `abrir financeiro`, `abrir relatórios`, `abrir painel`
- **Queries (EN):** `how many patients`, `how many appointments`, `how many staff`, `total revenue`, `total expenses`, `find patient <name>`
- **Queries (PT):** `quantos pacientes`, `quantos agendamentos`, `quantos funcionários`, `receita total`, `despesas totais`, `buscar paciente <nome>`
- **Preferences (EN):** `set default section patients`, `open default section`, `set favorite specialty cardiology`, `show preferences`, `clear memory`
- **Preferences (PT):** `definir seção padrão pacientes`, `abrir seção padrão`, `definir especialidade favorita cardiologia`, `mostrar preferências`, `limpar memória`
- **Reminders (EN):** `add reminder call patient João`, `show reminders`, `remove reminder 1`, `clear reminders`
- **Reminders (PT):** `adicionar lembrete pagar fornecedor`, `mostrar lembretes`, `remover lembrete 1`, `limpar lembretes`
- **Summary:** EN — `summary`, `daily summary`, `clinic summary`; PT — `resumo`, `resumo diário`, `resumo do dia`
- **Small talk:** EN — `good morning`, `hi`, `how are you`; PT — `bom dia`, `oi`, `como vai`
- **Help:** EN — `help` or `commands`; PT — `ajuda` or `comandos`

**Notes:**
- EVA maintains per-user memory (history and preferences) in `localStorage`, keyed by user.
- Currency is formatted as `BRL` (Brazilian Real) using the `en-US` locale for consistency.

## Screenshots

> Replace these with actual screenshots of the UI later.

<p>
  <img alt="Dashboard" src="public/logo192.png" height="96" />
  <img alt="Login" src="public/logo512.png" height="96" />
</p>

## User Profile (Avatar)
- **Upload:** In the “Profile” modal, choose an image (`accept="image/*"`)
- **Preview:** Circular display shown before saving
- **Persistence:** Managed through `updateUserProfile` in `AuthContext` (localStorage)
- **Header:** Avatar displayed next to the user’s name

## Project Structure
- `src/components/EVAChat.js` — chatbot modal and intents
- `src/components/Layout.js` — header, sidebar, and floating EVA button
- `src/components/PerfilUsuario.js` — profile modal with avatar upload
- `src/pages/Login.js` — login screen with modern design
- `src/context/AuthContext.js` — authentication and profile (localStorage)
- `src/context/DataContext.js` — simulated data and operations

## Conventions
- **Language:** default English; optional Portuguese via language selector
- **Style:** React + Bootstrap, icons via `react-icons`
- **State:** Context API (no Redux)
- **Assets:** images in `src/assets/images/`

## Language Toggle (EN/PT)
**Location:** User Settings (Profile modal)
- **Persistence:** selection saved in `localStorage` (`lang`)
- **Default:** English (`en`)
- **Translated items:** header actions (Profile, Logout), sidebar menu (Dashboard, Patients, Appointments, Pharmacy, HR, Finance, Reports), EVA button tooltip

## Scripts
- `npm start` — development server
- `npm build` — production build
- `npm test` — tests (if applicable)
