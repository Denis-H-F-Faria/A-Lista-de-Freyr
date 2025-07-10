export function logout(navigate) {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  navigate('/');
}