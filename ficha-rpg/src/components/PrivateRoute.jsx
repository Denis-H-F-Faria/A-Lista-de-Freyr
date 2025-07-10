// src/components/PrivateRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Toast from './Toast';

// Função auxiliar para decodificar um JWT e pegar o payload
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (!token || !usuario) {
      setAutorizado(false);
      setLoading(false);
      return;
    }

    const payload = decodeJWT(token);

    if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setErro('Sessão expirada. Faça login novamente.');
      setAutorizado(false);
      setLoading(false);
      return;
    }

    setAutorizado(true);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {erro && (
        <Toast
          message={erro}
          type="error"
          onClose={() => setErro('')}
        />
      )}
      {autorizado ? children : <Navigate to="/" replace />}
    </>
  );
}