import { useState } from 'react';

export default function ModalCriarCampanha({ aberto, onFechar, onCriar }) {
  const [nome, setNome] = useState('');
  const [sistema, setSistema] = useState('');

  const sistemasDisponiveis = ['D&D', 'Tormenta', 'Sistema Próprio'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return alert('Digite o nome da campanha.');
    if (!sistemasDisponiveis.includes(sistema)) return alert('Escolha um sistema válido.');
    onCriar({ nome, sistema });
    // Limpa os campos após criar (opcional)
    setNome('');
    setSistema('');
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
        <h5 className="mb-3">Criar Nova Campanha</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Nome da Campanha</label>
            <input 
              type="text" 
              className="form-control" 
              value={nome}
              onChange={e => setNome(e.target.value)} 
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label>Sistema</label>
            <select 
              className="form-select"
              value={sistema}
              onChange={e => setSistema(e.target.value)}
            >
              <option value="">Selecione um sistema</option>
              {sistemasDisponiveis.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onFechar}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Criar</button>
          </div>
        </form>
      </div>
    </div>
  );
}