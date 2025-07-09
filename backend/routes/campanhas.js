const express = require('express');
const router = express.Router();
const Campanha = require('../models/campanha');
const jwt = require('jsonwebtoken');

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

module.exports = router;
