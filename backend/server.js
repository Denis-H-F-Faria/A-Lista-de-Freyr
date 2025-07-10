import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import usuarioRoutes from './routes/usuario.js';
import campanhasRoutes from './routes/campanhas.js';

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/a_lista_de_freyr')
  .then(() => console.log('MongoDB conectado ao banco a_lista_de_freyr'))
  .catch(err => console.error('Erro na conexão MongoDB:', err));

app.use('/usuario', usuarioRoutes);
app.use('/campanhas', campanhasRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});