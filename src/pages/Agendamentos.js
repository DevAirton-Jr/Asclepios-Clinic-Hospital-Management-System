import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Spinner } from 'react-bootstrap';
import { useData } from '../context/DataContext';
import { FaEye, FaEdit, FaTrash, FaCalendarPlus } from 'react-icons/fa';

const Agendamentos = () => {
  const { agendamentos, pacientes, adicionarAgendamento, atualizarAgendamento, removerAgendamento, loading } = useData();
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [formData, setFormData] = useState({
    paciente: '',
    medico: '',
    data: '',
    hora: '',
    especialidade: '',
    status: 'Aguardando'
  });

  const medicos = [
    { id: 1, nome: 'Dr. Carlos Santos', especialidade: 'Cardiologia' },
    { id: 2, nome: 'Dra. Ana Pereira', especialidade: 'Pediatria' },
    { id: 3, nome: 'Dr. Roberto Lima', especialidade: 'Ortopedia' },
    { id: 4, nome: 'Dra. Mariana Alves', especialidade: 'Dermatologia' },
    { id: 5, nome: 'Dr. Paulo Ribeiro', especialidade: 'Clínica Geral' }
  ];

  useEffect(() => {
    if (currentAppointment) {
      setFormData({
        paciente: currentAppointment.paciente,
        medico: currentAppointment.medico,
        data: currentAppointment.data,
        hora: currentAppointment.hora,
        especialidade: currentAppointment.especialidade,
        status: currentAppointment.status
      });
    } else {
      setFormData({
        paciente: '',
        medico: '',
        data: '',
        hora: '',
        especialidade: '',
        status: 'Aguardando'
      });
    }
  }, [currentAppointment]);

  const handleView = (appointment) => {
    setCurrentAppointment(appointment);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (appointment) => {
    setCurrentAppointment(appointment);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      removerAgendamento(id);
    }
  };

  const handleNewAppointment = () => {
    setCurrentAppointment(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'medico') {
      const selectedMedico = medicos.find(m => m.nome === value);
      if (selectedMedico) {
        setFormData(prev => ({
          ...prev,
          especialidade: selectedMedico.especialidade
        }));
      }
    }
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      adicionarAgendamento({
        id: Date.now(),
        ...formData
      });
    } else if (modalMode === 'edit') {
      atualizarAgendamento({
        id: currentAppointment.id,
        ...formData
      });
    }
    
    setShowModal(false);
  };

  const renderStatus = (status) => {
    let variant;
    switch (status) {
      case 'Confirmado':
        variant = 'success';
        break;
      case 'Aguardando':
        variant = 'warning';
        break;
      case 'Cancelado':
        variant = 'danger';
        break;
      case 'Realizado':
        variant = 'info';
        break;
      default:
        variant = 'secondary';
    }
    return <Badge bg={variant}>{status}</Badge>;
  };

  return (
    <Container fluid className="p-4">
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary" />
          <p className="mt-3">Carregando agendamentos...</p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <h2 className="mb-4">Agendamentos</h2>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span>Lista de Agendamentos</span>
                  <Button variant="primary" onClick={handleNewAppointment}>
                    <FaCalendarPlus className="me-1" /> Novo Agendamento
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Paciente</th>
                        <th>Médico</th>
                        <th>Especialidade</th>
                        <th>Data</th>
                        <th>Hora</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agendamentos.map((agendamento) => (
                        <tr key={agendamento.id}>
                          <td>{agendamento.paciente}</td>
                          <td>{agendamento.medico}</td>
                          <td>{agendamento.especialidade}</td>
                          <td>{agendamento.data}</td>
                          <td>{agendamento.hora}</td>
                          <td>{renderStatus(agendamento.status)}</td>
                          <td>
                            <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleView(agendamento)}>
                              <FaEye />
                            </Button>
                            <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(agendamento)}>
                              <FaEdit />
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(agendamento.id)}>
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'add' ? 'Novo Agendamento' : 
             modalMode === 'edit' ? 'Editar Agendamento' : 
             'Detalhes do Agendamento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveAppointment}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Paciente</Form.Label>
                  <Form.Select
                    name="paciente"
                    value={formData.paciente}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                  >
                    <option value="">Selecione o paciente...</option>
                    {pacientes.map(paciente => (
                       <option key={paciente.id} value={paciente.nome}>
                         {paciente.nome}
                       </option>
                     ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Médico</Form.Label>
                  <Form.Select
                    name="medico"
                    value={formData.medico}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                  >
                    <option value="">Selecione o médico...</option>
                    {medicos.map(medico => (
                      <option key={medico.id} value={medico.nome}>
                        {medico.nome} - {medico.especialidade}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data</Form.Label>
                  <Form.Control
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    name="hora"
                    value={formData.hora}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Especialidade</Form.Label>
                  <Form.Control
                    type="text"
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleInputChange}
                    disabled={true}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                  >
                    <option value="Aguardando">Aguardando</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Realizado">Realizado</option>
                    <option value="Cancelado">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            {modalMode !== 'view' && (
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Salvar
                </Button>
              </div>
            )}
            {modalMode === 'view' && (
              <div className="d-flex justify-content-end">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Fechar
                </Button>
              </div>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Agendamentos;