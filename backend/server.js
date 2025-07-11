import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import 'dotenv/config';

import usuarioRoutes from './routes/usuario.js';
import campanhasRoutes from './routes/campanhas.js';

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado ao banco a_lista_de_freyr'))
  .catch(err => console.error('Erro na conexão MongoDB:', err));

app.use('/usuario', usuarioRoutes);
app.use('/campanhas', campanhasRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});