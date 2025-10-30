import { Router, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { z } from 'zod';
import { User } from '../models';
import { hashPassword, verifyPassword } from './hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './jwt';
import type { AccessTokenPayload } from './types';

const router = Router();

// For parsing refresh token cookies
router.use(cookieParser());

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

router.post('/register', async (req: Request, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const { email, password, name } = parse.data;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash, name });

  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    tokenVersion: user.tokenVersion,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion });

  setRefreshCookie(res, refreshToken);
  return res.status(201).json({ accessToken, user: toPublicUser(user) });
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post('/login', async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const { email, password } = parse.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const payload: AccessTokenPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    tokenVersion: user.tokenVersion,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion });
  setRefreshCookie(res, refreshToken);

  return res.json({ accessToken, user: toPublicUser(user) });
});

router.post('/logout', async (_req: Request, res: Response) => {
  // Clear cookie and rely on tokenVersion bump to invalidate existing refresh tokens
  clearRefreshCookie(res);
  return res.status(204).send();
});

router.post('/refresh', async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (user.tokenVersion !== payload.tokenVersion)
      return res.status(401).json({ message: 'Token revoked' });

    const access: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      tokenVersion: user.tokenVersion,
    };
    const accessToken = signAccessToken(access);

    // Optionally rotate refresh token occasionally
    const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion });
    setRefreshCookie(res, refreshToken);

    return res.json({ accessToken, user: toPublicUser(user) });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

function setRefreshCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
}

function toPublicUser(u: any) {
  return { id: u.id, email: u.email, name: u.name, plan: u.plan };
}

export default router;
