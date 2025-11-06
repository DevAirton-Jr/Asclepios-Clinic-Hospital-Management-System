import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Offcanvas } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import UserProfile from './PerfilUsuario';
import EVAChat from './EVAChat';
import { 
  FaHome, FaUserInjured, FaCalendarAlt, FaPills, 
  FaUsers, FaMoneyBillWave, FaChartBar, FaBars, 
  FaSignOutAlt, FaUser, FaCog, FaRobot
} from 'react-icons/fa';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
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
      <Navbar bg="dark" variant="dark" expand="lg" className="py-2 glass-nav">
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
            <div className="d-flex align-items-center glass rounded-pill px-2 py-1 me-2">
              <Button variant="outline-light" className="me-2" onClick={handlePerfilClick}>
                <FaCog className="me-2" />
                <span className="d-none d-md-inline">{t('nav.profile')}</span>
              </Button>
              <Button variant="outline-light" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                <span className="d-none d-md-inline">{t('nav.logout')}</span>
              </Button>
            </div>
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
          </div>
        </Container>
      </Navbar>

      <EVAChat show={showEVAModal} handleClose={() => setShowEVAModal(false)} />

      <UserProfile
        show={showPerfilModal}
        handleClose={() => setShowPerfilModal(false)}
      />
      
      <div className="d-flex flex-grow-1">
        <div className="text-white glass-sidebar d-none d-lg-flex flex-column" style={{ width: '250px', minHeight: 'calc(100vh - 56px)' }}>
          <SidebarContent />
        </div>

        <Offcanvas show={showSidebar} onHide={closeSidebar} className="glass-sidebar text-white" style={{ width: '250px' }}>
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title className="text-white">{t('menu.title')}</Offcanvas.Title>
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
        variant="dark"
        className="d-flex align-items-center justify-content-center shadow rounded-circle glass-btn"
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          width: '56px',
          height: '56px',
          zIndex: 1050,
        }}
        aria-label={t('eva.open')}
        title={t('eva.open')}
      >
        <FaRobot size={22} />
      </Button>
    </div>
  );
};

const SidebarContent = ({ onClick }) => {
  const { t } = useLanguage();
  const menuItems = [
    { path: '/', icon: <FaHome />, label: t('menu.dashboard') },
    { path: '/pacientes', icon: <FaUserInjured />, label: t('menu.patients') },
    { path: '/agendamentos', icon: <FaCalendarAlt />, label: t('menu.appointments') },
    { path: '/farmacia', icon: <FaPills />, label: t('menu.pharmacy') },
    { path: '/rh', icon: <FaUsers />, label: t('menu.hr') },
    { path: '/financeiro', icon: <FaMoneyBillWave />, label: t('menu.finance') },
    { path: '/relatorios', icon: <FaChartBar />, label: t('menu.reports') },
  ];

  return (
    <Nav className="flex-column py-3">
      {menuItems.map((item, index) => (
        <Nav.Item key={index}>
          <NavLink 
            to={item.path} 
            className={({ isActive }) => 
              `nav-link py-3 px-4 d-flex align-items-center ${isActive ? 'active' : 'text-white'}`
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