# Asclepios Clinic — Hospital Management System

Modern hospital management interface with modules for Patients, Appointments, Pharmacy, Finance, Reports, and an integrated virtual assistant (EVA). This repository is 100% frontend (React); data and authentication are simulated via Context API and `localStorage`.

## Overview
- React SPA with Context API (global state)
- UI with Bootstrap and React-Bootstrap
- Navigation with React Router
- Charts with Chart.js (where applicable)
- No backend in this repository (planned for the next phase)

## Features
- Simulated staff authentication (login/logout)
- Dashboard with an overview
- Patient management
- Scheduling of appointments and procedures
- Pharmacy and medication control
- Human resources and staff management
- Finance (revenue, expenses) and basic reports
- EVA chatbot for shortcuts and quick queries

## Installation and Development
- Prerequisites: Node 16+ and npm 8+
- Install dependencies: `npm install`
- Start in development: `npm start` (default port `3000`; in some environments `3001`)
- Manual tests:
  - Login (background, logo, contrast)
  - EVA (open, send `help`, navigation and queries)
  - Profile (upload and display avatar in header)

## EVA Chatbot
Integrated assistant for navigation shortcuts and quick queries.

- Access: floating button at the bottom-right corner (robot icon)
- Interface: chat modal with history and input field
- Data: `DataContext` (simulated content) and `AuthContext` (current user)

### EVA Commands
- Navigation: `open patients`, `open appointments`, `open pharmacy`, `open finance`, `open reports`, `open dashboard`
- Queries: `how many patients`, `how many appointments`, `how many staff`, `total revenue`, `total expenses`, `find patient <name>`
- Small talk: `good morning`, `hi`, `how are you`, `thanks`, etc.
- Help: `help` or `commands` — displays the list in the chat

## User Profile (Avatar)
- Upload: in the “Profile” modal, choose an image (`accept="image/*"`)
- Preview: circular display before saving
- Persistence: `updateUserProfile` in `AuthContext` (localStorage)
- Header: avatar visible next to the user's name

## Project Structure
- `src/components/EVAChat.js` — chatbot modal and intents
- `src/components/Layout.js` — header, sidebar, and floating EVA button
- `src/components/PerfilUsuario.js` — profile modal with avatar upload
- `src/pages/Login.js` — login screen with modern design
- `src/context/AuthContext.js` — authentication and profile (localStorage)
- `src/context/DataContext.js` — simulated data and operations

## Conventions
- Language: Portuguese (Brazil)
- Style: React + Bootstrap, `react-icons` icons
- State: Context API, no Redux
- Assets: images in `src/assets/images/`

## Scripts
- `npm start` — development server
- `npm build` — production build
- `npm test` — tests (if applicable)

## Roadmap (next phase)
- Node/Express backend with persistence (MongoDB or Postgres)
- REST API for patients, appointments, pharmacy, and finance
- Frontend integration via `axios` with JWT authentication
- EVA logs per user and command confirmations

