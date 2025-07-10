import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  imagemPerfil: { type: String, default: '' }, // novo campo opcional para foto
});

const Usuario = mongoose.model('Usuario', usuarioSchema, 'user');

export default Usuario;