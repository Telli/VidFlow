import type { Server as HttpServer } from 'http';
import { Server, type Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createRedisClients } from '../redis';
import { verifyAccessToken } from '../auth/jwt';

interface AuthedSocket extends Socket {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export function initSocketServer(httpServer: HttpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || true,
      credentials: true,
    },
    path: '/socket.io',
  });

  try {
    const { pub, sub } = createRedisClients();
    io.adapter(createAdapter(pub as any, sub as any));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Redis adapter not initialized, running in single-node mode');
  }

  io.use((socket: AuthedSocket, next) => {
    try {
      const token = extractToken(socket);
      const payload = verifyAccessToken(token);
      socket.user = { id: payload.sub, name: payload.name, email: payload.email };
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: AuthedSocket) => {
    const user = socket.user!;

    socket.on('project:join', ({ projectId }: { projectId: string }) => {
      socket.join(projectRoom(projectId));
      socket.to(projectRoom(projectId)).emit('presence:join', { userId: user.id });
    });

    socket.on('project:leave', ({ projectId }: { projectId: string }) => {
      socket.leave(projectRoom(projectId));
      socket.to(projectRoom(projectId)).emit('presence:leave', { userId: user.id });
    });

    socket.on('cursor:move', ({ projectId, x, y }: { projectId: string; x: number; y: number }) => {
      socket.to(projectRoom(projectId)).emit('cursor:move', { userId: user.id, x, y });
    });

    // Node events
    socket.on('node:create', (payload: any & { projectId: string }) => {
      socket.to(projectRoom(payload.projectId)).emit('node:create', { ...payload, userId: user.id });
    });

    socket.on('node:update', (payload: any & { projectId: string }) => {
      socket.to(projectRoom(payload.projectId)).emit('node:update', { ...payload, userId: user.id });
    });

    socket.on('node:delete', (payload: any & { projectId: string }) => {
      socket.to(projectRoom(payload.projectId)).emit('node:delete', { ...payload, userId: user.id });
    });

    // Connection events
    socket.on('connection:create', (payload: any & { projectId: string }) => {
      socket.to(projectRoom(payload.projectId)).emit('connection:create', { ...payload, userId: user.id });
    });

    socket.on('connection:delete', (payload: any & { projectId: string }) => {
      socket.to(projectRoom(payload.projectId)).emit('connection:delete', { ...payload, userId: user.id });
    });
  });

  return io;
}

function extractToken(socket: Socket): string {
  // Prefer query param, fallback to header
  const fromQuery = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (typeof fromQuery === 'string' && fromQuery.length > 0) return fromQuery;
  const header = socket.handshake.headers['authorization'];
  if (typeof header === 'string' && header.startsWith('Bearer ')) return header.slice(7);
  throw new Error('No token');
}

function projectRoom(projectId: string) {
  return `project:${projectId}`;
}
