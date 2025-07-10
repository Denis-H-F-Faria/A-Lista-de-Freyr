import express from 'express';
import jwt from 'jsonwebtoken';
import Campanha from '../models/campanha.js';

const router = express.Router();

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

function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

router.post('/', autenticar, async (req, res) => {
  const { nome, sistema } = req.body;  // <-- corrigido aqui
  const codigo = gerarCodigo();

  if (!nome || !sistema) {
    return res.status(400).send('Nome e sistema são obrigatórios');
  }

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

router.get('/', autenticar, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;

    const campanhas = await Campanha.find({
      $or: [
        { mestreId: usuarioId },
        { jogadores: usuarioId }
      ]
    }).lean();

    res.json(campanhas);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar campanhas');
  }
});

// DELETE /campanhas/:id - deletar campanha pelo mestre
router.delete('/:id', autenticar, async (req, res) => {
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