import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from '../utils/auth';

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

  const criarCampanha = async () => {
    const nome = prompt('Digite o nome da campanha:');
    if (!nome) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3001/campanhas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ nome }),
      });

      if (res.ok) {
        const novaCampanha = await res.json();
        alert(`Campanha criada! Código: ${novaCampanha.codigo}`);
        // Aqui você pode atualizar a lista de campanhas se desejar
      } else {
        const msg = await res.text();
        alert('Erro ao criar campanha: ' + msg);
      }
    } catch (err) {
      console.error('Erro ao criar campanha:', err);
      alert('Erro de conexão com o servidor.');
    }
  };

  if (!usuario) return null;

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="m-0">Olá, {usuario.nome} 👋</h2>
          <button className="btn btn-outline-danger" onClick={logout}>
            Sair
          </button>
        </div>

        <div className="mb-4">
          <h5>Suas Campanhas como Mestre</h5>
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            Nenhuma campanha criada ainda.
            <button className="btn btn-sm btn-primary" onClick={criarCampanha}>
              Criar Campanha
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h5>Campanhas que você participa</h5>
          <div className="alert alert-secondary d-flex justify-content-between align-items-center">
            Nenhuma campanha encontrada.
            <button className="btn btn-sm btn-success">
              Entrar com Código
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}