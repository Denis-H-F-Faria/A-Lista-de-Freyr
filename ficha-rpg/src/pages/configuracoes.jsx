import { useEffect, useState } from 'react';
import Layout from '../components/layout';

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
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const novoUsuario = { ...usuario, foto: base64 };
        localStorage.setItem('usuario', JSON.stringify(novoUsuario));
        setUsuario(novoUsuario);
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