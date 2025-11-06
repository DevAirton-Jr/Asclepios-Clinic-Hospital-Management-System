import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Nav, Tab, Spinner } from 'react-bootstrap';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaFileMedical, FaHistory } from 'react-icons/fa';
import { useData } from '../context/DataContext';

const Patients = () => {
  const { 
    pacientes, 
    loading, 
    adicionarPaciente, 
    atualizarPaciente, 
    removerPaciente 
  } = useData();

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); 
  const [currentPatient, setCurrentPatient] = useState(null);
  const [showProntuario, setShowProntuario] = useState(false);
  const [currentProntuario, setCurrentProntuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    idade: '',
    genero: '',
    telefone: '',
    convenio: '',
    status: 'ativo'
  });

  useEffect(() => {
    if (currentPatient) {
      setFormData({
        nome: currentPatient.nome || '',
        cpf: currentPatient.cpf || '',
        idade: currentPatient.idade || '',
        genero: currentPatient.genero || '',
        telefone: currentPatient.telefone || '',
        convenio: currentPatient.convenio || '',
        status: currentPatient.status || 'ativo'
      });
    } else {
      setFormData({
        nome: '',
        cpf: '',
        idade: '',
        genero: '',
        telefone: '',
        convenio: '',
        status: 'ativo'
      });
    }
  }, [currentPatient]);

  const filteredPacientes = pacientes.filter(paciente => 
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (paciente.cpf && paciente.cpf.includes(searchTerm))
  );

  const handleAddPatient = () => {
    setModalMode('add');
    setCurrentPatient(null);
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setModalMode('edit');
    setCurrentPatient(patient);
    setShowModal(true);
  };

  const handleViewProntuario = (patient) => {
    setCurrentProntuario(patient);
    setShowProntuario(true);
  };

  const handleDeletePatient = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      removerPaciente(id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSavePatient = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      adicionarPaciente(formData);
    } else {
      atualizarPaciente(currentPatient.id, formData);
    }
    
    setShowModal(false);
  };

  return (
    <Container fluid className="pacientes-page fade-in">
      <h2 className="mb-4">Patient Management</h2>
      
      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" role="status" variant="secondary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading patient data...</p>
        </div>
      ) : (
        <>
          {}
          <Row className="mb-4">
            <Col md={6}>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Search by name or CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="me-2"
                />
                <Button variant="outline-dark">
                  <FaSearch /> Search
                </Button>
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <Button variant="dark" onClick={handleAddPatient}>
                <FaUserPlus className="me-2" /> New Patient
              </Button>
            </Col>
          </Row>
      
      {}
      <Card className="mb-4 glass-card">
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Health Plan</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPacientes.map((paciente) => (
                  <tr key={paciente.id}>
                    <td>{paciente.nome}</td>
                    <td>{paciente.idade}</td>
                    <td>{paciente.genero}</td>
                    <td>{paciente.telefone}</td>
                    <td>{paciente.convenio}</td>
                    <td>
                      <span className={`badge bg-${paciente.status === 'ativo' ? 'success' : 'danger'}`}>
                        {paciente.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <Button variant="outline-dark" size="sm" className="me-1" onClick={() => handleEditPatient(paciente)}>
                        <FaEdit /> Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeletePatient(paciente.id)}>
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      </>
      )}

      {}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === 'add' ? 'Add New Patient' : 'Edit Patient'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSavePatient}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Completo</Form.Label>
                  <Form.Control 
                    type="text" 
                    defaultValue={currentPatient?.nome || ''} 
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CPF</Form.Label>
                  <Form.Control 
                    type="text" 
                    defaultValue={currentPatient?.cpf || ''} 
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Data de Nascimento</Form.Label>
                  <Form.Control 
                    type="text" 
                    defaultValue={currentPatient?.dataNascimento || ''} 
                    required 
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Telefone</Form.Label>
                  <Form.Control 
                    type="text" 
                    defaultValue={currentPatient?.telefone || ''} 
                    required 
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Endereço</Form.Label>
              <Form.Control 
                type="text" 
                defaultValue={currentPatient?.endereco || ''} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Convênio</Form.Label>
              <Form.Control 
                type="text" 
                defaultValue={currentPatient?.convenio || ''} 
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="dark" type="submit">
                Save
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {}
      <Modal show={showProntuario} onHide={() => setShowProntuario(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Prontuário - {currentProntuario?.nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProntuario && (
            <Tab.Container defaultActiveKey="info">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="info">Informações Gerais</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="historico">Histórico Médico</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="consultas">Consultas</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content>
                <Tab.Pane eventKey="info">
                  <Row className="mb-3">
                    <Col md={6}>
                      <p><strong>Nome:</strong> {currentProntuario.nome}</p>
                      <p><strong>CPF:</strong> {currentProntuario.cpf}</p>
                      <p><strong>Data de Nascimento:</strong> {currentProntuario.dataNascimento}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Telefone:</strong> {currentProntuario.telefone}</p>
                      <p><strong>Endereço:</strong> {currentProntuario.endereco}</p>
                      <p><strong>Convênio:</strong> {currentProntuario.convenio}</p>
                    </Col>
                  </Row>
                  <div className="mb-3">
                    <h6>Alergias:</h6>
                    <p>{currentProntuario.prontuario.alergias}</p>
                  </div>
                  <div>
                    <h6>Medicamentos em uso:</h6>
                    <ul>
                      {currentProntuario.prontuario.medicamentos.map((med, index) => (
                        <li key={index}>{med}</li>
                      ))}
                    </ul>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="historico">
                  <h6>Histórico Médico:</h6>
                  <ul>
                    {currentProntuario.prontuario.historico.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </Tab.Pane>
                <Tab.Pane eventKey="consultas">
                  <h6>Consultas Realizadas:</h6>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Médico</th>
                        <th>Especialidade</th>
                        <th>Observações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProntuario.prontuario.consultas.map((consulta, index) => (
                        <tr key={index}>
                          <td>{consulta.data}</td>
                          <td>{consulta.medico}</td>
                          <td>{consulta.especialidade}</td>
                          <td>{consulta.observacoes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="dark" onClick={() => setShowProntuario(false)}>
              Close
            </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Patients;