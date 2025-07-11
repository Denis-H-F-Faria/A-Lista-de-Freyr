import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Token não fornecido');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = payload.id;
    next();
  } catch (err) {
    return res.status(401).send('Token inválido ou expirado');
  }
}