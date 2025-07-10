import express from 'express';
import jwt from 'jsonwebtoken';
import Campanha from '../models/campanha.js';

const router = express.Router();

// Middleware para verificar token
function autenticar(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Token ausente');

  try {
    const decoded = jwt.verify(token, 'segredo123');
    req.usuarioId = decoded.id;
    next();
  } catch {
    return res.status(401).send('Token inválido');
  }
}

// Gera código de 6 letras aleatórias
function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// POST /campanhas - criar nova campanha
router.post('/', autenticar, async (req, res) => {
  const { nome } = req.body;
  const codigo = gerarCodigo();

  try {
    const campanha = new Campanha({
      nome,
      mestreId: req.usuarioId,
      codigo,
      jogadores: [],
    });

    await campanha.save();
    res.status(201).json(campanha);
  } catch (err) {
    res.status(500).send('Erro ao criar campanha');
  }
});

export default router;