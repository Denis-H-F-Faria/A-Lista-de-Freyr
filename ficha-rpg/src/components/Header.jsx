import { Link, useNavigate } from 'react-router-dom';
import { FaDiceD20, FaUserCircle } from 'react-icons/fa';

export default function Header({ usuario }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="bg-primary text-light shadow-sm fixed-top">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="d-flex align-items-center gap-2">
          <FaDiceD20 size={30} />
          <h4 className="m-0">A Lista de Freyr</h4>
        </div>

        <nav className="d-flex gap-3 align-items-center">
          {usuario ? (
            <>
              <Link to="/dashboard" className="btn btn-light btn-sm">Dashboard</Link>
              
              {/* Dropdown do usuário */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  data-bs-toggle="dropdown"
                >
                  <span>{usuario.nome}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => navigate('/configuracoes')}
                      type="button"
                    >
                      Configurações
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={logout}>
                      Sair
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link to="/" className="btn btn-light btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-light btn-sm">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}