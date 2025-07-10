import mongoose from 'mongoose';

const campanhaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  mestreId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  codigo: { type: String, required: true, unique: true },
  jogadores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }],
});

const Campanha = mongoose.model('Campanha', campanhaSchema);

export default Campanha;