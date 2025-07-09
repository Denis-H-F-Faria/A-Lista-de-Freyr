import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (!res.ok) return alert('Falha no login');

    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    navigate('/dashboard');
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
        <input
          type="password"
          className="form-control"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
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
