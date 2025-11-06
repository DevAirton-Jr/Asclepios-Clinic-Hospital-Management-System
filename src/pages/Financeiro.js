import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { FaDownload, FaFileInvoiceDollar, FaChartLine, FaEdit, FaTrash } from 'react-icons/fa';
import { DataContext } from '../context/DataContext';

const Finance = () => {
  const { transacoes, loading, adicionarTransacao, atualizarTransacao, removerTransacao } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [currentTransacao, setCurrentTransacao] = useState(null);
  const [formData, setFormData] = useState({
    data: '',
    tipo: 'receita',
    descricao: '',
    valor: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentTransacao) {
      setFormData({
        data: currentTransacao.data,
        tipo: currentTransacao.tipo,
        descricao: currentTransacao.descricao,
        valor: currentTransacao.valor.toString()
      });
    } else {
      setFormData({
        data: new Date().toLocaleDateString('pt-BR'),
        tipo: 'receita',
        descricao: '',
        valor: ''
      });
    }
  }, [currentTransacao]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'valor' ? value.replace(',', '.') : value
    });
  };

  const handleSave = () => {
    const transacaoData = {
      ...formData,
      valor: parseFloat(formData.valor)
    };

    if (currentTransacao) {
      atualizarTransacao({ ...currentTransacao, ...transacaoData });
    } else {
      adicionarTransacao(transacaoData);
    }

    setShowModal(false);
    setCurrentTransacao(null);
  };

  const handleEdit = (transacao) => {
    setCurrentTransacao(transacao);
    setShowModal(true);
  };

  const handleNovaTransacao = () => {
    setCurrentTransacao(null);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      removerTransacao(id);
    }
  };

  const transacoesFiltradas = transacoes.filter(transacao => 
    transacao.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transacao.data.includes(searchTerm)
  );

  const estatisticas = {
    totalReceitas: transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0),
    totalDespesas: transacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0),
    get saldo() { return this.totalReceitas - this.totalDespesas; },
    get percentualLucro() { 
      return this.totalReceitas > 0 
        ? ((this.totalReceitas - this.totalDespesas) / this.totalReceitas * 100).toFixed(2) 
        : 0;
    }
  };

  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <Container fluid>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="secondary" />
          <p className="mt-3">Carregando dados financeiros...</p>
        </div>
      ) : (
        <>
          {}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Receitas</h5>
                  <h2 className="text-success">{formatarMoeda(estatisticas.totalReceitas)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Despesas</h5>
                  <h2 className="text-danger">{formatarMoeda(estatisticas.totalDespesas)}</h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Saldo</h5>
                  <h2 className={estatisticas.saldo >= 0 ? "text-success" : "text-danger"}>
                    {formatarMoeda(estatisticas.saldo)}
                  </h2>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="text-center">
                  <h5>Lucro</h5>
                  <h2 className={estatisticas.saldo >= 0 ? "text-success" : "text-danger"}>
                    {estatisticas.percentualLucro}%
                  </h2>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Resumo Financeiro</h5>
              <Button variant="outline-primary" size="sm">
                <FaChartLine className="me-2" />
                Ver Detalhes
              </Button>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <h6 className="text-muted mb-4">Gráfico de Receitas x Despesas</h6>
              <div className="d-flex justify-content-center align-items-end mb-3" style={{ height: '180px', overflow: 'visible' }}>
                <div className="mx-4 d-flex flex-column align-items-center" style={{ minWidth: '100px' }}>
                  <div 
                    className="bg-success" 
                    style={{ 
                      width: '80px', 
                      height: `${(estatisticas.totalReceitas / (Math.max(estatisticas.totalReceitas, estatisticas.totalDespesas) || 1) * 150)}px`,
                      borderRadius: '4px 4px 0 0'
                    }}
                  ></div>
                  <div className="mt-2 text-center" style={{ maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word' }}>Receitas</div>
                </div>
                <div className="mx-4 d-flex flex-column align-items-center" style={{ minWidth: '100px' }}>
                  <div 
                    className="bg-danger" 
                    style={{ 
                      width: '80px', 
                      height: `${(estatisticas.totalDespesas / (Math.max(estatisticas.totalReceitas, estatisticas.totalDespesas) || 1) * 150)}px`,
                      borderRadius: '4px 4px 0 0'
                    }}
                  ></div>
                  <div className="mt-2 text-center" style={{ maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word' }}>Despesas</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {}
          <div className="mb-3">
            <Form.Control
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {}
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Recent Transactions</h5>
              <div>
                <Button variant="outline-success" size="sm" className="me-2" onClick={handleNovaTransacao}>
                  <FaFileInvoiceDollar className="me-1" />
                  Nova Transação
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <FaDownload className="me-1" />
                  Exportar
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoesFiltradas.length > 0 ? (
                    transacoesFiltradas.map(transacao => (
                      <tr key={transacao.id}>
                        <td>{transacao.data}</td>
                        <td>{transacao.descricao}</td>
                        <td>
                          <span className={`badge ${transacao.tipo === 'receita' ? 'bg-success' : 'bg-danger'}`}>
                            {transacao.tipo === 'receita' ? 'Receita' : 'Despesa'}
                          </span>
                        </td>
                        <td className={transacao.tipo === 'receita' ? 'text-success' : 'text-danger'}>
                          {formatarMoeda(transacao.valor)}
                        </td>
                        <td>
                          <Button variant="link" size="sm" className="p-0 me-2" onClick={() => handleEdit(transacao)}>
            <FaEdit className="text-dark" />
                          </Button>
                          <Button variant="link" size="sm" className="p-0" onClick={() => handleDelete(transacao.id)}>
                            <FaTrash className="text-danger" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Nenhuma transação encontrada</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{currentTransacao ? 'Editar Transação' : 'Nova Transação'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="text"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    placeholder="DD/MM/AAAA"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                  >
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Descrição</Form.Label>
                  <Form.Control
                    type="text"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descrição da transação"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Valor (R$)</Form.Label>
                  <Form.Control
                    type="text"
                    name="valor"
                    value={formData.valor}
                    onChange={handleInputChange}
                    placeholder="0,00"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
               <Button variant="dark" onClick={handleSave}>
                 Save
               </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default Finance;