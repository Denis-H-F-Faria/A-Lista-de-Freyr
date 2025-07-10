import { useState } from 'react';

export default function ModalEntrarCampanha({ aberto, onFechar, onEntrar }) {
  const [codigo, setCodigo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!codigo.trim()) return alert('Digite um código válido');
    onEntrar(codigo.trim().toUpperCase());
    setCodigo('');
  };

  if (!aberto) return null;

  return (
    <div
      className="modal d-flex justify-content-center align-items-center"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1050
      }}
      onClick={onFechar}
    >
      <div
        className="card p-4"
        style={{ maxWidth: 400, width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <h5 className="mb-3">Entrar em Campanha</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Código da Campanha</label>
            <input
              type="text"
              className="form-control"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              autoFocus
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onFechar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-success">
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}