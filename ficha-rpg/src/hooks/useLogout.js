import { useNavigate } from 'react-router-dom';

export default function useLogout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/');
  };

  return logout;
}