import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

// Componente de perfil do usuário: edição de dados e preferências
// Sincroniza alterações com AuthContext e persiste via localStorage
const PerfilUsuario = ({ show, handleClose }) => {
  const { user, updateUserProfile } = useAuth();
  // Estado local do formulário, inicializado com dados atuais do usuário
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    cargo: user?.cargo || '',
    setor: user?.setor || '',
    tema: user?.tema || 'claro',
    corPrimaria: user?.corPrimaria || '#0d6efd',
    avatar: user?.avatar || ''
  });

  // Atualiza campos de texto/select conforme entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Salva alterações no perfil e fecha o modal
  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    handleClose();
  };

  // Converte imagem para base64 para persistir avatar
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
        {/* Formulário de atualização do perfil */}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4} className="text-center mb-3">
              {/* Preview do avatar com fallback */}
              <Image 
                src={formData.avatar || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22150%22 height=%22150%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23e9ecef%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%236c757d%22 font-size=%2224%22>Avatar</text></svg>'}
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