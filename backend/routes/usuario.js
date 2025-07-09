const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// POST /usuario/register
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send('Todos os campos são obrigatórios');
  }

  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    return res.status(409).send('Email já cadastrado');
  }

  const senhaHash = await bcrypt.hash(senha, 10);

  const novoUsuario = new Usuario({
    nome,
    email,
    senha: senhaHash,
  });

  await novoUsuario.save();

  res.status(201).send('Usuário cadastrado com sucesso');
});

// POST /usuario/login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) return res.status(401).send('Credenciais inválidas');

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) return res.status(401).send('Credenciais inválidas');

  const token = jwt.sign({ id: usuario._id }, 'segredo123', { expiresIn: '1d' });

  res.json({
    token,
    usuario: {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
    },
  });
});

module.exports = router;