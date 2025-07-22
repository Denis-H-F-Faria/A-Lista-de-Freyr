import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Button, Form } from 'react-bootstrap';
import getCroppedImg from '../utils/cropImage';

export default function ModalAlterarFoto({ show, onClose, onSalvar, onRemover, imagemAtual }) {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSalvar = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels);
    onSalvar(croppedImage);
  };

  const handleImagemSelecionada = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const reset = () => {
    setImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Alterar Foto de Perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!image ? (
          <>
            <input type="file" accept="image/*" onChange={handleImagemSelecionada} />
            {imagemAtual && (
              <div className="mt-3">
                <img src={imagemAtual} alt="Atual" className="rounded" width="100" />
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ position: 'relative', width: '100%', height: 400 }}>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <Form.Group className="mt-3">
              <Form.Label>Zoom</Form.Label>
              <Form.Range
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => { reset(); onClose(); }}>
          Cancelar
        </Button>
        {imagemAtual && (
          <Button variant="danger" onClick={onRemover}>
            Remover Imagem
          </Button>
        )}
        {image && (
          <Button variant="primary" onClick={handleSalvar}>
            Salvar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}