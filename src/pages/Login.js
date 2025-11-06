import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaHospital, FaLock, FaUser, FaInfoCircle } from 'react-icons/fa';
import clinicalImage from '../assets/images/clinical.jpeg';
import logo from '../assets/images/logo.png';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const demoUsers = [
    { email: 'admin@hospital.com', password: '123456', nome: 'John Smith', cargo: 'Administrator', setor: 'IT' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = demoUsers.find(user => user.email === email && user.password === password);
      
      if (user) {
        login(user);
        navigate('/');
      } else {
        setError('Incorrect email or password');
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
                
                <img src={logo} alt="Asclepios Clinic" className="mb-3" style={{ height: '64px' }} />
                <h2 className="fw-bold" style={{ color: '#fff' }}>Asclepios Clinic</h2>
                <p className="text-light">Hospital Management System</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

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
                      placeholder="Password"
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
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
              
              {/* Demo box moved to bottom of page, outside the login card */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Demo account info box positioned at the bottom of the page */}
      <div 
        className="demo-info-box position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(13, 110, 253, 0.2)',
          padding: '10px 15px',
          borderRadius: '10px',
          border: '1px solid rgba(13, 110, 253, 0.3)',
          maxWidth: '250px',
          zIndex: 1000
        }}
      >
        <div className="d-flex align-items-center mb-2">
          <FaInfoCircle className="text-info me-2" />
          <span className="fw-bold">Demo Account</span>
        </div>
        <div className="small">
          <p className="mb-1">Email: admin@hospital.com</p>
          <p className="mb-0">Password: 123456</p>
        </div>
      </div>
      </Container>
    </div>
  );
};

export default Login;