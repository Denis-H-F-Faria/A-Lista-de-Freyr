import { useEffect, useState } from 'react';

function App() {
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001')
      .then(res => res.text())
      .then(data => setMensagem(data))
      .catch(err => {
        console.error('Erro ao conectar com o backend:', err);
        setMensagem('Erro ao conectar com o servidor.');
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Ficha Interativa de RPG</h1>
      <p><strong>Resposta do backend:</strong> {mensagem}</p>
    </div>
  );
}

export default App;
