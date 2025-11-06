import React, { useContext, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Form, Badge } from 'react-bootstrap';
import { DataContext } from '../context/DataContext';

const Reports = () => {
  const { patients, appointments, transactions, loading } = useContext(DataContext);
  const [reportType, setReportType] = useState('appointments');

  const patientStats = useMemo(() => {
    const total = patients.length;
    const active = patients.filter(p => p.status === 'ativo').length;
    const inactive = patients.filter(p => p.status === 'inativo').length;
    const byInsurance = {
      Unimed: patients.filter(p => p.convenio === 'Unimed').length,
      Amil: patients.filter(p => p.convenio === 'Amil').length,
      'SulAmérica': patients.filter(p => p.convenio === 'SulAmérica').length,
      Bradesco: patients.filter(p => p.convenio === 'Bradesco').length,
      Others: patients.filter(p => !['Unimed', 'Amil', 'SulAmérica', 'Bradesco'].includes(p.convenio)).length,
    };
    return { total, active, inactive, byInsurance };
  }, [patients]);

  const appointmentStats = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter(a => a.status === 'confirmado').length;
    const pending = appointments.filter(a => a.status === 'pendente').length;
    const cancelled = appointments.filter(a => a.status === 'cancelado').length;
    const bySpecialty = ['Clínica Geral', 'Cardiologia', 'Ortopedia', 'Dermatologia'].map(spec => ({
      specialty: spec,
      count: appointments.filter(a => a.especialidade === spec).length,
    }));
    const othersCount = appointments.filter(a => !['Clínica Geral', 'Cardiologia', 'Ortopedia', 'Dermatologia'].includes(a.especialidade)).length;
    if (othersCount > 0) bySpecialty.push({ specialty: 'Others', count: othersCount });
    return { total, confirmed, pending, cancelled, bySpecialty };
  }, [appointments]);

  const financeStats = useMemo(() => {
    const revenue = transactions.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0);
    const expenses = transactions.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + t.valor, 0);
    const net = revenue - expenses;
    const margin = revenue > 0 ? ((net / revenue) * 100).toFixed(2) : '0.00';
    return { revenue, expenses, net, margin };
  }, [transactions]);

  const numberToCurrency = (v) => v.toLocaleString('en-US', { style: 'currency', currency: 'BRL' });

  const SummaryCards = () => {
    if (reportType === 'appointments') {
      return (
        <Row className="g-4 mb-4">
          <Col md={3}><Card className="h-100"><Card.Body><h6>Total Appointments</h6><h3>{appointmentStats.total}</h3></Card.Body></Card></Col>
          <Col md={3}><Card className="h-100"><Card.Body><h6>Confirmed</h6><h3>{appointmentStats.confirmed}</h3></Card.Body></Card></Col>
          <Col md={3}><Card className="h-100"><Card.Body><h6>Pending</h6><h3>{appointmentStats.pending}</h3></Card.Body></Card></Col>
          <Col md={3}><Card className="h-100"><Card.Body><h6>Cancelled</h6><h3>{appointmentStats.cancelled}</h3></Card.Body></Card></Col>
        </Row>
      );
    }
    if (reportType === 'patients') {
      return (
        <Row className="g-4 mb-4">
          <Col md={3}><Card className="h-100"><Card.Body><h6>Total Patients</h6><h3>{patientStats.total}</h3></Card.Body></Card></Col>
          <Col md={3}><Card className="h-100"><Card.Body><h6>Active</h6><h3>{patientStats.active}</h3></Card.Body></Card></Col>
          <Col md={3}><Card className="h-100"><Card.Body><h6>Inactive</h6><h3>{patientStats.inactive}</h3></Card.Body></Card></Col>
          <Col md={3}><Card className="h-100"><Card.Body><h6>Insurance Plans</h6><h3>{Object.values(patientStats.byInsurance).reduce((a,b)=>a+b,0)}</h3></Card.Body></Card></Col>
        </Row>
      );
    }
    return (
      <Row className="g-4 mb-4">
        <Col md={3}><Card className="h-100"><Card.Body><h6>Total Revenue</h6><h3>{numberToCurrency(financeStats.revenue)}</h3></Card.Body></Card></Col>
        <Col md={3}><Card className="h-100"><Card.Body><h6>Total Expenses</h6><h3>{numberToCurrency(financeStats.expenses)}</h3></Card.Body></Card></Col>
        <Col md={3}><Card className="h-100"><Card.Body><h6>Net Profit</h6><h3>{numberToCurrency(financeStats.net)}</h3></Card.Body></Card></Col>
        <Col md={3}><Card className="h-100"><Card.Body><h6>Profit Margin</h6><h3><Badge bg="success">{financeStats.margin}%</Badge></h3></Card.Body></Card></Col>
      </Row>
    );
  };

  const DetailTable = () => {
    if (reportType === 'appointments') {
      return (
        <Card className="shadow-sm">
          <Card.Header className="bg-white"><h5 className="mb-0">Appointments by Specialty</h5></Card.Header>
          <Card.Body>
            <Table hover responsive>
              <thead><tr><th>Specialty</th><th>Count</th></tr></thead>
              <tbody>
                {appointmentStats.bySpecialty.map((s, i) => (
                  <tr key={i}><td>{s.specialty}</td><td>{s.count}</td></tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      );
    }
    if (reportType === 'patients') {
      return (
        <Card className="shadow-sm">
          <Card.Header className="bg-white"><h5 className="mb-0">Patients by Insurance</h5></Card.Header>
          <Card.Body>
            <Table hover responsive>
              <thead><tr><th>Insurance</th><th>Count</th></tr></thead>
              <tbody>
                {Object.entries(patientStats.byInsurance).map(([name, count]) => (
                  <tr key={name}><td>{name}</td><td>{count}</td></tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      );
    }
    return (
      <Card className="shadow-sm">
        <Card.Header className="bg-white"><h5 className="mb-0">Recent Transactions</h5></Card.Header>
        <Card.Body>
          <Table hover responsive>
            <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th></tr></thead>
            <tbody>
              {transactions.slice(0, 10).map(t => (
                <tr key={t.id}>
                  <td>{t.data}</td>
                  <td>{t.tipo === 'receita' ? 'Revenue' : 'Expense'}</td>
                  <td>{t.descricao}</td>
                  <td>{numberToCurrency(t.valor)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex align-items-center justify-content-between">
              <h4 className="mb-0">Reports</h4>
              <Form.Select size="sm" style={{ width: 220 }} value={reportType} onChange={(e)=>setReportType(e.target.value)}>
                <option value="appointments">Appointments</option>
                <option value="patients">Patients</option>
                <option value="finance">Finance</option>
              </Form.Select>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center p-4">Loading reports...</div>
              ) : (
                <>
                  <SummaryCards />
                  <DetailTable />
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Reports;