import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trash, Pencil, BoxArrowInRight } from 'react-bootstrap-icons';
import Layout from '../components/Layout';
import ModalCriarCampanha from '../components/ModalCriarCampanha';
import ModalEntrarCampanha from '../components/ModalEntrarCampanha';


const coresSistema = {
  'D&D': '#dc3545',
  'Tormenta': '#ffc107',
  'Sistema Próprio': '#0d6efd',
};

const logosSistema = {
  'D&D': '/logos/d&d.png',
  'Tormenta': '/logos/tormenta.png',
  'Sistema Próprio': '/logos/sistema-proprio.png',
};

export default function Dashboard() {
  const [usuario, setUsuario] = useState(null);
  const [modalAberta, setModalAberta] = useState(false);
  const [campanhasMestre, setCampanhasMestre] = useState([]);
  const [campanhasJogador, setCampanhasJogador] = useState([]);
  const [modalEntrarAberta, setModalEntrarAberta] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dadosUsuario = localStorage.getItem('usuario');
    if (!dadosUsuario) {
      navigate('/');
      return;
    }
    setUsuario(JSON.parse(dadosUsuario));
  }, [navigate]);

  useEffect(() => {
    if (!usuario) return;

    const token = localStorage.getItem('token');

    const fetchCampanhas = async () => {
      try {
        const res = await fetch('http://localhost:3001/campanhas', {
          headers: { Authorization: token },
        });
        if (!res.ok) throw new Error('Falha ao buscar campanhas');
        const data = await res.json();

        const mestre = data.filter(c => c.mestreId === usuario.id);
        const jogador = data.filter(c => Array.isArray(c.jogadores) && c.jogadores.includes(usuario.id));

        setCampanhasMestre(mestre);
        setCampanhasJogador(jogador);
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar campanhas');
      }
    };

    fetchCampanhas();
  }, [usuario]);

  const criarCampanha = async ({ nome, sistema }) => {
    setModalAberta(false);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:3001/campanhas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({ nome, sistema }),
      });

      if (res.ok) {
        const novaCampanha = await res.json();
        alert(`Campanha criada! Código: ${novaCampanha.codigo}`);
        setCampanhasMestre(prev => [...prev, novaCampanha]);
      } else {
        const msg = await res.text();
        alert('Erro ao criar campanha: ' + msg);
      }
    } catch {
      alert('Erro de conexão com o servidor.');
    }
  };

  const entrarCampanha = async (codigo) => {
    const token = localStorage.getItem('token');
    setModalEntrarAberta(false);

    try {
      const res = await fetch('http://localhost:3001/campanhas/entrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ codigo }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.mensagem || 'Você entrou na campanha!');
        setCampanhasJogador(prev => [...prev, data.campanha]);
      } else {
        alert(data || 'Erro ao entrar na campanha');
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o servidor');
    }
  };

  const handleDeletar = async (campanha) => {
    if (!window.confirm(`Tem certeza que deseja deletar a campanha "${campanha.nome}"?`)) return;

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:3001/campanhas/${campanha._id || campanha.id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });

      if (res.ok) {
        alert('Campanha deletada com sucesso!');
        // Atualizar listas removendo a campanha deletada
        setCampanhasMestre(prev => prev.filter(c => c._id !== campanha._id));
        setCampanhasJogador(prev => prev.filter(c => c._id !== campanha._id));
      } else {
        const msg = await res.text();
        alert('Erro ao deletar campanha: ' + msg);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao conectar com o servidor');
    }
  };

  const handleEditar = (campanha) => {
    // Aqui você pode abrir um modal para editar ou navegar para uma página de edição
    alert(`Editar campanha "${campanha.nome}" - ainda não implementado.`);
  };

  const handleAcessar = (campanha) => {
    // Navegar para a página da campanha (exemplo: /campanha/:codigo)
    navigate(`/campanha/${campanha.codigo}`);
  };

  const renderCampanhaBox = (campanha) => (
    <div
      key={campanha._id || campanha.id}
      className="card row mb-2 p-3 d-flex align-items-start justify-content-between"
      style={{
        borderLeft: `5px solid ${coresSistema[campanha.sistema] || '#6c757d'}`,
        cursor: 'default',
        gap: '0px',
      }}
    >
      {/* Lado esquerdo: logo + info */}
      <div className="d-flex align-items-center gap-3" style={{ flex: 1 }}>
        <img
          src={logosSistema[campanha.sistema] || '/logos/default.png'}
          alt={`${campanha.sistema} logo`}
          style={{ width: 50, height: 50, objectFit: 'contain' }}
        />
        <div>
          <h6 className="mb-1">{campanha.nome}</h6>
          <small className="text-muted">{campanha.sistema}</small><br />
          <small>Código: {campanha.codigo}</small>
        </div>
        <h6 className="d-flex gap-1 ms-auto">Jogadores 0/8</h6>
        {/* Editar isso e conectar com o banco */}
      </div>

      {/* Lado direito: botões em coluna */}
      <div className="d-flex align-items-center gap-1 ms-auto">
        
        <button
          className="btn btn-sm btn-primary"
          onClick={() => handleAcessar(campanha)}
          title="Acessar Campanha"
          style={{ width: 36, height: 36, padding: 0 }}
        >
          <BoxArrowInRight size={20} />
        </button>
        <button
          className="btn btn-sm btn-warning"
          onClick={() => handleEditar(campanha)}
          title="Editar Campanha"
          style={{ width: 36, height: 36, padding: 0 }}
        >
          <Pencil size={20} />
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDeletar(campanha)}
          title="Deletar Campanha"
          style={{ width: 36, height: 36, padding: 0 }}
        >
          <Trash size={20} />
        </button>
      </div>
    </div>
  );

  if (!usuario) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <Layout usuario={usuario}>
      <div className="container py-4">
        <div className="row">
          <div className="col-md-5">
            <h5>Suas Campanhas como Mestre</h5>
            {campanhasMestre.length === 0 && (
              <div className="alert alert-info d-flex justify-content-between align-items-center">
                Nenhuma campanha criada ainda.
                <button className="btn btn-sm btn-primary" onClick={() => setModalAberta(true)}>
                  Criar Campanha
                </button>
              </div>
            )}
            {campanhasMestre.map(renderCampanhaBox)}
          </div>

          <div className="col-md-5">
            <h5>Campanhas que você participa</h5>
            {campanhasJogador.length === 0 && (
              <div className="alert alert-secondary d-flex justify-content-between align-items-center">
                Nenhuma campanha encontrada.
                <button className="btn btn-sm btn-success" onClick={() => setModalEntrarAberta(true)}>
                  Entrar com Código
                </button>
              </div>
            )}
            {campanhasJogador.map(renderCampanhaBox)}
          </div>
        </div>

        <ModalCriarCampanha
          aberto={modalAberta}
          onFechar={() => setModalAberta(false)}
          onCriar={criarCampanha}
        />

        <ModalEntrarCampanha
          aberto={modalEntrarAberta}
          onFechar={() => setModalEntrarAberta(false)}
          onEntrar={entrarCampanha}
        />
      </div>
    </Layout>
  );
}