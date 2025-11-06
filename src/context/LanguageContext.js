import React, { createContext, useContext, useEffect, useState } from 'react';

const LanguageContext = createContext({ language: 'en', setLanguage: () => {}, t: (k) => k });

const translations = {
  en: {
    menu: {
      title: 'Menu',
      dashboard: 'Dashboard',
      patients: 'Patients',
      appointments: 'Appointments',
      pharmacy: 'Pharmacy',
      hr: 'Human Resources',
      finance: 'Finance',
      reports: 'Reports'
    },
    nav: {
      profile: 'Profile',
      logout: 'Logout'
    },
    eva: {
      open: 'Open EVA'
    }
  },
  pt: {
    menu: {
      title: 'Menu',
      dashboard: 'Painel',
      patients: 'Pacientes',
      appointments: 'Agendamentos',
      pharmacy: 'Farmácia',
      hr: 'Recursos Humanos',
      finance: 'Financeiro',
      reports: 'Relatórios'
    },
    nav: {
      profile: 'Perfil',
      logout: 'Sair'
    },
    eva: {
      open: 'Abrir EVA'
    }
  }
};

function getNested(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'pt' || stored === 'en') return stored;
    localStorage.setItem('lang', 'en');
    return 'en';
  });

  const setLanguage = (lang) => {
    const next = lang === 'pt' ? 'pt' : 'en';
    setLanguageState(next);
    localStorage.setItem('lang', next);
  };

  const t = (key) => {
    const value = getNested(translations[language] || translations.en, key);
    return value === undefined ? key : value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);