import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, InputGroup, Modal, Spinner } from 'react-bootstrap';
import { FaSearch, FaPills, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useData } from '../context/DataContext';

const Pharmacy = () => {
  const { medicamentos, pacientes, adicionarMedicamento, atualizarMedicamento, removerMedicamento, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentMedication, setCurrentMedication] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    categoria: '',
    estoque: '',
    validade: '',
    fabricante: '',
    descricao: ''
  });

  const dispensacoes = [
    { id: 1, paciente: 'Maria Silva', medicamento: 'Dipirona', quantidade: 10, data: '10/06/2023', medico: 'Dr. Carlos Santos' },
    { id: 2, paciente: 'João Oliveira', medicamento: 'Amoxicilina', quantidade: 15, data: '11/06/2023', medico: 'Dra. Ana Pereira' },
    { id: 3, paciente: 'Pedro Costa', medicamento: 'Losartana', quantidade: 30, data: '12/06/2023', medico: 'Dr. Roberto Lima' },
    { id: 4, paciente: 'Ana Souza', medicamento: 'Omeprazol', quantidade: 20, data: '13/06/2023', medico: 'Dra. Mariana Alves' },
  ];

  const filteredMedications = medicamentos.filter(med => 
    med.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const medicamentosDisponiveis = medicamentos.filter(med => med.status === 'disponível').length;
  const medicamentosBaixoEstoque = medicamentos.filter(med => med.status === 'baixo').length;
  const medicamentosCritico = medicamentos.filter(med => med.status === 'crítico').length;

  const renderStatus = (status) => {
    let variant = 'secondary';
    let displayText = status.charAt(0).toUpperCase() + status.slice(1);
    
    if (status === 'disponível') {
      variant = 'success';
    } else if (status === 'baixo') {
      variant = 'warning';
    } else if (status === 'crítico') {
      variant = 'danger';
    }
    
    return <Badge bg={variant}>{displayText}</Badge>;
  };

  useEffect(() => {
    if (currentMedication) {
      setFormData({
        nome: currentMedication.nome,
        categoria: currentMedication.categoria,
        estoque: currentMedication.estoque,
        validade: currentMedication.validade,
        fabricante: currentMedication.fabricante || '',
        descricao: currentMedication.descricao || ''
      });
    } else {
      setFormData({
        nome: '',
        categoria: '',
        estoque: '',
        validade: '',
        fabricante: '',
        descricao: ''
      });
    }
  }, [currentMedication]);

  const handleNovoMedicamento = () => {
    setCurrentMedication(null);
    setModalMode('add');
    setShowModal(true);
  };

  const handleDispensarMedicamento = (id) => {
    const medication = medicamentos.find(med => med.id === id);
    if (medication && medication.estoque > 0) {
      atualizarMedicamento(id, {
        estoque: medication.estoque - 1
      });
    }
  };

  const handleVerDetalhes = (medication) => {
    setCurrentMedication(medication);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEditarMedicamento = (medication) => {
    setCurrentMedication(medication);
    setModalMode('edit');
    setShowModal(true);
  };

  const handleDeleteMedication = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este medicamento?')) {
      removerMedicamento(id);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'estoque' ? parseInt(value) || 0 : value
    });
  };

  const handleSaveMedication = (e) => {
    e.preventDefault();

    const estoque = parseInt(formData.estoque);
    const status = estoque <= 10 ? 'Crítico' : 
                  estoque <= 50 ? 'Baixo Estoque' : 'Disponível';
    
    if (modalMode === 'add') {
      adicionarMedicamento({
        id: Date.now(),
        ...formData,
        status
      });
    } else if (modalMode === 'edit') {
      atualizarMedicamento({
        id: currentMedication.id,
        ...formData,
        status
      });
    }
    
    setShowModal(false);
  };

  return (
    <Container fluid className="p-4">
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="secondary" />
          <p className="mt-3">Carregando dados da farmácia...</p>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <h2 className="mb-4">Farmácia</h2>
              
              {}
              <Row className="g-4 mb-4">
                <Col md={4}>
                  <Card className="dashboard-card h-100 border-primary">
                    <Card.Body className="d-flex align-items-center">
                      <div className="icon-box bg-primary text-white">
                        <FaPills />
                      </div>
                      <div className="ms-3">
                        <h6 className="card-subtitle text-muted">Total de Medicamentos</h6>
                        <h2 className="card-title mb-0">{medicamentos.length}</h2>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="dashboard-card h-100 border-warning">
                    <Card.Body className="d-flex align-items-center">
                      <div className="icon-box bg-warning text-white">
                        <FaPills />
                      </div>
                      <div className="ms-3">
                        <h6 className="card-subtitle text-muted">Baixo Estoque</h6>
                        <h2 className="card-title mb-0">{medicamentosBaixoEstoque}</h2>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="dashboard-card h-100 border-danger">
                    <Card.Body className="d-flex align-items-center">
                      <div className="icon-box bg-danger text-white">
                        <FaPills />
                      </div>
                  <div className="ms-3">
                    <h6 className="card-subtitle text-muted">Estoque Crítico</h6>
                    <h2 className="card-title mb-0">{medicamentosCritico}</h2>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          {}
          <Card className="mb-4 glass-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Medication Inventory</span>
              <div className="d-flex">
                <InputGroup className="me-2" style={{ width: '300px' }}>
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar medicamento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Button variant="dark" onClick={handleNovoMedicamento}>
                  <FaPlus className="me-1" /> Novo Medicamento
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedications.map((med) => (
                    <tr key={med.id}>
                      <td>{med.nome}</td>
                      <td>{med.categoria}</td>
                      <td>{med.estoque}</td>
                      <td>{med.validade}</td>
                      <td>{renderStatus(med.status)}</td>
                      <td>
                        <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleVerDetalhes(med)}>
                          <FaEye />
                        </Button>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEditarMedicamento(med)}>
                          <FaEdit />
                        </Button>
                        <Button variant="outline-success" size="sm" className="me-1" onClick={() => handleDispensarMedicamento(med.id)}>
                          <FaPills />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteMedication(med.id)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          
          {}
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Dispensações Recentes</span>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Medicamento</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                    <th>Médico</th>
                  </tr>
                </thead>
                <tbody>
                  {dispensacoes.map((dispensacao) => (
                    <tr key={dispensacao.id}>
                      <td>{dispensacao.paciente}</td>
                      <td>{dispensacao.medicamento}</td>
                      <td>{dispensacao.quantidade}</td>
                      <td>{dispensacao.data}</td>
                      <td>{dispensacao.medico}</td>
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
            {modalMode === 'add' ? 'Novo Medicamento' : 
             modalMode === 'edit' ? 'Editar Medicamento' : 
             'Detalhes do Medicamento'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveMedication}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Analgésico">Analgésico</option>
                    <option value="Antibiótico">Antibiótico</option>
                    <option value="Anti-hipertensivo">Anti-hipertensivo</option>
                    <option value="Anti-inflamatório">Anti-inflamatório</option>
                    <option value="Protetor Gástrico">Protetor Gástrico</option>
                    <option value="Hormônio">Hormônio</option>
                    <option value="Outro">Outro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estoque</Form.Label>
                  <Form.Control
                    type="number"
                    name="estoque"
                    value={formData.estoque}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Validade</Form.Label>
                  <Form.Control
                    type="text"
                    name="validade"
                    value={formData.validade}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                    placeholder="MM/AAAA"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Fabricante</Form.Label>
                  <Form.Control
                    type="text"
                    name="fabricante"
                    value={formData.fabricante}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    disabled={modalMode === 'view'}
                  />
                </Form.Group>
              </Col>
            </Row>
            {modalMode !== 'view' && (
              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
              <Button variant="dark" type="submit">
                Save
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

export default Pharmacy;