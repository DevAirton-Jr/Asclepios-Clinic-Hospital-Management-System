import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const UserProfile = ({ show, handleClose }) => {
  const { user, updateUserProfile } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    cargo: user?.cargo || '',
    setor: user?.setor || '',
    tema: user?.tema || 'light',
    avatar: user?.avatar || '',
    language: user?.language || language || 'en'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    // Apply language immediately for this session
    setLanguage(formData.language);
    handleClose();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setFormData(prev => ({ ...prev, avatar: base64 }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4} className="text-center mb-3">
              <Image 
                src={formData.avatar || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#6c757d"/></svg>'}
                roundedCircle
                style={{ width: 120, height: 120, objectFit: 'cover', border: '3px solid #dee2e6' }}
                alt="Avatar"
              />
              <Form.Group className="mt-3">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Department</Form.Label>
                <Form.Control
                  type="text"
                  name="setor"
                  value={formData.setor}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mt-4">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Language</Form.Label>
                <Form.Select name="language" value={formData.language} onChange={handleChange}>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="dark" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserProfile;