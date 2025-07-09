import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha }),
    });

    if (res.ok) {
      alert('Cadastro realizado com sucesso');
      navigate('/');
    } else {
      const msg = await res.text();
      alert('Erro ao cadastrar: ' + msg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card">
        <h2>Cadastro</h2>

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
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
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