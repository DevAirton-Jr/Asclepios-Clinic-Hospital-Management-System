import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();
export { DataContext };
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  
  const [pacientes, setPacientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    setTimeout(() => {
      
      setPacientes([
        { id: 1, nome: 'João Silva', idade: 45, genero: 'Masculino', telefone: '(11) 98765-4321', convenio: 'Unimed', ultimaConsulta: '10/06/2023', status: 'ativo' },
        { id: 2, nome: 'Maria Oliveira', idade: 38, genero: 'Feminino', telefone: '(11) 91234-5678', convenio: 'Amil', ultimaConsulta: '15/06/2023', status: 'ativo' },
        { id: 3, nome: 'Pedro Santos', idade: 62, genero: 'Masculino', telefone: '(11) 92345-6789', convenio: 'SulAmérica', ultimaConsulta: '05/06/2023', status: 'ativo' },
        { id: 4, nome: 'Ana Costa', idade: 29, genero: 'Feminino', telefone: '(11) 93456-7890', convenio: 'Bradesco', ultimaConsulta: '20/06/2023', status: 'inativo' },
        { id: 5, nome: 'Carlos Ferreira', idade: 55, genero: 'Masculino', telefone: '(11) 94567-8901', convenio: 'Unimed', ultimaConsulta: '12/06/2023', status: 'ativo' },
        { id: 6, nome: 'Juliana Lima', idade: 41, genero: 'Feminino', telefone: '(11) 95678-9012', convenio: 'Amil', ultimaConsulta: '18/06/2023', status: 'ativo' },
        { id: 7, nome: 'Roberto Alves', idade: 70, genero: 'Masculino', telefone: '(11) 96789-0123', convenio: 'SulAmérica', ultimaConsulta: '08/06/2023', status: 'inativo' },
        { id: 8, nome: 'Fernanda Gomes', idade: 33, genero: 'Feminino', telefone: '(11) 97890-1234', convenio: 'Bradesco', ultimaConsulta: '22/06/2023', status: 'ativo' }
      ]);

      setAgendamentos([
        { id: 1, paciente: 'João Silva', medico: 'Dr. Ricardo Souza', especialidade: 'Clínica Geral', data: '05/07/2023', hora: '09:00', status: 'confirmado' },
        { id: 2, paciente: 'Maria Oliveira', medico: 'Dra. Camila Santos', especialidade: 'Cardiologia', data: '06/07/2023', hora: '14:30', status: 'pendente' },
        { id: 3, paciente: 'Pedro Santos', medico: 'Dr. André Lima', especialidade: 'Ortopedia', data: '07/07/2023', hora: '10:15', status: 'confirmado' },
        { id: 4, paciente: 'Ana Costa', medico: 'Dra. Juliana Mendes', especialidade: 'Dermatologia', data: '07/07/2023', hora: '16:00', status: 'cancelado' },
        { id: 5, paciente: 'Carlos Ferreira', medico: 'Dr. Ricardo Souza', especialidade: 'Clínica Geral', data: '10/07/2023', hora: '11:30', status: 'pendente' },
        { id: 6, paciente: 'Juliana Lima', medico: 'Dra. Camila Santos', especialidade: 'Cardiologia', data: '11/07/2023', hora: '15:45', status: 'confirmado' },
        { id: 7, paciente: 'Roberto Alves', medico: 'Dr. André Lima', especialidade: 'Ortopedia', data: '12/07/2023', hora: '09:30', status: 'pendente' },
        { id: 8, paciente: 'Fernanda Gomes', medico: 'Dra. Juliana Mendes', especialidade: 'Dermatologia', data: '13/07/2023', hora: '13:00', status: 'confirmado' },
        { id: 9, paciente: 'João Silva', medico: 'Dr. Ricardo Souza', especialidade: 'Clínica Geral', data: '14/07/2023', hora: '10:00', status: 'pendente' },
        { id: 10, paciente: 'Maria Oliveira', medico: 'Dra. Camila Santos', especialidade: 'Cardiologia', data: '17/07/2023', hora: '14:00', status: 'confirmado' }
      ]);

      setMedicamentos([
        { id: 1, nome: 'Dipirona 500mg', categoria: 'Analgésico', estoque: 120, fornecedor: 'Medley', validade: '12/2024', status: 'disponível' },
        { id: 2, nome: 'Amoxicilina 500mg', categoria: 'Antibiótico', estoque: 85, fornecedor: 'EMS', validade: '10/2024', status: 'disponível' },
        { id: 3, nome: 'Losartana 50mg', categoria: 'Anti-hipertensivo', estoque: 60, fornecedor: 'Medley', validade: '08/2024', status: 'baixo' },
        { id: 4, nome: 'Omeprazol 20mg', categoria: 'Protetor Gástrico', estoque: 95, fornecedor: 'EMS', validade: '11/2024', status: 'disponível' },
        { id: 5, nome: 'Ibuprofeno 600mg', categoria: 'Anti-inflamatório', estoque: 15, fornecedor: 'Neo Química', validade: '09/2024', status: 'crítico' },
        { id: 6, nome: 'Paracetamol 750mg', categoria: 'Analgésico', estoque: 110, fornecedor: 'Neo Química', validade: '12/2024', status: 'disponível' },
        { id: 7, nome: 'Azitromicina 500mg', categoria: 'Antibiótico', estoque: 25, fornecedor: 'Medley', validade: '07/2024', status: 'baixo' },
        { id: 8, nome: 'Atenolol 50mg', categoria: 'Anti-hipertensivo', estoque: 5, fornecedor: 'EMS', validade: '06/2024', status: 'crítico' }
      ]);

      setFuncionarios([
        { id: 1, nome: 'Ana Silva', cargo: 'Médica', setor: 'Clínica Geral', dataAdmissao: '10/01/2020', status: 'ativo' },
        { id: 2, nome: 'Carlos Oliveira', cargo: 'Enfermeiro', setor: 'Emergência', dataAdmissao: '15/03/2019', status: 'ativo' },
        { id: 3, nome: 'Mariana Santos', cargo: 'Técnica de Enfermagem', setor: 'Pediatria', dataAdmissao: '22/07/2021', status: 'ativo' },
        { id: 4, nome: 'Roberto Almeida', cargo: 'Médico', setor: 'Cardiologia', dataAdmissao: '05/11/2018', status: 'férias' },
        { id: 5, nome: 'Juliana Costa', cargo: 'Recepcionista', setor: 'Atendimento', dataAdmissao: '18/04/2022', status: 'ativo' },
        { id: 6, nome: 'Fernando Gomes', cargo: 'Farmacêutico', setor: 'Farmácia', dataAdmissao: '30/09/2020', status: 'licença' },
        { id: 7, nome: 'Patrícia Lima', cargo: 'Psicóloga', setor: 'Saúde Mental', dataAdmissao: '12/02/2021', status: 'ativo' },
        { id: 8, nome: 'Ricardo Souza', cargo: 'Fisioterapeuta', setor: 'Reabilitação', dataAdmissao: '25/06/2019', status: 'ativo' }
      ]);

      setTransacoes([
        { id: 1, data: '05/07/2023', tipo: 'receita', descricao: 'Consultas médicas', valor: 5200.00 },
        { id: 2, data: '07/07/2023', tipo: 'despesa', descricao: 'Pagamento de fornecedores', valor: 1850.00 },
        { id: 3, data: '10/07/2023', tipo: 'receita', descricao: 'Exames laboratoriais', valor: 3750.00 },
        { id: 4, data: '12/07/2023', tipo: 'despesa', descricao: 'Folha de pagamento', valor: 12500.00 },
        { id: 5, data: '15/07/2023', tipo: 'receita', descricao: 'Procedimentos cirúrgicos', valor: 8900.00 },
        { id: 6, data: '18/07/2023', tipo: 'despesa', descricao: 'Manutenção de equipamentos', valor: 2300.00 },
        { id: 7, data: '22/07/2023', tipo: 'receita', descricao: 'Internações', valor: 7500.00 },
        { id: 8, data: '25/07/2023', tipo: 'despesa', descricao: 'Compra de medicamentos', valor: 4200.00 }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const adicionarPaciente = (novoPaciente) => {
    const id = pacientes.length > 0 ? Math.max(...pacientes.map(p => p.id)) + 1 : 1;
    setPacientes([...pacientes, { ...novoPaciente, id, status: 'ativo' }]);
    return id;
  };

  const atualizarPaciente = (id, dadosAtualizados) => {
    setPacientes(pacientes.map(paciente => 
      paciente.id === id ? { ...paciente, ...dadosAtualizados } : paciente
    ));
  };

  const removerPaciente = (id) => {
    setPacientes(pacientes.filter(paciente => paciente.id !== id));
  };

  const adicionarAgendamento = (novoAgendamento) => {
    const id = agendamentos.length > 0 ? Math.max(...agendamentos.map(a => a.id)) + 1 : 1;
    setAgendamentos([...agendamentos, { ...novoAgendamento, id, status: 'pendente' }]);
    return id;
  };

  const atualizarAgendamento = (id, dadosAtualizados) => {
    setAgendamentos(agendamentos.map(agendamento => 
      agendamento.id === id ? { ...agendamento, ...dadosAtualizados } : agendamento
    ));
  };

  const removerAgendamento = (id) => {
    setAgendamentos(agendamentos.filter(agendamento => agendamento.id !== id));
  };

  const adicionarMedicamento = (novoMedicamento) => {
    const id = medicamentos.length > 0 ? Math.max(...medicamentos.map(m => m.id)) + 1 : 1;
    const status = novoMedicamento.estoque > 30 ? 'disponível' : novoMedicamento.estoque > 10 ? 'baixo' : 'crítico';
    setMedicamentos([...medicamentos, { ...novoMedicamento, id, status }]);
    return id;
  };

  const atualizarMedicamento = (id, dadosAtualizados) => {
    setMedicamentos(medicamentos.map(medicamento => {
      if (medicamento.id === id) {
        const atualizado = { ...medicamento, ...dadosAtualizados };
        
        if (atualizado.estoque !== undefined) {
          atualizado.status = atualizado.estoque > 30 ? 'disponível' : atualizado.estoque > 10 ? 'baixo' : 'crítico';
        }
        return atualizado;
      }
      return medicamento;
    }));
  };

  const removerMedicamento = (id) => {
    setMedicamentos(medicamentos.filter(medicamento => medicamento.id !== id));
  };

  const dispensarMedicamento = (id, quantidade) => {
    setMedicamentos(medicamentos.map(medicamento => {
      if (medicamento.id === id) {
        const novoEstoque = Math.max(0, medicamento.estoque - quantidade);
        const novoStatus = novoEstoque > 30 ? 'disponível' : novoEstoque > 10 ? 'baixo' : 'crítico';
        return { ...medicamento, estoque: novoEstoque, status: novoStatus };
      }
      return medicamento;
    }));
  };

  const adicionarFuncionario = (novoFuncionario) => {
    const id = funcionarios.length > 0 ? Math.max(...funcionarios.map(f => f.id)) + 1 : 1;
    setFuncionarios([...funcionarios, { ...novoFuncionario, id, status: 'ativo' }]);
    return id;
  };

  const atualizarFuncionario = (id, dadosAtualizados) => {
    setFuncionarios(funcionarios.map(funcionario => 
      funcionario.id === id ? { ...funcionario, ...dadosAtualizados } : funcionario
    ));
  };

  const removerFuncionario = (id) => {
    setFuncionarios(funcionarios.filter(funcionario => funcionario.id !== id));
  };

  const adicionarTransacao = (novaTransacao) => {
    const id = transacoes.length > 0 ? Math.max(...transacoes.map(t => t.id)) + 1 : 1;
    setTransacoes([...transacoes, { ...novaTransacao, id }]);
    return id;
  };

  const atualizarTransacao = (id, dadosAtualizados) => {
    setTransacoes(transacoes.map(transacao => 
      transacao.id === id ? { ...transacao, ...dadosAtualizados } : transacao
    ));
  };

  const removerTransacao = (id) => {
    setTransacoes(transacoes.filter(transacao => transacao.id !== id));
  };

  const obterEstatisticasPacientes = () => {
    return {
      total: pacientes.length,
      ativos: pacientes.filter(p => p.status === 'ativo').length,
      inativos: pacientes.filter(p => p.status === 'inativo').length,
      porConvenio: {
        unimed: pacientes.filter(p => p.convenio === 'Unimed').length,
        amil: pacientes.filter(p => p.convenio === 'Amil').length,
        sulamerica: pacientes.filter(p => p.convenio === 'SulAmérica').length,
        bradesco: pacientes.filter(p => p.convenio === 'Bradesco').length,
        outros: pacientes.filter(p => !['Unimed', 'Amil', 'SulAmérica', 'Bradesco'].includes(p.convenio)).length
      }
    };
  };

  const obterEstatisticasAgendamentos = () => {
    return {
      total: agendamentos.length,
      confirmados: agendamentos.filter(a => a.status === 'confirmado').length,
      pendentes: agendamentos.filter(a => a.status === 'pendente').length,
      cancelados: agendamentos.filter(a => a.status === 'cancelado').length,
      porEspecialidade: {
        clinicaGeral: agendamentos.filter(a => a.especialidade === 'Clínica Geral').length,
        cardiologia: agendamentos.filter(a => a.especialidade === 'Cardiologia').length,
        ortopedia: agendamentos.filter(a => a.especialidade === 'Ortopedia').length,
        dermatologia: agendamentos.filter(a => a.especialidade === 'Dermatologia').length,
        outros: agendamentos.filter(a => !['Clínica Geral', 'Cardiologia', 'Ortopedia', 'Dermatologia'].includes(a.especialidade)).length
      }
    };
  };

  const obterEstatisticasMedicamentos = () => {
    return {
      total: medicamentos.length,
      disponiveis: medicamentos.filter(m => m.status === 'disponível').length,
      baixoEstoque: medicamentos.filter(m => m.status === 'baixo').length,
      critico: medicamentos.filter(m => m.status === 'crítico').length,
      porCategoria: {
        analgesico: medicamentos.filter(m => m.categoria === 'Analgésico').length,
        antibiotico: medicamentos.filter(m => m.categoria === 'Antibiótico').length,
        antiHipertensivo: medicamentos.filter(m => m.categoria === 'Anti-hipertensivo').length,
        antiInflamatorio: medicamentos.filter(m => m.categoria === 'Anti-inflamatório').length,
        outros: medicamentos.filter(m => !['Analgésico', 'Antibiótico', 'Anti-hipertensivo', 'Anti-inflamatório'].includes(m.categoria)).length
      }
    };
  };

  const obterEstatisticasFuncionarios = () => {
    return {
      total: funcionarios.length,
      ativos: funcionarios.filter(f => f.status === 'ativo').length,
      ferias: funcionarios.filter(f => f.status === 'férias').length,
      licenca: funcionarios.filter(f => f.status === 'licença').length,
      porSetor: {
        clinicaGeral: funcionarios.filter(f => f.setor === 'Clínica Geral').length,
        emergencia: funcionarios.filter(f => f.setor === 'Emergência').length,
        pediatria: funcionarios.filter(f => f.setor === 'Pediatria').length,
        cardiologia: funcionarios.filter(f => f.setor === 'Cardiologia').length,
        atendimento: funcionarios.filter(f => f.setor === 'Atendimento').length,
        farmacia: funcionarios.filter(f => f.setor === 'Farmácia').length,
        saudeMental: funcionarios.filter(f => f.setor === 'Saúde Mental').length,
        reabilitacao: funcionarios.filter(f => f.setor === 'Reabilitação').length,
        outros: funcionarios.filter(f => !['Clínica Geral', 'Emergência', 'Pediatria', 'Cardiologia', 'Atendimento', 'Farmácia', 'Saúde Mental', 'Reabilitação'].includes(f.setor)).length
      }
    };
  };

  const obterEstatisticasFinanceiras = () => {
    const receitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
    const despesas = transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);
    
    return {
      totalReceitas: receitas,
      totalDespesas: despesas,
      saldo: receitas - despesas,
      percentualLucro: receitas > 0 ? ((receitas - despesas) / receitas * 100).toFixed(2) : 0
    };
  };

  const value = {
    
    pacientes,
    agendamentos,
    medicamentos,
    funcionarios,
    transacoes,
    loading,

    adicionarPaciente,
    atualizarPaciente,
    removerPaciente,

    adicionarAgendamento,
    atualizarAgendamento,
    removerAgendamento,

    adicionarMedicamento,
    atualizarMedicamento,
    removerMedicamento,
    dispensarMedicamento,

    adicionarFuncionario,
    atualizarFuncionario,
    removerFuncionario,

    adicionarTransacao,
    atualizarTransacao,
    removerTransacao,

    obterEstatisticasPacientes,
    obterEstatisticasAgendamentos,
    obterEstatisticasMedicamentos,
    obterEstatisticasFuncionarios,
    obterEstatisticasFinanceiras
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};