<h1 align="center">🏥 Asclepios Clinic — Hospital Management System</h1>

<p align="center">
Modern hospital management interface built with <strong>React</strong>, featuring modules for Patients, Appointments, Pharmacy, Finance, Reports, and an integrated virtual assistant (EVA).
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18.2.0-20232A?logo=react&logoColor=61DAFB">
  <img alt="React Router" src="https://img.shields.io/badge/React_Router-6.26-CA4245?logo=reactrouter&logoColor=white">
  <img alt="Bootstrap" src="https://img.shields.io/badge/Bootstrap-5.3-563D7C?logo=bootstrap&logoColor=white">
  <img alt="React Bootstrap" src="https://img.shields.io/badge/React_Bootstrap-2.10-38BDF8?logo=bootstrap&logoColor=white">
  <img alt="Chart.js" src="https://img.shields.io/badge/Chart.js-4.4.3-F5788D?logo=chartdotjs&logoColor=white">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-16+-339933?logo=nodedotjs&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-blue.svg">
  <img alt="Status" src="https://img.shields.io/badge/Status-In_Development-yellow">
  <img alt="Platform" src="https://img.shields.io/badge/Platform-Web-lightgrey">
</p>

---


## 🩺 Overview
Asclepios Clinic is a modern **hospital management system** designed to streamline clinic operations through an intuitive interface and simulated backend.

- Built as a **React Single Page Application (SPA)** with Context API for state management  
- UI powered by **Bootstrap** and **React-Bootstrap**  
- Routing handled by **React Router v6**  
- Visual data represented using **Chart.js**  
- Authentication and data simulated through **localStorage**


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

## 🎨 Design & UI
- **Theme:** Glassmorphism with translucency, blur, and layered shadows  
- **Palette:** Deep blue gradient with cyan highlights  
- **Layout:** Sidebar navigation with responsive header  
- **Typography:** Sans-serif, clean, and accessible  
- **Focus:** Readability and UX clarity across modules


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

## 🤖 EVA Chatbot
EVA (Enhanced Virtual Assistant) is a built-in assistant for quick navigation and data queries.

| Capability | Example (EN) | Example (PT) |
|-------------|--------------|--------------|
| **Navigation** | `open patients` | `abrir pacientes` |
| **Data Queries** | `how many appointments` | `quantos agendamentos` |
| **Reminders** | `add reminder call Dr. Silva` | `adicionar lembrete pagar fornecedor` |
| **Preferences** | `set default section finance` | `definir seção padrão financeiro` |
| **Summaries** | `daily summary` | `resumo diário` |
| **Help / Small Talk** | `help`, `good morning` | `ajuda`, `bom dia` |

🧠 EVA keeps a per-user memory (history and preferences) in `localStorage` and supports both English and Portuguese commands.

## Screenshots
<img width="1870" height="950" alt="image" src="https://github.com/user-attachments/assets/c7623ecc-b6f1-4e0d-9f1c-cc75248275fa" />
<img width="1857" height="949" alt="image" src="https://github.com/user-attachments/assets/f85f68cb-0070-4bcf-966b-ef513f1d9b0c" />
<img width="1854" height="947" alt="image" src="https://github.com/user-attachments/assets/22b11f15-41dc-4b7e-adf0-5d772e6a8e3f" />
<img width="1868" height="949" alt="image" src="https://github.com/user-attachments/assets/7b2f3e8f-33a1-4776-8c3c-717ff5dd4abc" />
<img width="1869" height="950" alt="image" src="https://github.com/user-attachments/assets/3b6e0d84-f6c3-4618-ac44-2816be3d2b60" />


## User Profile (Avatar)
- **Upload:** In the “Profile” modal, choose an image (`accept="image/*"`)
- **Preview:** Circular display shown before saving
- **Persistence:** Managed through `updateUserProfile` in `AuthContext` (localStorage)
- **Header:** Avatar displayed next to the user’s name

src/
├── components/
│   ├── EVAChat.js          # EVA chatbot modal
│   ├── Layout.js           # Main layout with sidebar & header
│   └── PerfilUsuario.js    # User profile modal (avatar upload)
├── context/
│   ├── AuthContext.js      # Simulated auth & profile state
│   └── DataContext.js      # Mocked data for modules
├── pages/
│   ├── Login.js            # Login screen
│   ├── Dashboard.js        # Main overview page
│   └── Financeiro.js       # Finance module
└── assets/
    └── css/styles.css      # Global styling


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
- `npm run build` — production build
- `npm test` — tests (if applicable)
