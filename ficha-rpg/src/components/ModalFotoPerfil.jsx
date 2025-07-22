// src/components/ModalFotoPerfil.jsx
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function ModalFotoPerfil({ show, onHide, onSalvar }) {
  const [preview, setPreview] = useState(null);
  const [base64, setBase64] = useState(null);

  const handleSelecionarImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSalvar = () => {
    if (base64) onSalvar(base64);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Alterar Foto de Perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          {preview ? (
            <img
              src={preview}
              alt="Pré-visualização"
              className="rounded-circle border"
              style={{ width: 120, height: 120, objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white"
              style={{ width: 120, height: 120 }}
            >
              ?
            </div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleSelecionarImagem} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSalvar} disabled={!base64}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}