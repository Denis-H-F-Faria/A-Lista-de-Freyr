import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) return alert('Falha no login');

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
      alert('Erro inesperado. Tente novamente.');
    }
  };

  return (
  <div className="d-flex justify-content-center align-items-center min-vh-100">
    <div className="card">
      <h2>Login</h2>

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

      <button className="btn btn-primary w-100" onClick={handleLogin}>
        Entrar
      </button>

      <p className="mt-3 text-center">
        Não tem conta? <a href="/register">Cadastrar</a>
      </p>
    </div>
  </div>
);
}
