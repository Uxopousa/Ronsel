import prisma from '../prisma/index.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';

export async function register(data) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new ApiError(400, 'El email ya está registrado');
  }

  const hashed = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name,
    },
  });

  const token = signToken({ id: user.id });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function login(data) {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const valid = await comparePassword(data.password, user.password);
  if (!valid) {
    throw new ApiError(401, 'Credenciales inválidas');
  }

  const token = signToken({ id: user.id });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!user) throw new ApiError(404, 'Usuario no encontrado');
  return user;
}
