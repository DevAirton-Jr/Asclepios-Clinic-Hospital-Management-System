import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Spinner } from 'react-bootstrap';
import { FaFileDownload, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import { DataContext } from '../context/DataContext';

const Relatorios = () => {
  const { 
    loading, 
    pacientes, 
    agendamentos, 
    medicamentos, 
    funcionarios, 
    transacoes 
  } = useContext(DataContext);
  
  const [tipoRelatorio, setTipoRelatorio] = useState('atendimentos');
  const [periodoRelatorio, setPeriodoRelatorio] = useState('mensal');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [relatorioGerado, setRelatorioGerado] = useState(false);

  // Inicializa as datas com o mês atual
  useEffect(() => {
    const hoje = new Date();
    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
    
    setDataInicio(primeiroDia.toISOString().split('T')[0]);
    setDataFim(ultimoDia.toISOString().split('T')[0]);
  }, []);

  // Gera dados de relatório com base nos dados reais
  const gerarDadosRelatorio = () => {
    setRelatorioGerado(true);
  };

  // Calcula dados para relatórios com base nos dados reais
  const dadosRelatorio = {
    atendimentos: [
      { 
        id: 1, 
        nome: 'Consultas Clínica Geral', 
        quantidade: agendamentos.filter(a => a.especialidade === 'Clínica Geral').length,
        get percentual() {
          return Math.round((this.quantidade / (agendamentos.length || 1)) * 100);
        }
      },
      { 
        id: 2, 
        nome: 'Consultas Pediatria', 
        quantidade: agendamentos.filter(a => a.especialidade === 'Pediatria').length,
        get percentual() {
          return Math.round((this.quantidade / (agendamentos.length || 1)) * 100);
        }
      },
      { 
        id: 3, 
        nome: 'Consultas Cardiologia', 
        quantidade: agendamentos.filter(a => a.especialidade === 'Cardiologia').length,
        get percentual() {
          return Math.round((this.quantidade / (agendamentos.length || 1)) * 100);
        }
      },
      { 
        id: 4, 
        nome: 'Consultas Ortopedia', 
        quantidade: agendamentos.filter(a => a.especialidade === 'Ortopedia').length,
        get percentual() {
          return Math.round((this.quantidade / (agendamentos.length || 1)) * 100);
        }
      },
      { 
        id: 5, 
        nome: 'Outros Atendimentos', 
        quantidade: agendamentos.filter(a => !['Clínica Geral', 'Pediatria', 'Cardiologia', 'Ortopedia'].includes(a.especialidade)).length,
        get percentual() {
          return Math.round((this.quantidade / (agendamentos.length || 1)) * 100);
        }
      }
    ],
    financeiro: [
      { 
        id: 1, 
        nome: 'Receitas Consultas', 
        valor: transacoes.filter(t => t.tipo === 'receita' && t.descricao.includes('Consulta')).reduce((acc, t) => acc + t.valor, 0),
        get percentual() {
          const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
          return Math.round((this.valor / (totalReceitas || 1)) * 100);
        }
      },
      { 
        id: 2, 
        nome: 'Receitas Exames', 
        valor: transacoes.filter(t => t.tipo === 'receita' && t.descricao.includes('Exame')).reduce((acc, t) => acc + t.valor, 0),
        get percentual() {
          const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
          return Math.round((this.valor / (totalReceitas || 1)) * 100);
        }
      },
      { 
        id: 3, 
        nome: 'Receitas Procedimentos', 
        valor: transacoes.filter(t => t.tipo === 'receita' && t.descricao.includes('Procedimento')).reduce((acc, t) => acc + t.valor, 0),
        get percentual() {
          const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
          return Math.round((this.valor / (totalReceitas || 1)) * 100);
        }
      },
      { 
        id: 4, 
        nome: 'Outras Receitas', 
        valor: transacoes.filter(t => t.tipo === 'receita' && !['Consulta', 'Exame', 'Procedimento'].some(term => t.descricao.includes(term))).reduce((acc, t) => acc + t.valor, 0),
        get percentual() {
          const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
          return Math.round((this.valor / (totalReceitas || 1)) * 100);
        }
      }
    ],
    farmacia: [
      { 
        id: 1, 
        nome: 'Antibióticos', 
        quantidade: medicamentos.filter(m => m.categoria === 'Antibiótico').reduce((acc, m) => acc + (m.dispensacoes || 0), 0),
        get percentual() {
          const totalDispensacoes = medicamentos.reduce((acc, m) => acc + (m.dispensacoes || 0), 0);
          return Math.round((this.quantidade / (totalDispensacoes || 1)) * 100);
        }
      },
      { 
        id: 2, 
        nome: 'Anti-inflamatórios', 
        quantidade: medicamentos.filter(m => m.categoria === 'Anti-inflamatório').reduce((acc, m) => acc + (m.dispensacoes || 0), 0),
        get percentual() {
          const totalDispensacoes = medicamentos.reduce((acc, m) => acc + (m.dispensacoes || 0), 0);
          return Math.round((this.quantidade / (totalDispensacoes || 1)) * 100);
        }
      },
      { 
        id: 3, 
        nome: 'Analgésicos', 
        quantidade: medicamentos.filter(m => m.categoria === 'Analgésico').reduce((acc, m) => acc + (m.dispensacoes || 0), 0),
        get percentual() {
          const totalDispensacoes = medicamentos.reduce((acc, m) => acc + (m.dispensacoes || 0), 0);
          return Math.round((this.quantidade / (totalDispensacoes || 1)) * 100);
        }
      },
      { 
        id: 4, 
        nome: 'Outros Medicamentos', 
        quantidade: medicamentos.filter(m => !['Antibiótico', 'Anti-inflamatório', 'Analgésico'].includes(m.categoria)).reduce((acc, m) => acc + (m.dispensacoes || 0), 0),
        get percentual() {
          const totalDispensacoes = medicamentos.reduce((acc, m) => acc + (m.dispensacoes || 0), 0);
          return Math.round((this.quantidade / (totalDispensacoes || 1)) * 100);
        }
      }
    ]
  };

  // Renderização do gráfico simplificado
  const renderGrafico = () => {
    const dados = dadosRelatorio[tipoRelatorio];
    
    return (
      <div className="d-flex justify-content-around align-items-end mt-4 mb-3" style={{ height: '200px' }}>
        {dados.map(item => (
          <div key={item.id} className="text-center" style={{ width: `${100 / dados.length}%`, minWidth: '100px' }}>
            <div 
              className="mx-auto bg-primary" 
              style={{ 
                width: '40px', 
                height: `${item.percentual * 1.8}px`,
                borderRadius: '4px 4px 0 0'
              }}
            ></div>
            <div className="mt-2 small text-center" style={{ fontSize: '0.8rem', maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word', margin: '0 auto' }}>{item.nome}</div>
            <div className="fw-bold">{item.percentual}%</div>
          </div>
        ))}
      </div>
    );
  };

  // Renderização da tabela de dados
  const renderTabela = () => {
    const dados = dadosRelatorio[tipoRelatorio];
    
    return (
      <Table responsive hover className="mt-4">
        <thead>
          <tr>
            <th>Item</th>
            {tipoRelatorio === 'financeiro' ? (
              <th>Valor</th>
            ) : (
              <th>Quantidade</th>
            )}
            <th>Percentual</th>
          </tr>
        </thead>
        <tbody>
          {dados.map(item => (
            <tr key={item.id}>
              <td>{item.nome}</td>
              {tipoRelatorio === 'financeiro' ? (
                <td>R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              ) : (
                <td>{item.quantidade}</td>
              )}
              <td>{item.percentual}%</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container fluid>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3">Carregando dados para relatórios...</p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="bg-white">
                  <h5 className="mb-0">Geração de Relatórios</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tipo de Relatório</Form.Label>
                        <Form.Select 
                          value={tipoRelatorio}
                          onChange={(e) => setTipoRelatorio(e.target.value)}
                        >
                          <option value="atendimentos">Atendimentos</option>
                          <option value="financeiro">Financeiro</option>
                          <option value="farmacia">Farmácia</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Período</Form.Label>
                        <Form.Select
                          value={periodoRelatorio}
                          onChange={(e) => setPeriodoRelatorio(e.target.value)}
                        >
                          <option value="semanal">Semanal</option>
                          <option value="mensal">Mensal</option>
                          <option value="trimestral">Trimestral</option>
                          <option value="anual">Anual</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Data Início</Form.Label>
                        <Form.Control
                          type="date"
                          value={dataInicio}
                          onChange={(e) => setDataInicio(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
                      <Button variant="primary" className="w-100" onClick={gerarDadosRelatorio}>
                        <FaChartBar className="me-2" />
                        Gerar Relatório
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {relatorioGerado && (
            <Row>
              <Col>
                <Card className="shadow-sm">
                  <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      Relatório de {tipoRelatorio === 'atendimentos' ? 'Atendimentos' : 
                                  tipoRelatorio === 'financeiro' ? 'Financeiro' : 'Farmácia'} - {
                                  periodoRelatorio === 'semanal' ? 'Semanal' :
                                  periodoRelatorio === 'mensal' ? 'Mensal' :
                                  periodoRelatorio === 'trimestral' ? 'Trimestral' : 'Anual'}
                    </h5>
                    <div>
                      <Button variant="outline-secondary" size="sm" className="me-2">
                        <FaCalendarAlt className="me-1" />
                        Período: {new Date(dataInicio).toLocaleDateString('pt-BR')} a {new Date(dataFim).toLocaleDateString('pt-BR')}
                      </Button>
                      <Button variant="outline-primary" size="sm">
                        <FaFileDownload className="me-1" />
                        Exportar
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body>
                    {/* Gráfico simplificado */}
                    <div className="border-bottom pb-4">
                      <h6 className="text-center text-muted mb-3">Distribuição Percentual</h6>
                      {renderGrafico()}
                    </div>
                    
                    {/* Tabela de dados */}
                    <div className="pt-2">
                      <h6 className="text-muted mb-2">Detalhamento</h6>
                      {renderTabela()}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default Relatorios;