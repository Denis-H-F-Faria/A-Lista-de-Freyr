const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'segredo_supersecreto'; // em produção, use variável de ambiente

app.use(cors());
app.use(express.json());

const CAMINHO_ARQUIVO = path.join(__dirname, 'usuarios.json');

// Carrega os usuários salvos do arquivo ao iniciar
let usuarios = [];
let proximoId = 1;

try {
  if (fs.existsSync(CAMINHO_ARQUIVO)) {
    const dados = fs.readFileSync(CAMINHO_ARQUIVO, 'utf8');
    usuarios = JSON.parse(dados);
    proximoId = usuarios.reduce((max, u) => Math.max(max, u.id), 0) + 1;
    console.log(`Usuários carregados (${usuarios.length})`);
  }
} catch (err) {
  console.error('Erro ao carregar usuarios.json:', err.message);
}

// Função para salvar os usuários no arquivo
function salvarUsuarios() {
  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(usuarios, null, 2));
}

// Rota de registro
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Campos obrigatórios: nome, email, senha');
  }

  const existe = usuarios.find(u => u.email === email);
  if (existe) return res.status(400).send('Usuário já existe');

  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = {
    id: proximoId++,
    nome,
    email,
    senha: senhaHash,
    campanhasCriadas: [],
    campanhasParticipando: []
  };

  usuarios.push(novoUsuario);
  salvarUsuarios();

  res.send('Usuário registrado com sucesso');
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return res.status(400).send('Usuário não encontrado');

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) return res.status(401).send('Senha incorreta');

  const token = jwt.sign(
    { id: usuario.id, nome: usuario.nome, email: usuario.email },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email
    }
  });
});

// Rota protegida de teste
app.get('/perfil', autenticarToken, (req, res) => {
  res.send(`Bem-vindo, ${req.usuario.nome}`);
});

// Middleware para verificar o token
function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) return res.sendStatus(403);
    req.usuario = usuario;
    next();
  });
}

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
