// src/hooks/useAuthRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function useAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      navigate('/dashboard');
    }
  }, [navigate]);
}