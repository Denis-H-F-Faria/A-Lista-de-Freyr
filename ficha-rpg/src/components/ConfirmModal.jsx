import { Modal, Button } from 'react-bootstrap';

export default function ConfirmModal({ show, onHide, onConfirm, titulo, mensagem }) {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{titulo || 'Confirmar ação'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{mensagem || 'Você tem certeza que deseja prosseguir?'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}