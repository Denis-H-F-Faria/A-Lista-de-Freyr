import express from 'express';
import Usuario from '../models/usuario.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authMiddleware from '../middlewares/auth.js';
import Joi from 'joi';

const router = express.Router();

// 🔒 Schemas de validação
const schemaRegistro = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).max(30).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().required(),
});

// POST /usuario/register
router.post('/register', async (req, res) => {
  const { error } = schemaRegistro.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nome, email, senha } = req.body;

  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) return res.status(409).send('Email já cadastrado');

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
  const { error } = schemaLogin.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, senha } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) return res.status(401).send('Credenciais inválidas');

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) return res.status(401).send('Credenciais inválidas');

  const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({
    token,
    usuario: {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      imagemPerfil: usuario.imagemPerfil || null,
    },
  });
});

// PUT /usuario/perfil/imagem
router.put('/perfil/imagem', authMiddleware, async (req, res) => {
  try {
    const { imagemPerfil } = req.body;
    if (!imagemPerfil) return res.status(400).send('Imagem não fornecida');

    await Usuario.findByIdAndUpdate(req.usuarioId, { imagemPerfil });

    res.status(200).send('Imagem atualizada com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar imagem');
  }
});

export default router;