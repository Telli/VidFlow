export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  tokenVersion: number;
}

export interface RefreshTokenPayload {
  sub: string; // user id
  tokenVersion: number;
}
