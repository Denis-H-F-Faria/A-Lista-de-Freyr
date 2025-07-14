import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Trash, Pencil, BoxArrowInRight } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ModalCriarCampanha from '../components/ModalCriarCampanha';
import ModalEntrarCampanha from '../components/ModalEntrarCampanha';
import ConfirmModal from '../components/ConfirmModal';

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
  const [modalEntrarAberta, setModalEntrarAberta] = useState(false);
  const [campanhasMestre, setCampanhasMestre] = useState([]);
  const [campanhasJogador, setCampanhasJogador] = useState([]);
  const [campanhaParaDeletar, setCampanhaParaDeletar] = useState(null);
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
        toast.error('Erro ao carregar campanhas');
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
          Authorization: token,
        },
        body: JSON.stringify({ nome, sistema }),
      });

      if (res.ok) {
        const novaCampanha = await res.json();
        toast.success(`Campanha criada com sucesso! Código: ${novaCampanha.codigo}`);
        setCampanhasMestre(prev => [...prev, novaCampanha]);
      } else {
        const msg = await res.text();
        toast.error('Erro ao criar campanha: ' + msg);
      }
    } catch {
      toast.error('Erro de conexão com o servidor.');
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
        toast.success(data.mensagem || 'Você entrou na campanha!');
        setCampanhasJogador(prev => [...prev, data.campanha]);
      } else {
        toast.warn(data.mensagem || 'Erro ao entrar na campanha');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao conectar com o servidor');
    }
  };

  const handleDeletarClick = (campanha) => {
    setCampanhaParaDeletar(campanha);
  };

  const confirmarDelecao = async () => {
    const token = localStorage.getItem('token');
    const campanha = campanhaParaDeletar;

    try {
      const res = await fetch(`http://localhost:3001/campanhas/${campanha._id || campanha.id}`, {
        method: 'DELETE',
        headers: { Authorization: token },
      });

      if (res.ok) {
        toast.success('Campanha deletada com sucesso!');
        setCampanhasMestre(prev => prev.filter(c => c._id !== campanha._id));
        setCampanhasJogador(prev => prev.filter(c => c._id !== campanha._id));
      } else {
        const msg = await res.text();
        toast.error('Erro ao deletar campanha: ' + msg);
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setCampanhaParaDeletar(null);
    }
  };

  const handleEditar = (campanha) => {
    toast.info(`Função de editar "${campanha.nome}" ainda não implementada.`);
  };

  const handleAcessar = (campanha) => {
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
        <h6 className="d-flex gap-1 ms-auto">
          Jogadores {Array.isArray(campanha.jogadores) ? campanha.jogadores.length : 0}/8
        </h6>
      </div>
      <div className="d-flex align-items-center gap-1 justify-content-end">
        <button className="btn btn-sm btn-primary" onClick={() => handleAcessar(campanha)} title="Acessar Campanha" style={{ width: 36, height: 36, padding: 0 }}>
          <BoxArrowInRight size={20} />
        </button>
        <button className="btn btn-sm btn-warning" onClick={() => handleEditar(campanha)} title="Editar Campanha" style={{ width: 36, height: 36, padding: 0 }}>
          <Pencil size={20} />
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => handleDeletarClick(campanha)} title="Deletar Campanha" style={{ width: 36, height: 36, padding: 0 }}>
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
            <div
              className="card row mb-2 p-3 d-flex align-items-center justify-content-center text-muted"
              style={{
                backgroundColor: '#e0e0e0ff',
                cursor: 'pointer',
                height: '100px',
                minHeight: 100,
              }}
              onClick={() => setModalAberta(true)}
            >
              <h2 className="m-0">
                <span className="text-secondary">+</span>
              </h2>
            </div>
            {campanhasMestre.map(renderCampanhaBox)}
          </div>

          <div className="col-md-5">
            <h5>Suas Campanhas como Jogador</h5>
            <div
              className="card row mb-2 p-4 d-flex align-items-center justify-content-center text-muted"
              style={{
                backgroundColor: '#f1f1f1',
                border: '2px dashed #aaa',
                cursor: 'pointer',
                minHeight: 100,
              }}
              onClick={() => setModalEntrarAberta(true)}
            >
              <h2 style={{ margin: 0, fontSize: '2rem' }}>
                <span className="text-secondary">+</span>
              </h2>
            </div>
            {campanhasJogador.map(renderCampanhaBox)}
          </div>
        </div>

        <ModalCriarCampanha aberto={modalAberta} onFechar={() => setModalAberta(false)} onCriar={criarCampanha} />
        <ModalEntrarCampanha aberto={modalEntrarAberta} onFechar={() => setModalEntrarAberta(false)} onEntrar={entrarCampanha} />

        <ConfirmModal
          show={!!campanhaParaDeletar}
          onHide={() => setCampanhaParaDeletar(null)}
          onConfirm={confirmarDelecao}
          titulo="Deletar Campanha"
          mensagem={`Tem certeza que deseja deletar a campanha "${campanhaParaDeletar?.nome}"?`}
        />
      </div>
    </Layout>
  );
}