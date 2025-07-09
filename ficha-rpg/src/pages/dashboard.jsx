import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dadosUsuario = localStorage.getItem('usuario');
    if (!dadosUsuario) {
      navigate('/');
      return;
    }
    setUsuario(JSON.parse(dadosUsuario));
  }, [navigate]);

  const sair = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!usuario) return null;

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Olá, {usuario.nome} 👋</h2>
          <button className="btn btn-outline-danger" onClick={sair}>
            Sair
          </button>
        </div>

        <div className="mb-4">
          <h5>Suas Campanhas como Mestre</h5>
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            Nenhuma campanha criada ainda.
            <button className="btn btn-sm btn-primary">Criar Campanha</button>
          </div>
        </div>

        <div className="mb-4">
          <h5>Campanhas que você participa</h5>
          <div className="alert alert-secondary d-flex justify-content-between align-items-center">
            Nenhuma campanha encontrada.
            <button className="btn btn-sm btn-success">Entrar com Código</button>
          </div>
        </div>
      </div>
    </div>
  );
}