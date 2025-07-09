const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/a_lista_de_freyr')
.then(() => console.log('MongoDB conectado ao banco a_lista_de_freyr'))
.catch(err => console.error('Erro na conexão MongoDB:', err));

// Importar rotas de usuário e campanhas (exemplo)
const usuarioRoutes = require('./routes/usuario');
const campanhasRoutes = require('./routes/campanhas');

app.use('/usuario', usuarioRoutes);
app.use('/campanhas', campanhasRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});