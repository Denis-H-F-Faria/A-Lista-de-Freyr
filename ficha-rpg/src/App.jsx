import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Ficha from './pages/ficha';
import Configuracoes from './pages/configuracoes';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ficha" element={<Ficha />} />

          {/* Privadas */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/configuracoes" element={
            <PrivateRoute><Configuracoes /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default App;