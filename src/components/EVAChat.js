import React, { useEffect, useMemo, useState, useContext } from 'react';
import { Modal, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';

const initialGreetings = [
  'Olá! Eu sou a EVA, assistente da clínica.',
  'Posso ajudar com informações e navegação pelo sistema.',
  'Você pode perguntar: "quantos pacientes?", "abrir agendamentos", ou só dizer "bom dia".'
];

const EVAChat = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const data = useContext(DataContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (show) {
      setMessages(initialGreetings.map((g) => ({ role: 'eva', text: g })));
      setInput('');
    }
  }, [show]);

  const smallTalk = useMemo(() => ({
    'bom dia': 'Bom dia! Espero que seu dia seja produtivo. Como posso ajudar?',
    'boa tarde': 'Boa tarde! Em que posso ser útil?',
    'boa noite': 'Boa noite! Precisa de algo no sistema?',
    'oi': 'Oi! Tudo bem? Posso ajudar com pacientes, agendamentos e mais.',
    'olá': 'Olá! Conte-me o que você precisa.',
    'tudo bem': 'Tudo ótimo por aqui! E por aí? Posso ajudar com algo?'
  }), []);

  const routerIntents = [
    { pattern: /abrir\s+(pacientes?)/i, action: () => navigate('/pacientes'), reply: 'Abrindo Pacientes.' },
    { pattern: /abrir\s+(agendamentos?)/i, action: () => navigate('/agendamentos'), reply: 'Abrindo Agendamentos.' },
    { pattern: /abrir\s+(farm[aá]cia)/i, action: () => navigate('/farmacia'), reply: 'Abrindo Farmácia.' },
    { pattern: /abrir\s+(financeiro)/i, action: () => navigate('/financeiro'), reply: 'Abrindo Financeiro.' },
    { pattern: /abrir\s+(relat[óo]rios?)/i, action: () => navigate('/relatorios'), reply: 'Abrindo Relatórios.' },
    { pattern: /abrir\s+(dashboard)/i, action: () => navigate('/'), reply: 'Abrindo Dashboard.' },
  ];

  const infoIntents = [
    { pattern: /quantos\s+pacientes/i, reply: () => `Temos ${data.pacientes?.length || 0} pacientes cadastrados.` },
    { pattern: /quantos\s+agendamentos/i, reply: () => `Há ${data.agendamentos?.length || 0} agendamentos.` },
    { pattern: /quantos\s+funcion[aá]rios/i, reply: () => `São ${data.funcionarios?.length || 0} funcionários.` },
    { pattern: /total\s+de\s+receitas/i, reply: () => {
        const total = (data.transacoes||[]).filter(t=>t.tipo==='receita').reduce((acc,t)=>acc+t.valor,0);
        return `Total de receitas: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      }
    },
    { pattern: /total\s+de\s+despesas/i, reply: () => {
        const total = (data.transacoes||[]).filter(t=>t.tipo==='despesa').reduce((acc,t)=>acc+t.valor,0);
        return `Total de despesas: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
      }
    },
    { pattern: /buscar\s+paciente\s+(.+)/i, reply: (m) => {
        const nome = m.match(/buscar\s+paciente\s+(.+)/i)?.[1]?.trim();
        if (!nome) return 'Por favor, informe o nome após "buscar paciente".';
        const encontrados = (data.pacientes||[]).filter(p => (p.nome||'').toLowerCase().includes(nome.toLowerCase()));
        if (!encontrados.length) return `Não encontrei pacientes com "${nome}".`;
        return `Encontrei ${encontrados.length}: ${encontrados.slice(0,5).map(p=>p.nome).join(', ')}${encontrados.length>5?'...':''}`;
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

    const helpText = [
      'Aqui estão alguns comandos que você pode usar:',
      '• abrir pacientes | agendamentos | farmácia | financeiro | relatórios | dashboard',
      '• quantos pacientes | agendamentos | funcionários',
      '• total de receitas | despesas',
      '• buscar paciente <nome>',
      '• bom dia | oi | tudo bem (educação/small talk)'
    ].join('\n');

    const normalized = userText.toLowerCase();
    for (const key of Object.keys(smallTalk)) {
      if (normalized.includes(key)) {
        setMessages(prev => [...prev, { role: 'eva', text: smallTalk[key] }]);
        setSending(false);
        return;
      }
    }

    if (/\b(ajuda|comandos)\b/i.test(userText)) {
      setMessages(prev => [...prev, { role: 'eva', text: helpText }]);
      setSending(false);
      return;
    }

    for (const intent of routerIntents) {
      if (intent.pattern.test(userText)) {
        intent.action();
        setMessages(prev => [...prev, { role: 'eva', text: intent.reply }]);
        setSending(false);
        return;
      }
    }

    for (const intent of infoIntents) {
      if (intent.pattern.test(userText)) {
        const reply = typeof intent.reply === 'function' ? intent.reply(userText) : intent.reply;
        setMessages(prev => [...prev, { role: 'eva', text: reply }]);
        setSending(false);
        return;
      }
    }

    setMessages(prev => [...prev, { role: 'eva', text: 'Ainda não entendi. Posso ajudar com navegação e estatísticas. Experimente: "abrir pacientes" ou "quantos agendamentos". Diga "ajuda" para ver mais comandos.' }]);
    setSending(false);
  };

  return (
    
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          EVA <Badge bg="secondary" className="ms-2">Assistente</Badge>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="border rounded p-3" style={{ height: '360px', overflowY: 'auto', background: '#f8f9fa' }}>
          {messages.map((m, idx) => (
            <div key={idx} className={`d-flex ${m.role==='user'?'justify-content-end':'justify-content-start'} mb-2`}>
              <div className={`px-3 py-2 rounded-3 ${m.role==='user'?'bg-primary text-white':'bg-light text-dark'}`} style={{ maxWidth: '80%' }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <Form onSubmit={handleSend} className="mt-3">
          <InputGroup>
            <Form.Control 
              placeholder="Digite sua mensagem... (ex.: abrir pacientes, quantos agendamentos, bom dia)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
            />
            <Button type="submit" variant="primary" disabled={sending}>Enviar</Button>
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EVAChat;