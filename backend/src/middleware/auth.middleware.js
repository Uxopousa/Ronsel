import { verifyToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';

export default function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new ApiError(401, 'Token no proporcionado');
  }

  const token = header.split(' ')[1];
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch {
    throw new ApiError(401, 'Token inválido o expirado');
  }
}
