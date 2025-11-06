import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Modal, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const initialGreetings = [
  'Hello! I am EVA, the clinic assistant.',
  'How can I help you today?',
  'You can ask: "how many patients?", "open appointments", or just say "good morning".'
];

const EVAChat = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const data = useContext(DataContext);
  const { user } = useAuth();
  const { language } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [context, setContext] = useState({ topic: null, lastRoute: null, details: null });
  const [preferences, setPreferences] = useState({ defaultSection: null, favoriteSpecialty: null });
  const [reminders, setReminders] = useState([]);

  const userKey = useMemo(() => {
    const id = user?.email || user?.nome || 'anonymous';
    return id.replace(/[^a-z0-9@._-]/gi, '').toLowerCase();
  }, [user]);

  const historyKey = useMemo(() => `eva_history_${userKey}`, [userKey]);
  const prefsKey = useMemo(() => `eva_prefs_${userKey}`, [userKey]);
  const remindersKey = useMemo(() => `eva_reminders_${userKey}`, [userKey]);

  const saveMemory = (msgs) => {
    try {
      const trimmed = msgs.slice(-100); // cap memory to last 100 messages
      localStorage.setItem(historyKey, JSON.stringify(trimmed));
    } catch {}
  };

  const savePreferences = (prefs) => {
    try {
      localStorage.setItem(prefsKey, JSON.stringify(prefs));
    } catch {}
  };

  const saveReminders = (list) => {
    try {
      localStorage.setItem(remindersKey, JSON.stringify(list));
    } catch {}
  };

  useEffect(() => {
    if (show) {
      setInput('');
      // Load history and preferences per user
      const stored = localStorage.getItem(historyKey);
      const prefs = localStorage.getItem(prefsKey);
      const rems = localStorage.getItem(remindersKey);
      if (prefs) {
        try { setPreferences(JSON.parse(prefs)); } catch {}
      }
      if (rems) {
        try { const r = JSON.parse(rems); if (Array.isArray(r)) setReminders(r); } catch {}
      }
      if (stored) {
        try {
          const hist = JSON.parse(stored);
          if (Array.isArray(hist) && hist.length) {
            setMessages(hist);
            return;
          }
        } catch {}
      }
      const name = (user?.nome || '').split(' ')[0] || '';
      const greetEn = [
        `Hello${name ? ' ' + name : ''}! I am EVA, your clinic assistant.`,
        'How can I help you today?',
        'Tip: say "help" to see available commands.'
      ];
      const greetPt = [
        `Olá${name ? ' ' + name : ''}! Eu sou a EVA, sua assistente.`,
        'Como posso ajudar hoje?',
        'Dica: diga "ajuda" para ver os comandos.'
      ];
      const initial = (language === 'pt' ? greetPt : greetEn).map((g) => ({ role: 'eva', text: g }));
      setMessages(initial);
      saveMemory(initial);
    }
  }, [show, language]);

  const smallTalk = useMemo(() => ({
    // English
    'good morning': 'Good morning! Hope your day is productive. How can I help?',
    'good afternoon': 'Good afternoon! How can I assist you?',
    'good evening': 'Good evening! Do you need anything in the system?',
    'hello': 'Hello! I can help with patients, appointments and more.',
    'hi': 'Hi! How are you? How can I help you today?',
    'how are you': "I'm doing great! How about you? Need anything?",
    'thank you': 'You’re welcome! Happy to help.',
    'thanks': 'Anytime! If you need, just say help.',
    'bye': 'Goodbye! If you need me, click the robot.',
    'goodbye': 'See you later! Have a great day.',
    // Portuguese
    'bom dia': 'Bom dia! Como posso ajudar hoje?',
    'boa tarde': 'Boa tarde! Em que posso ajudar?',
    'boa noite': 'Boa noite! Precisa de algo no sistema?',
    'olá': 'Olá! Posso ajudar com pacientes, agendamentos e mais.',
    'oi': 'Oi! Tudo bem? Como posso ajudar?',
    'como vai': 'Estou ótima! E você? Precisa de algo?',
    'obrigado': 'De nada! Sempre à disposição.',
    'obrigada': 'De nada! Sempre à disposição.',
    'valeu': 'Imagina! Qualquer coisa, diga "ajuda".',
    'tchau': 'Tchau! Se precisar, clique no robô.',
    'até mais': 'Até mais! Bom trabalho.'
  }), []);

  const moodIntents = [
    {
      pattern: /(i\s*am|i'm)\s*tired|estou\s*cansad[oa]/i,
      reply: () => {
        setContext((c) => ({ ...c, mood: 'tired' }));
        const name = (user?.nome || '').split(' ')[0] || '';
        return language === 'pt'
          ? `Entendo${name ? ', ' + name : ''}. Quer ver o resumo do dia ou os agendamentos pendentes?`
          : `I hear you${name ? ', ' + name : ''}. Would you like today’s summary or pending appointments?`;
      }
    },
    {
      pattern: /(i\s*am|i'm)\s*stressed|estou\s*estressad[oa]/i,
      reply: () => {
        setContext((c) => ({ ...c, mood: 'stressed' }));
        return language === 'pt'
          ? 'Respire fundo. Posso mostrar o resumo financeiro ou os agendamentos para ajudar a organizar.'
          : 'Take a deep breath. I can show the finance summary or appointments to help you organize.';
      }
    },
    {
      pattern: /(i\s*am|i'm)\s*busy|estou\s*ocupad[oa]/i,
      reply: () => {
        setContext((c) => ({ ...c, mood: 'busy' }));
        return language === 'pt'
          ? 'Certo. Quer atalhos rápidos? Posso abrir pacientes, agendamentos ou relatórios.'
          : 'Got it. Want quick shortcuts? I can open patients, appointments or reports.';
      }
    }
  ];

  const routerIntents = [
    { pattern: /open\s+(patients?)/i, action: () => navigate('/pacientes'), reply: 'Opening Patients.' },
    { pattern: /open\s+(appointments?)/i, action: () => navigate('/agendamentos'), reply: 'Opening Appointments.' },
    { pattern: /open\s+(pharmacy)/i, action: () => navigate('/farmacia'), reply: 'Opening Pharmacy.' },
    { pattern: /open\s+(finance)/i, action: () => navigate('/financeiro'), reply: 'Opening Finance.' },
    { pattern: /open\s+(reports?)/i, action: () => navigate('/relatorios'), reply: 'Opening Reports.' },
    { pattern: /open\s+(dashboard)/i, action: () => navigate('/'), reply: 'Opening Dashboard.' },
  ];

  const infoIntents = [
    { pattern: /how\s+many\s+patients/i, reply: () => `We have ${data.patients?.length || 0} registered patients.` },
    { pattern: /how\s+many\s+appointments/i, reply: () => `There are ${data.appointments?.length || 0} appointments.` },
    { pattern: /how\s+many\s+(staff|employees)/i, reply: () => `There are ${data.staff?.length || 0} staff members.` },
    { pattern: /total\s+revenue/i, reply: () => {
        const total = (data.transactions||[]).filter(t=>t.tipo==='receita').reduce((acc,t)=>acc+t.valor,0);
        return `Total revenue: ${total.toLocaleString('en-US', { style: 'currency', currency: 'BRL' })}`;
      }
    },
    { pattern: /total\s+expenses/i, reply: () => {
        const total = (data.transactions||[]).filter(t=>t.tipo==='despesa').reduce((acc,t)=>acc+t.valor,0);
        return `Total expenses: ${total.toLocaleString('en-US', { style: 'currency', currency: 'BRL' })}`;
      }
    },
    { pattern: /find\s+patient\s+(.+)/i, reply: (m) => {
        const name = m.match(/find\s+patient\s+(.+)/i)?.[1]?.trim();
        if (!name) return 'Please provide the name after "find patient".';
        const found = (data.patients||[]).filter(p => (p.nome||'').toLowerCase().includes(name.toLowerCase()));
        if (!found.length) return `I could not find patients matching "${name}".`;
        return `Found ${found.length}: ${found.slice(0,5).map(p=>p.nome).join(', ')}${found.length>5?'...':''}`;
      }
    }
  ];

  const getClinicSummary = () => {
    const appts = data.appointments || [];
    const pts = data.patients || [];
    const txs = data.transactions || [];
    const apptConfirmed = appts.filter(a => a.status === 'confirmado').length;
    const apptPending = appts.filter(a => a.status === 'pendente').length;
    const apptCancelled = appts.filter(a => a.status === 'cancelado').length;
    const ptActive = pts.filter(p => p.status === 'ativo').length;
    const ptInactive = pts.filter(p => p.status === 'inativo').length;
    const revenue = txs.filter(t => t.tipo === 'receita').reduce((acc,t)=>acc+t.valor,0);
    const expenses = txs.filter(t => t.tipo === 'despesa').reduce((acc,t)=>acc+t.valor,0);
    const net = revenue - expenses;
    const toBRL = (v) => v.toLocaleString('en-US', { style: 'currency', currency: 'BRL' });
    return [
      `Appointments — total: ${appts.length}, confirmed: ${apptConfirmed}, pending: ${apptPending}, cancelled: ${apptCancelled}.`,
      `Patients — total: ${pts.length}, active: ${ptActive}, inactive: ${ptInactive}.`,
      `Finance — revenue: ${toBRL(revenue)}, expenses: ${toBRL(expenses)}, net: ${toBRL(net)}.`
    ].join('\n');
  };

  const summaryIntents = [
    { pattern: /(daily|today)\s+summary|clinic\s+summary|^summary$/i, reply: () => getClinicSummary() },
    { pattern: /resumo\s+(diário|do\s+dia)|^resumo$/i, reply: () => getClinicSummary() }
  ];

  const normalizePtSection = (secPt) => {
    const s = secPt.toLowerCase();
    if (/pacientes?/.test(s)) return 'patients';
    if (/agendamentos?/.test(s)) return 'appointments';
    if (/farm[aá]cia/.test(s)) return 'pharmacy';
    if (/financeir[oa]/.test(s)) return 'finance';
    if (/relat[óo]rios?/.test(s)) return 'reports';
    if (/dashboard|in[íi]cio|home/.test(s)) return 'dashboard';
    return 'dashboard';
  };

  const sectionRoute = (section) => {
    switch (section) {
      case 'patients': return '/pacientes';
      case 'appointments': return '/agendamentos';
      case 'pharmacy': return '/farmacia';
      case 'finance': return '/financeiro';
      case 'reports': return '/relatorios';
      case 'dashboard': default: return '/';
    }
  };

  const preferenceIntents = [
    {
      pattern: /set\s+default\s+section\s+(patients|appointments|pharmacy|finance|reports|dashboard)/i,
      reply: (m) => {
        const sec = m.match(/set\s+default\s+section\s+(patients|appointments|pharmacy|finance|reports|dashboard)/i)?.[1]?.toLowerCase();
        const next = { ...preferences, defaultSection: sec };
        setPreferences(next);
        savePreferences(next);
        return `Default section set to ${sec}.`;
      }
    },
    {
      pattern: /definir\s+se[cç][aã]o\s+padr[aã]o\s+([a-zA-Zçáéíóúãõâêô ]+)/i,
      reply: (m) => {
        const secPt = m.match(/definir\s+se[cç][aã]o\s+padr[aã]o\s+([a-zA-Zçáéíóúãõâêô ]+)/i)?.[1]?.trim();
        const sec = normalizePtSection(secPt);
        const next = { ...preferences, defaultSection: sec };
        setPreferences(next);
        savePreferences(next);
        return `Seção padrão definida para ${sec}.`;
      }
    },
    {
      pattern: /set\s+favorite\s+specialty\s+(.+)/i,
      reply: (m) => {
        const spec = m.match(/set\s+favorite\s+specialty\s+(.+)/i)?.[1]?.trim();
        const next = { ...preferences, favoriteSpecialty: spec };
        setPreferences(next);
        savePreferences(next);
        return `Favorite specialty set to ${spec}.`;
      }
    },
    {
      pattern: /definir\s+especialidade\s+favorita\s+(.+)/i,
      reply: (m) => {
        const spec = m.match(/definir\s+especialidade\s+favorita\s+(.+)/i)?.[1]?.trim();
        const next = { ...preferences, favoriteSpecialty: spec };
        setPreferences(next);
        savePreferences(next);
        return `Especialidade favorita definida para ${spec}.`;
      }
    },
    {
      pattern: /(show|my)\s+preferences/i,
      reply: () => {
        const d = preferences.defaultSection || 'not set';
        const f = preferences.favoriteSpecialty || 'not set';
        return `Your preferences — default section: ${d}; favorite specialty: ${f}.`;
      }
    },
    {
      pattern: /mostrar\s+prefer[eê]ncias/i,
      reply: () => {
        const d = preferences.defaultSection || 'não definida';
        const f = preferences.favoriteSpecialty || 'não definida';
        return `Suas preferências — seção padrão: ${d}; especialidade favorita: ${f}.`;
      }
    },
    {
      pattern: /(clear|reset)\s+(memory|chat)/i,
      reply: () => {
        localStorage.removeItem(historyKey);
        const name = (user?.nome || '').split(' ')[0] || '';
        const greet = [
          `Hello${name ? ' ' + name : ''}! I am EVA, your clinic assistant.`,
          'How can I help you today?',
          'Tip: say "help" to see available commands.'
        ];
        const initial = greet.map((g) => ({ role: 'eva', text: g }));
        setMessages(initial);
        saveMemory(initial);
        return 'Chat memory cleared.';
      }
    },
    {
      pattern: /(limpar|resetar)\s+(mem[óo]ria|chat)/i,
      reply: () => {
        localStorage.removeItem(historyKey);
        const name = (user?.nome || '').split(' ')[0] || '';
        const greet = [
          `Olá${name ? ' ' + name : ''}! Eu sou a EVA, sua assistente.`,
          'Como posso ajudar hoje?',
          'Dica: diga "ajuda" para ver os comandos.'
        ];
        const initial = greet.map((g) => ({ role: 'eva', text: g }));
        setMessages(initial);
        saveMemory(initial);
        return 'Memória do chat limpa.';
      }
    },
    {
      pattern: /open\s+default\s+section/i,
      reply: () => {
        if (!preferences.defaultSection) return 'No default section set. Try: set default section patients';
        const route = sectionRoute(preferences.defaultSection);
        navigate(route);
        return `Opening your default section: ${preferences.defaultSection}.`;
      }
    }
  ];

  const reminderIntents = [
    {
      pattern: /add\s+reminder\s+(.+)/i,
      reply: (m) => {
        const text = m.match(/add\s+reminder\s+(.+)/i)?.[1]?.trim();
        if (!text) return 'Please provide the reminder text.';
        const item = { id: Date.now(), text };
        const list = [...reminders, item];
        setReminders(list);
        saveReminders(list);
        return `Reminder added: ${text}`;
      }
    },
    {
      pattern: /show\s+reminders/i,
      reply: () => {
        if (!reminders.length) return 'You have no reminders.';
        return 'Your reminders:\n' + reminders.map((r, i) => `${i+1}. ${r.text}`).join('\n');
      }
    },
    {
      pattern: /clear\s+reminders/i,
      reply: () => {
        setReminders([]);
        saveReminders([]);
        return 'All reminders cleared.';
      }
    },
    {
      pattern: /remove\s+reminder\s+(\d+)/i,
      reply: (m) => {
        const idx = parseInt(m.match(/remove\s+reminder\s+(\d+)/i)?.[1], 10) - 1;
        if (isNaN(idx) || idx < 0 || idx >= reminders.length) return 'Invalid reminder number.';
        const removed = reminders[idx]?.text;
        const list = reminders.filter((_, i) => i !== idx);
        setReminders(list);
        saveReminders(list);
        return `Removed reminder: ${removed}`;
      }
    },
    // Portuguese
    {
      pattern: /adicionar\s+lembrete\s+(.+)/i,
      reply: (m) => {
        const text = m.match(/adicionar\s+lembrete\s+(.+)/i)?.[1]?.trim();
        if (!text) return 'Por favor, informe o texto do lembrete.';
        const item = { id: Date.now(), text };
        const list = [...reminders, item];
        setReminders(list);
        saveReminders(list);
        return `Lembrete adicionado: ${text}`;
      }
    },
    {
      pattern: /mostrar\s+lembretes/i,
      reply: () => {
        if (!reminders.length) return 'Você não tem lembretes.';
        return 'Seus lembretes:\n' + reminders.map((r, i) => `${i+1}. ${r.text}`).join('\n');
      }
    },
    {
      pattern: /limpar\s+lembretes/i,
      reply: () => {
        setReminders([]);
        saveReminders([]);
        return 'Todos os lembretes foram limpos.';
      }
    },
    {
      pattern: /remover\s+lembrete\s+(\d+)/i,
      reply: (m) => {
        const idx = parseInt(m.match(/remover\s+lembrete\s+(\d+)/i)?.[1], 10) - 1;
        if (isNaN(idx) || idx < 0 || idx >= reminders.length) return 'Número de lembrete inválido.';
        const removed = reminders[idx]?.text;
        const list = reminders.filter((_, i) => i !== idx);
        setReminders(list);
        saveReminders(list);
        return `Lembrete removido: ${removed}`;
      }
    },
  ];

  const getAppointmentStats = () => {
    const appts = data.appointments || [];
    return {
      total: appts.length,
      confirmed: appts.filter(a => a.status === 'confirmado').length,
      pending: appts.filter(a => a.status === 'pendente').length,
      cancelled: appts.filter(a => a.status === 'cancelado').length,
    };
  };

  const getPatientStats = () => {
    const pts = data.patients || [];
    return {
      total: pts.length,
      active: pts.filter(p => p.status === 'ativo').length,
      inactive: pts.filter(p => p.status === 'inativo').length,
    };
  };

  const followUps = [
    // Appointments follow-ups
    {
      pattern: /\b(and\s+)?(confirmed)\b/i,
      when: () => context.topic === 'appointments',
      reply: () => {
        const s = getAppointmentStats();
        return `Confirmed appointments: ${s.confirmed} of ${s.total}.`;
      }
    },
    {
      pattern: /\b(and\s+)?(pending)\b/i,
      when: () => context.topic === 'appointments',
      reply: () => {
        const s = getAppointmentStats();
        return `Pending appointments: ${s.pending} of ${s.total}.`;
      }
    },
    {
      pattern: /\b(and\s+)?(cancelled|canceled)\b/i,
      when: () => context.topic === 'appointments',
      reply: () => {
        const s = getAppointmentStats();
        return `Cancelled appointments: ${s.cancelled} of ${s.total}.`;
      }
    },
    // Patients follow-ups
    {
      pattern: /\b(and\s+)?(active)\b/i,
      when: () => context.topic === 'patients',
      reply: () => {
        const s = getPatientStats();
        return `Active patients: ${s.active} of ${s.total}.`;
      }
    },
    {
      pattern: /\b(and\s+)?(inactive)\b/i,
      when: () => context.topic === 'patients',
      reply: () => {
        const s = getPatientStats();
        return `Inactive patients: ${s.inactive} of ${s.total}.`;
      }
    },
    // Navigation follow-up
    {
      pattern: /\bopen\s+(it|them|that)\b/i,
      when: () => !!context.lastRoute,
      reply: () => {
        navigate(context.lastRoute);
        return 'Opening last section.';
      }
    }
  ];

  const handleSend = async (e) => {
    
    e?.preventDefault();
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setSending(true);
    // persist user message
    setTimeout(() => {
      saveMemory([...messages, { role: 'user', text: userText }]);
    }, 0);

    const helpText = language === 'pt'
      ? [
          'Aqui estão alguns comandos que você pode usar:',
          '• abrir pacientes | agendamentos | farmácia | financeiro | relatórios | painel',
          '• quantos pacientes | agendamentos | funcionários',
          '• receita total | despesas totais',
          '• resumo | resumo diário',
          '• adicionar lembrete <texto> | mostrar lembretes | remover lembrete <n> | limpar lembretes',
          '• buscar paciente <nome>',
          '• bom dia | oi | como vai (conversa)'
        ].join('\n')
      : [
          'Here are some commands you can use:',
          '• open patients | appointments | pharmacy | finance | reports | dashboard',
          '• how many patients | appointments | staff',
          '• total revenue | total expenses',
          '• summary | daily summary',
          '• add reminder <text> | show reminders | remove reminder <n> | clear reminders',
          '• find patient <name>',
          '• good morning | hello | how are you (small talk)'
        ].join('\n');

    const normalized = userText.toLowerCase();
    for (const key of Object.keys(smallTalk)) {
      if (normalized.includes(key)) {
        setMessages(prev => [...prev, { role: 'eva', text: smallTalk[key] }]);
        setSending(false);
        return;
      }
    }

    // Conversational mood intents (language-aware)
    for (const m of moodIntents) {
      if (m.pattern.test(userText)) {
        const reply = typeof m.reply === 'function' ? m.reply(userText) : m.reply;
        setMessages(prev => [...prev, { role: 'eva', text: reply }]);
        saveMemory([...messages, { role: 'user', text: userText }, { role: 'eva', text: reply }]);
        setSending(false);
        return;
      }
    }

    if (/\b(help|commands|ajuda|comandos)\b/i.test(userText)) {
      setMessages(prev => [...prev, { role: 'eva', text: helpText }]);
      saveMemory([...messages, { role: 'user', text: userText }, { role: 'eva', text: helpText }]);
      setSending(false);
      return;
    }

    // Reminders
    for (const r of reminderIntents) {
      if (r.pattern.test(userText)) {
        const reply = typeof r.reply === 'function' ? r.reply(userText) : r.reply;
        setMessages(prev => [...prev, { role: 'eva', text: reply }]);
        saveMemory([...messages, { role: 'user', text: userText }, { role: 'eva', text: reply }]);
        setSending(false);
        return;
      }
    }

    // Summary
    for (const s of summaryIntents) {
      if (s.pattern.test(userText)) {
        const reply = typeof s.reply === 'function' ? s.reply(userText) : s.reply;
        setMessages(prev => [...prev, { role: 'eva', text: reply }]);
        saveMemory([...messages, { role: 'user', text: userText }, { role: 'eva', text: reply }]);
        setSending(false);
        return;
      }
    }

    // Preferences and memory management
    for (const p of preferenceIntents) {
      if (p.pattern.test(userText)) {
        const reply = typeof p.reply === 'function' ? p.reply(userText) : p.reply;
        setMessages(prev => [...prev, { role: 'eva', text: reply }]);
        saveMemory([...messages, { role: 'user', text: userText }, { role: 'eva', text: reply }]);
        setSending(false);
        return;
      }
    }

    for (const intent of routerIntents) {
      if (intent.pattern.test(userText)) {
        intent.action();
        setMessages(prev => [...prev, { role: 'eva', text: intent.reply }]);
        saveMemory([...messages, { role: 'user', text: userText }, { role: 'eva', text: intent.reply }]);
        setContext({ topic: null, lastRoute: intent.action.toString().includes('/pacientes') ? '/pacientes'
          : intent.action.toString().includes('/agendamentos') ? '/agendamentos'
          : intent.action.toString().includes('/farmacia') ? '/farmacia'
          : intent.action.toString().includes('/financeiro') ? '/financeiro'
          : intent.action.toString().includes('/relatorios') ? '/relatorios'
          : '/'
        });
        setSending(false);
        return;
      }
    }

    // Follow-up intents based on context
    for (const f of followUps) {
      if (f.when() && f.pattern.test(userText)) {
        const reply = f.reply(userText);
        setMessages(prev => [...prev, { role: 'eva', text: reply }]);
        saveMemory([...messages, { role: 'user', text: userText }, { role: 'eva', text: reply }]);
        setSending(false);
        return;
      }
    }

    for (const intent of infoIntents) {
      if (intent.pattern.test(userText)) {
        const reply = typeof intent.reply === 'function' ? intent.reply(userText) : intent.reply;
        setMessages(prev => [...prev, { role: 'eva', text: reply }]);
        // Update conversational context
        if (/how\s+many\s+appointments/i.test(userText)) setContext({ topic: 'appointments', lastRoute: '/agendamentos' });
        else if (/how\s+many\s+patients/i.test(userText)) setContext({ topic: 'patients', lastRoute: '/pacientes' });
        else if (/total\s+(revenue|expenses)/i.test(userText)) setContext({ topic: 'finance', lastRoute: '/financeiro' });
        else if (/find\s+patient\s+/i.test(userText)) setContext({ topic: 'patients', lastRoute: '/pacientes' });
        saveMemory([...messages, { role: 'user', text: userText }, { role: 'eva', text: reply }]);
        setSending(false);
        return;
      }
    }

    const fallback = language === 'pt'
      ? 'Não entendi. Posso ajudar com navegação e estatísticas. Tente: "abrir pacientes" ou "quantos agendamentos". Diga "ajuda" para ver mais comandos.'
      : 'I did not understand. I can help with navigation and stats. Try: "open patients" or "how many appointments". Say "help" to see more commands.';
    setMessages(prev => [...prev, { role: 'eva', text: fallback }]);
    saveMemory([...messages, { role: 'user', text: userText }, { role: 'eva', text: fallback }]);
    setSending(false);
  };

  return (
    
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          EVA <Badge bg="secondary" className="ms-2">{language === 'pt' ? 'Assistente' : 'Assistant'}</Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="glass border rounded p-3" style={{ height: '360px', overflowY: 'auto' }}>
          {messages.map((m, idx) => (
            <div key={idx} className={`d-flex ${m.role==='user'?'justify-content-end':'justify-content-start'} mb-2`}>
              <div className={`px-3 py-2 rounded-3 ${m.role==='user'?'bg-dark text-white':'bg-light text-dark'}`} style={{ maxWidth: '80%' }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <Form onSubmit={handleSend} className="mt-3">
          <InputGroup>
            <Form.Control 
              placeholder={language === 'pt' ? 'Digite sua mensagem... (ex.: abrir pacientes, quantos agendamentos, bom dia)' : 'Type your message... (e.g., open patients, how many appointments, good morning)'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <Button type="submit" variant="dark" className="glass-btn" disabled={sending}>{language === 'pt' ? 'Enviar' : 'Send'}</Button>
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EVAChat;