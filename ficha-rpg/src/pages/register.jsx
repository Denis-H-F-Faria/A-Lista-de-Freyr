import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthRedirect from '../hooks/useAuthRedirect';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { registerSchema } from '../schemas/auth';
import { toast } from 'react-toastify';

export default function Register() {
  useAuthRedirect();
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  useEffect(() => {
    const dadosUsuario = localStorage.getItem('usuario');
    setUsuario(dadosUsuario ? JSON.parse(dadosUsuario) : null);
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await fetch('http://localhost:3001/usuario/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const msg = await res.text();
        return alert(`Erro: ${msg}`);
      }

      toast.success('Cadastro realizado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Erro no cadastro:', err);
      toast.error('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <>
      <Header usuario={usuario} />
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="mb-4 text-center">Cadastro</h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label>Nome</label>
              <input className="form-control" {...register('nome')} />
              {errors.nome && <small className="text-danger">{errors.nome.message}</small>}
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" {...register('email')} />
              {errors.email && <small className="text-danger">{errors.email.message}</small>}
            </div>

            <div className="mb-3">
              <label>Senha</label>
              <input type="password" className="form-control" {...register('senha')} />
              {errors.senha && <small className="text-danger">{errors.senha.message}</small>}
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Cadastrar
            </button>
          </form>

          <p className="mt-3 text-center">
            Já tem conta? <a href="/">Entrar</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}