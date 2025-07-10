import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:3001/usuario/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (!res.ok) {
        const msg = await res.text();
        return alert(`Erro: ${msg}`);
      }

      alert('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Erro no cadastro:', err);
      alert('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4">Cadastro</h2>

        <div className="mb-3">
          <label>Nome</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Senha</label>
          <div className="input-group">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              className="form-control"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              <i className={`bi ${mostrarSenha ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
        </div>

        <button className="btn btn-primary w-100" onClick={handleRegister}>
          Cadastrar
        </button>

        <p className="mt-3 text-center">
          Já tem conta? <a href="/">Entrar</a>
        </p>
      </div>
    </div>
  );
}