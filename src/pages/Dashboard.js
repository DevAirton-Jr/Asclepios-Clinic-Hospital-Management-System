import React, { useMemo } from 'react';
import { Container, Row, Col, Card, Table, Spinner } from 'react-bootstrap';
import { 
  FaUserInjured, FaCalendarAlt, FaBed, FaUserMd
} from 'react-icons/fa';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { 
    pacientes, 
    agendamentos, 
    funcionarios,
    loading,
    obterEstatisticasPacientes,
    obterEstatisticasAgendamentos
  } = useData();

  const statsCards = useMemo(() => {
    const estatisticasPacientes = obterEstatisticasPacientes();
    const estatisticasAgendamentos = obterEstatisticasAgendamentos();
    
    return [
      { 
        title: 'Pacientes Ativos', 
        value: estatisticasPacientes.ativos, 
        icon: <FaUserInjured />, 
        color: 'primary' 
      },
      { 
        title: 'Consultas Hoje', 
        value: agendamentos.filter(a => a.data === '05/07/2023').length, 
        icon: <FaCalendarAlt />, 
        color: 'success' 
      },
      { 
        title: 'Taxa de Ocupação', 
        value: '78%', 
        icon: <FaBed />, 
        color: 'warning' 
      },
      { 
        title: 'Médicos Disponíveis', 
        value: funcionarios.filter(f => f.cargo === 'Médico' && f.status === 'ativo').length, 
        icon: <FaUserMd />, 
        color: 'info' 
      },
    ];
  }, [pacientes, agendamentos, funcionarios, obterEstatisticasPacientes, obterEstatisticasAgendamentos]);

  const pacientesRecentes = useMemo(() => {
    return pacientes
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        nome: p.nome,
        idade: p.idade,
        setor: p.convenio,
        status: p.status === 'ativo' ? 'Em tratamento' : 'Inativo'
      }));
  }, [pacientes]);

  const consultasAgendadas = useMemo(() => {
    return agendamentos
      .filter(a => a.status !== 'cancelado')
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        paciente: a.paciente,
        medico: a.medico,
        horario: a.hora,
        especialidade: a.especialidade
      }));
  }, [agendamentos]);

  return (
    <Container fluid className="p-4">
      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
          <p className="mt-2">Carregando dados do sistema...</p>
        </div>
      ) : (
        <>
          {}
          <Row className="g-4 mb-4">
            {statsCards.map((card, index) => (
              <Col md={6} lg={3} key={index}>
                <Card className={`dashboard-card border-${card.color} h-100`}>
                  <Card.Body className="d-flex align-items-center">
                    <div className={`icon-box bg-${card.color} text-white`}>
                      {card.icon}
                    </div>
                    <div className="ms-3">
                      <h6 className="card-subtitle text-muted">{card.title}</h6>
                      <h2 className="card-title mb-0">{card.value}</h2>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {}
          <Row className="g-4 mb-4">
            <Col lg={6}>
              <Card className="dashboard-card h-100">
                <Card.Body>
                  <h5 className="card-title mb-3">Atendimentos Mensais</h5>
                  <div className="text-center p-5 bg-light">
                    <p>Gráfico de Atendimentos Mensais</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="dashboard-card h-100">
                <Card.Body>
                  <h5 className="card-title mb-3">Ocupação de Leitos</h5>
                  <div className="text-center p-5 bg-light">
                    <p>Gráfico de Ocupação de Leitos</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {}
          <Row className="g-4">
            <Col lg={6}>
              <Card className="dashboard-card h-100">
                <Card.Body>
                  <h5 className="card-title mb-3">Pacientes Recentes</h5>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Idade</th>
                          <th>Setor</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pacientesRecentes.map((paciente) => (
                          <tr key={paciente.id}>
                            <td>{paciente.nome}</td>
                            <td>{paciente.idade}</td>
                            <td>{paciente.setor}</td>
                        <td>
                          <span className={`badge bg-${
                            paciente.status === 'Inativo' 
                              ? 'danger' 
                              : 'primary'
                          }`}>
                            {paciente.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card className="dashboard-card h-100">
            <Card.Body>
              <h5 className="card-title mb-3">Consultas Agendadas</h5>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Médico</th>
                      <th>Horário</th>
                      <th>Especialidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultasAgendadas.map((consulta) => (
                      <tr key={consulta.id}>
                        <td>{consulta.paciente}</td>
                        <td>{consulta.medico}</td>
                        <td>{consulta.horario}</td>
                        <td>{consulta.especialidade}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
        </>
      )}
    </Container>
  );
};

export default Dashboard;