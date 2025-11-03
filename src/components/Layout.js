import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import PerfilUsuario from './PerfilUsuario';
import EVAChat from './EVAChat';
import { 
  FaHome, FaUserInjured, FaCalendarAlt, FaPills, 
  FaUsers, FaMoneyBillWave, FaChartBar, FaBars, 
  FaSignOutAlt, FaUser, FaCog, FaRobot
} from 'react-icons/fa';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPerfilModal, setShowPerfilModal] = useState(false);
  const [showEVAModal, setShowEVAModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setShowSidebar(false);
  
  const handlePerfilClick = () => {
    setShowPerfilModal(true);
  };

  const handleEVAClick = () => {
    setShowEVAModal(true);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="primary" variant="dark" expand="lg" className="py-2">
        <Container fluid>
          <Button 
            variant="outline-light" 
            className="me-2 d-lg-none"
            onClick={() => setShowSidebar(true)}
          >
            <FaBars />
          </Button>
          <Navbar.Brand className="fw-bold">
            Asclepios Clinic
          </Navbar.Brand>
          <div className="ms-auto d-flex align-items-center">
            <div className="text-light me-3 d-none d-md-block">
              <div className="fw-bold d-flex align-items-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt="Avatar" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', marginRight: 8, border: '2px solid rgba(255,255,255,0.6)' }} />
                ) : (
                  <FaUser className="me-2" />
                )}
                {user?.nome}
              </div>
              <div className="small">{user?.cargo} - {user?.setor}</div>
            </div>
            <Button variant="outline-light" className="me-2" onClick={handlePerfilClick}>
              <FaCog className="me-2" />
              <span className="d-none d-md-inline">Profile</span>
            </Button>
            <Button variant="outline-light" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" />
              <span className="d-none d-md-inline">Logout</span>
            </Button>
          </div>
        </Container>
      </Navbar>

      <EVAChat show={showEVAModal} handleClose={() => setShowEVAModal(false)} />

      <PerfilUsuario 
        show={showPerfilModal} 
        handleClose={() => setShowPerfilModal(false)} 
      />
      
      <div className="d-flex flex-grow-1">
        <div className="bg-dark text-white d-none d-lg-flex flex-column" style={{ width: '250px', minHeight: 'calc(100vh - 56px)' }}>
          <SidebarContent />
        </div>

        <Offcanvas show={showSidebar} onHide={closeSidebar} className="bg-dark text-white" style={{ width: '250px' }}>
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title className="text-white">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <SidebarContent onClick={closeSidebar} />
          </Offcanvas.Body>
        </Offcanvas>

        {}
        <div className="flex-grow-1 bg-light">
          <Container fluid className="py-4">
            <Outlet />
          </Container>
        </div>
      </div>

      <Button 
        onClick={handleEVAClick}
        variant="primary"
        className="d-flex align-items-center shadow rounded-circle"
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          width: '56px',
          height: '56px',
          zIndex: 1050,
        }}
        aria-label="Open EVA"
        title="Open EVA"
      >
        <FaRobot size={22} />
      </Button>
    </div>
  );
};

const SidebarContent = ({ onClick }) => {
  const menuItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/pacientes', icon: <FaUserInjured />, label: 'Patients' },
    { path: '/agendamentos', icon: <FaCalendarAlt />, label: 'Appointments' },
    { path: '/farmacia', icon: <FaPills />, label: 'Pharmacy' },
    { path: '/rh', icon: <FaUsers />, label: 'Human Resources' },
    { path: '/financeiro', icon: <FaMoneyBillWave />, label: 'Finance' },
    { path: '/relatorios', icon: <FaChartBar />, label: 'Reports' },
  ];

  return (
    <Nav className="flex-column py-3">
      {menuItems.map((item, index) => (
        <Nav.Item key={index}>
          <NavLink 
            to={item.path} 
            className={({ isActive }) => 
              `nav-link py-3 px-4 d-flex align-items-center ${isActive ? 'active bg-primary' : 'text-white'}`
            }
            onClick={onClick}
          >
            <span className="me-3">{item.icon}</span>
            {item.label}
          </NavLink>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Layout;