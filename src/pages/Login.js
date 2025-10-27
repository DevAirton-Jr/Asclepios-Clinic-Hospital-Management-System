import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaHospital, FaLock, FaUser } from 'react-icons/fa';
import clinicalImage from '../assets/images/clinical.jpeg';
import logo from '../assets/images/logo.png';

// Tela de login: autenticação simulada e navegação pós-login
// Usa AuthContext para registrar sessão e redireciona para Dashboard
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Usuários de demonstração (email/senha)
  const demoUsers = [
    { email: 'medico@hospital.com', password: '123456', nome: 'Dr. Carlos Silva', cargo: 'Médico', setor: 'Cardiologia' },
    { email: 'enfermeira@hospital.com', password: '123456', nome: 'Enfermeira Ana Santos', cargo: 'Enfermeira', setor: 'Emergência' },
    { email: 'admin@hospital.com', password: '123456', nome: 'Admin João Oliveira', cargo: 'Administrador', setor: 'TI' }
  ];

  // Valida credenciais contra a lista de demonstração
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulação de autenticação assíncrona
    setTimeout(() => {
      const user = demoUsers.find(user => user.email === email && user.password === password);
      
      if (user) {
        login(user);
        navigate('/');
      } else {
        setError('Email ou senha incorretos');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div 
      className="login-page vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${clinicalImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      {/* Overlay escuro para melhor contraste visual */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      />
      
      <Container fluid className="position-relative" style={{ zIndex: 2 }}>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={4}>
            <Card 
               className="shadow-lg border-0"
               style={{
                 backgroundColor: 'rgba(33, 37, 41, 0.7)',
                 backdropFilter: 'blur(10px)',
                 borderRadius: '20px'
               }}
             >
               <Card.Body className="p-5 text-light">
              <div className="text-center mb-4">
                {/* Branding atualizada */}
                <img src={logo} alt="Asclepios Clínica" className="mb-3" style={{ height: '64px' }} />
                <h2 className="fw-bold" style={{ color: '#fff' }}>Asclepios Clínica</h2>
                <p className="text-light">Sistema de Gestão Hospitalar</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              {/* Formulário de credenciais */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <div className="input-group">
                    <span 
                      className="input-group-text text-white"
                      style={{
                        backgroundColor: '#0d6efd',
                        border: 'none',
                        borderRadius: '15px 0 0 15px'
                      }}
                    >
                      <FaUser />
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        border: 'none',
                        borderRadius: '0 15px 15px 0',
                        backgroundColor: 'rgba(248, 249, 250, 0.8)',
                        padding: '12px 16px'
                      }}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <div className="input-group">
                    <span 
                      className="input-group-text text-white"
                      style={{
                        backgroundColor: '#0d6efd',
                        border: 'none',
                        borderRadius: '15px 0 0 15px'
                      }}
                    >
                      <FaLock />
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        border: 'none',
                        borderRadius: '0 15px 15px 0',
                        backgroundColor: 'rgba(248, 249, 250, 0.8)',
                        padding: '12px 16px'
                      }}
                    />
                  </div>
                </Form.Group>

                <Button 
                  type="submit" 
                  className="w-100 py-3 mb-3"
                  disabled={loading}
                  style={{
                    backgroundColor: '#0d6efd',
                    border: 'none',
                    borderRadius: '15px',
                    fontWeight: '600',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0b5ed7';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#0d6efd';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
                
                {/* Dicas de acesso para demonstração */}
                <div className="text-center text-muted small">
                  <p>Usuários de demonstração:</p>
                  <p>medico@hospital.com / 123456</p>
                  <p>enfermeira@hospital.com / 123456</p>
                  <p>admin@hospital.com / 123456</p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default Login;