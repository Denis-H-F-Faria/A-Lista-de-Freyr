import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ModalAlterarFoto from '../components/ModalAlterarFoto';

export default function Configuracoes() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarModalFoto, setMostrarModalFoto] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('usuario');
    if (saved) setUsuario(JSON.parse(saved));
  }, []);

  const salvarNovaImagem = async (base64) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/usuario/perfil/imagem', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ imagemPerfil: base64 }),
      });

      if (res.ok) {
        const novoUsuario = { ...usuario, imagemPerfil: base64 };
        localStorage.setItem('usuario', JSON.stringify(novoUsuario));
        setUsuario(novoUsuario);
        setMostrarModalFoto(false);
      } else {
        const msg = await res.text();
        alert('Erro ao salvar imagem: ' + msg);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar imagem');
    }
  };

  const removerImagem = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3001/usuario/perfil/imagem', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ imagemPerfil: null }), // ⬅️ ENVIA NULL, não string vazia
      });

      if (res.ok) {
        const novoUsuario = { ...usuario, imagemPerfil: null };
        localStorage.setItem('usuario', JSON.stringify(novoUsuario));
        setUsuario(novoUsuario);
        setMostrarModalFoto(false);
      } else {
        const msg = await res.text();
        alert('Erro ao remover imagem: ' + msg);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao remover imagem');
    }
  };

  if (!usuario) return null;

  return (
    <Layout usuario={usuario}>
      <div className="container py-5">
        <h3>Configurações de Perfil</h3>
        <hr />
        <div className="mb-4">
          <label className="form-label">Foto de Perfil</label>
          <div className="d-flex align-items-center gap-3">
            {usuario.imagemPerfil ? (
              <img
                src={usuario.imagemPerfil}
                alt="Foto"
                className="rounded-circle border"
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary d-flex justify-content-center align-items-center text-white"
                style={{ width: 80, height: 80 }}
              >
                <span>{usuario.nome[0]}</span>
              </div>
            )}
            <button className="btn btn-outline-primary" onClick={() => setMostrarModalFoto(true)}>
              Alterar Foto
            </button>
          </div>
        </div>

        <ModalAlterarFoto
          show={mostrarModalFoto}
          onClose={() => setMostrarModalFoto(false)}
          onSalvar={salvarNovaImagem}
          onRemover={removerImagem}
          imagemAtual={usuario.imagemPerfil}
        />
      </div>
    </Layout>
  );
}