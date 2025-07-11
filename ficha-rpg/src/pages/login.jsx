import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthRedirect from '../hooks/useAuthRedirect';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { loginSchema } from '../schemas/auth';

export default function Login() {
  useAuthRedirect();
  const navigate = useNavigate();

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [erroLogin, setErroLogin] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    const dadosUsuario = localStorage.getItem('usuario');
    setUsuario(dadosUsuario ? JSON.parse(dadosUsuario) : null);

    const emailSalvo = localStorage.getItem('lembrarEmail');
    const senhaSalva = localStorage.getItem('lembrarSenha');
    const lembrarSalvo = localStorage.getItem('lembrar');

    if (lembrarSalvo === 'true') {
      setLembrar(true);
      if (emailSalvo) setValue('email', emailSalvo);
      if (senhaSalva) setValue('senha', senhaSalva);
    }
  }, [setValue]);

  const onSubmit = async ({ email, senha }) => {
    setErroLogin('');
    try {
      const res = await fetch('http://localhost:3001/usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!res.ok) return setErroLogin('Email ou senha inválidos.');

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
      setErroLogin('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <>
      <Header usuario={usuario} />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-4" style={{ minWidth: '300px' }}>
          <h2 className="mb-4 text-center">Login</h2>

          {erroLogin && <div className="alert alert-danger text-center">{erroLogin}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" {...register('email')} />
              {errors.email && <small className="text-danger">{errors.email.message}</small>}
            </div>

            <div className="mb-3">
              <label>Senha</label>
              <div className="input-group">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  className="form-control"
                  {...register('senha')}
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
              {errors.senha && <small className="text-danger">{errors.senha.message}</small>}
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

            <button className="btn btn-primary w-100" type="submit">
              Entrar
            </button>
          </form>

          <p className="mt-3 text-center">
            Não tem conta? <a href="/register">Cadastrar</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}