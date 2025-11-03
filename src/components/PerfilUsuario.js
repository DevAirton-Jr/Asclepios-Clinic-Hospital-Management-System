import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const PerfilUsuario = ({ show, handleClose }) => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    cargo: user?.cargo || '',
    setor: user?.setor || '',
    tema: user?.tema || 'claro',
    corPrimaria: user?.corPrimaria || '#0d6efd',
    avatar: user?.avatar || ''
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
        <Modal.Title>Personalizar Perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4} className="text-center mb-3">
              <Image 
                src={formData.avatar || 'data:image/svg+xml;utf8,<svg xmlns=%22http:
                roundedCircle
                style={{ width: 120, height: 120, objectFit: 'cover', border: '3px solid #dee2e6' }}
                alt="Avatar"
              />
              <Form.Group className="mt-3">
                <Form.Label>Foto de Perfil</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Nome</Form.Label>
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
                <Form.Label>Cargo</Form.Label>
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
                <Form.Label>Setor</Form.Label>
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
                <Form.Label>Tema</Form.Label>
                <Form.Select
                  name="tema"
                  value={formData.tema}
                  onChange={handleChange}
                >
                  <option value="claro">Claro</option>
                  <option value="escuro">Escuro</option>
                  <option value="sistema">Seguir Sistema</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cor Primária</Form.Label>
                <Form.Control
                  type="color"
                  name="corPrimaria"
                  value={formData.corPrimaria}
                  onChange={handleChange}
                  title="Escolha a cor primária"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Salvar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PerfilUsuario;