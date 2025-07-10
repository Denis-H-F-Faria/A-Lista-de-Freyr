import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function Configuracoes() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('usuario');
    if (saved) setUsuario(JSON.parse(saved));
  }, []);

  const atualizarFoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result;

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

          if (!res.ok) {
            const msg = await res.text();
            alert(`Erro ao atualizar foto: ${msg}`);
            return;
          }

          // Atualiza localStorage e state com a nova imagem
          const novoUsuario = { ...usuario, imagemPerfil: base64 };
          localStorage.setItem('usuario', JSON.stringify(novoUsuario));
          setUsuario(novoUsuario);
        } catch (err) {
          console.error(err);
          alert('Erro ao atualizar foto. Tente novamente.');
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
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
            {usuario.foto ? (
              <img
                src={usuario.foto}
                alt="Foto"
                className="rounded-circle border"
                style={{ width: 80, height: 80, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary d-flex justify-content-center align-items-center"
                style={{ width: 80, height: 80 }}
              >
                <span className="text-white">{usuario.nome[0]}</span>
              </div>
            )}
            <button className="btn btn-outline-primary" onClick={atualizarFoto}>
              Alterar Foto
            </button>
          </div>
        </div>
        {/* Você pode adicionar outras configurações aqui */}
      </div>
    </Layout>
  );
}