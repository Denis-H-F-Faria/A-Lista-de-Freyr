import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthRedirect from '../hooks/useAuthRedirect';
import Header from '../components/Header'; // ajuste o caminho conforme seu projeto

export default function Login() {
  useAuthRedirect(); // 🔒 redireciona se estiver logado

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [erro, setErro] = useState('');
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Carrega usuário (pode estar null)
    const dadosUsuario = localStorage.getItem('usuario');
    setUsuario(dadosUsuario ? JSON.parse(dadosUsuario) : null);

    // Preenche lembrar dados se estiver salvo
    const emailSalvo = localStorage.getItem('lembrarEmail');
    const senhaSalva = localStorage.getItem('lembrarSenha');
    const lembrarSalvo = localStorage.getItem('lembrar');

    if (lembrarSalvo === 'true') {
      setLembrar(true);
      if (emailSalvo) setEmail(emailSalvo);
      if (senhaSalva) setSenha(senhaSalva);
    } else {
      setLembrar(false);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) return setErro('Email ou senha inválidos.');

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      localStorage.setItem('lembrar', lembrar);
      if (lembrar) {
        localStorage.setItem('lembrarEmail', email);
        localStorage.setItem('lembrarSenha', senha);
      } else {
        localStorage.removeItem('lembrarEmail');
        localStorage.removeItem('lembrarSenha');
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Erro no login:', err);
      setErro('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <>
      <Header usuario={usuario} />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-4" style={{ minWidth: '300px' }}>
          <h2 className="mb-4 text-center">Login</h2>

          {erro && <div className="alert alert-danger text-center">{erro}</div>}

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
                tabIndex={-1}
              >
                <i className={`bi ${mostrarSenha ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="lembrar"
              checked={lembrar}
              onChange={(e) => setLembrar(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="lembrar">
              Lembrar meus dados
            </label>
          </div>

          <button className="btn btn-primary w-100" onClick={handleLogin}>
            Entrar
          </button>

          <p className="mt-3 text-center">
            Não tem conta? <a href="/register">Cadastrar</a>
          </p>
        </div>
      </div>
    </>
  );
}