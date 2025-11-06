import React, { useState, useMemo, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Modal, Spinner } from 'react-bootstrap';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { DataContext } from '../context/DataContext';

const HumanResources = () => {
  const { funcionarios, loading, adicionarFuncionario, atualizarFuncionario, removerFuncionario } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view'); 
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    setor: '',
    dataAdmissao: '',
    status: 'ativo',
    email: '',
    telefone: ''
  });

  useEffect(() => {
    if (currentEmployee && (modalMode === 'edit' || modalMode === 'view')) {
      setFormData({
        ...currentEmployee
      });
    } else if (modalMode === 'add') {
      setFormData({
        nome: '',
        cargo: '',
        setor: '',
        dataAdmissao: new Date().toLocaleDateString('pt-BR'),
        status: 'ativo',
        email: '',
        telefone: ''
      });
    }
  }, [currentEmployee, modalMode]);

  const funcionariosFiltrados = useMemo(() => {
    return funcionarios.filter(funcionario => 
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.setor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [funcionarios, searchTerm]);

  const estatisticas = useMemo(() => {
    return {
      totalFuncionarios: funcionarios.length,
      ativos: funcionarios.filter(f => f.status === 'ativo').length,
      ferias: funcionarios.filter(f => f.status === 'férias').length,
      licenca: funcionarios.filter(f => f.status === 'licença').length
    };
  }, [funcionarios]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleView = (funcionario) => {
    setCurrentEmployee(funcionario);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (funcionario) => {
    setCurrentEmployee(funcionario);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDelete = (funcionario) => {
    if (window.confirm(`Tem certeza que deseja excluir ${funcionario.nome}?`)) {
      removerFuncionario(funcionario.id);
    }
  };

  const handleAddNew = () => {
    setCurrentEmployee(null);
    setModalMode('add');
    setShowModal(true);
  };
  
  const handleSave = () => {
    if (modalMode === 'add') {
      adicionarFuncionario({
        ...formData,
        id: Date.now() 
      });
    } else if (modalMode === 'edit') {
      atualizarFuncionario(formData);
    }
    setShowModal(false);
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'ativo':
        return <Badge bg="success">Ativo</Badge>;
      case 'férias':
        return <Badge bg="info">Férias</Badge>;
      case 'licença':
        return <Badge bg="warning">Licença</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container fluid>
      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '70vh' }}>
          <Spinner animation="border" variant="secondary" />
          <p className="mt-3">Carregando dados de recursos humanos...</p>
        </div>
      ) : (
        <>
          {}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Total de Funcionários</h5>
                  <h2 className="text-primary">{estatisticas.totalFuncionarios}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Ativos</h5>
                  <h2 className="text-success">{estatisticas.ativos}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Em Férias</h5>
                  <h2 className="text-info">{estatisticas.ferias}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Em Licença</h5>
                  <h2 className="text-warning">{estatisticas.licenca}</h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <Form.Group className="mb-0 position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Buscar funcionários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="position-absolute" style={{ right: '10px', top: '10px', opacity: 0.5 }} />
                  </Form.Group>
                </Col>
                <Col md={4} className="text-end">
                  <Button variant="dark" onClick={handleAddNew}>
                    <FaUserPlus className="me-2" />
                    New Staff Member
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {}
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Staff List</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Hire Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionariosFiltrados.map(funcionario => (
                    <tr key={funcionario.id}>
                      <td>{funcionario.nome}</td>
                      <td>{funcionario.cargo}</td>
                      <td>{funcionario.setor}</td>
                      <td>{funcionario.dataAdmissao}</td>
                      <td>{renderStatus(funcionario.status)}</td>
                      <td>
                        <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleView(funcionario)}>
                          <FaEye />
                        </Button>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEdit(funcionario)}>
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(funcionario)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}

      {}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'view' ? 'Detalhes do Funcionário' : 
             modalMode === 'edit' ? 'Editar Funcionário' : 
             'Adicionar Funcionário'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === 'view' && currentEmployee && (
            <div>
              <p><strong>Nome:</strong> {currentEmployee.nome}</p>
              <p><strong>Cargo:</strong> {currentEmployee.cargo}</p>
              <p><strong>Setor:</strong> {currentEmployee.setor}</p>
              <p><strong>Data de Admissão:</strong> {currentEmployee.dataAdmissao}</p>
              <p><strong>Status:</strong> {renderStatus(currentEmployee.status)}</p>
              {currentEmployee.email && <p><strong>Email:</strong> {currentEmployee.email}</p>}
              {currentEmployee.telefone && <p><strong>Telefone:</strong> {currentEmployee.telefone}</p>}
            </div>
          )}
          
          {(modalMode === 'edit' || modalMode === 'add') && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="nome" 
                      value={formData.nome} 
                      onChange={handleInputChange}
                      required 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cargo</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="cargo" 
                      value={formData.cargo} 
                      onChange={handleInputChange}
                      required 
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Setor</Form.Label>
                    <Form.Select
                      name="setor"
                      value={formData.setor}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="Clínica Geral">Clínica Geral</option>
                      <option value="Emergência">Emergência</option>
                      <option value="Pediatria">Pediatria</option>
                      <option value="Cardiologia">Cardiologia</option>
                      <option value="Atendimento">Atendimento</option>
                      <option value="Farmácia">Farmácia</option>
                      <option value="Saúde Mental">Saúde Mental</option>
                      <option value="Reabilitação">Reabilitação</option>
                      <option value="Administração">Administração</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="ativo">Ativo</option>
                      <option value="férias">Férias</option>
                      <option value="licença">Licença</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      name="email" 
                      value={formData.email || ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telefone</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="telefone" 
                      value={formData.telefone || ''} 
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data de Admissão</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="dataAdmissao" 
                      value={formData.dataAdmissao} 
                      onChange={handleInputChange}
                      placeholder="DD/MM/AAAA"
                      required 
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          {modalMode === 'view' ? (
             <Button variant="secondary" onClick={() => setShowModal(false)}>
               Fechar
             </Button>
           ) : (
             <>
               <Button variant="secondary" onClick={() => setShowModal(false)}>
                 Cancel
               </Button>
               <Button variant="dark" onClick={handleSave}>
                 Save
               </Button>
             </>
           )}
          </Modal.Footer>
        </Modal>
      </Container>
    );
};

export default HumanResources;