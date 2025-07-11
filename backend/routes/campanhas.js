import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import Campanha from '../models/campanha.js';

const router = express.Router();

// Middleware de autenticação
function autenticar(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Token ausente');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch {
    return res.status(401).send('Token inválido');
  }
}

// Função para gerar código de 6 caracteres
function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Joi Schemas
const schemaNovaCampanha = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  sistema: Joi.string().valid('D&D', 'Tormenta', 'Sistema Próprio').required(),
});

const schemaIdParam = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

// POST /campanhas - Criar campanha
router.post('/', autenticar, async (req, res) => {
  const { error } = schemaNovaCampanha.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { nome, sistema } = req.body;
  const codigo = gerarCodigo();

  try {
    const campanha = new Campanha({
      nome,
      sistema,
      mestreId: req.usuarioId,
      codigo,
      jogadores: [],
    });

    await campanha.save();
    res.status(201).json(campanha);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao criar campanha');
  }
});

// GET /campanhas - Listar campanhas do usuário
router.get('/', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;

    const campanhas = await Campanha.find({
      $or: [
        { mestreId: usuarioId },
        { jogadores: usuarioId },
      ],
    }).lean();

    res.json(campanhas);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar campanhas');
  }
});

// DELETE /campanhas/:id - Deletar campanha (apenas mestre)
router.delete('/:id', autenticar, async (req, res) => {
  const { error } = schemaIdParam.validate(req.params);
  if (error) return res.status(400).send('ID inválido');

  try {
    const campanha = await Campanha.findById(req.params.id);
    if (!campanha) return res.status(404).send('Campanha não encontrada');

    if (campanha.mestreId.toString() !== req.usuarioId) {
      return res.status(403).send('Apenas o mestre pode deletar a campanha');
    }

    await Campanha.findByIdAndDelete(req.params.id);
    res.status(200).send('Campanha deletada com sucesso');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar campanha');
  }
});

export default router;