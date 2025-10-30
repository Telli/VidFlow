import jwt, { type Secret } from 'jsonwebtoken';
import type { AccessTokenPayload, RefreshTokenPayload } from './types';

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_TTL || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_TTL || '7d';

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN as any });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN as any });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as RefreshTokenPayload;
}
