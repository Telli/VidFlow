import { z } from 'zod';

export enum ConnectionType {
  SEQUENTIAL = 'sequential',
  PARALLEL = 'parallel',
  CONDITIONAL = 'conditional',
}

export const ConnectionSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  fromNodeId: z.string(),
  toNodeId: z.string(),
  fromHandle: z.string().optional(),
  toHandle: z.string().optional(),
  type: z.nativeEnum(ConnectionType).default(ConnectionType.SEQUENTIAL),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Connection = z.infer<typeof ConnectionSchema>;

export const CreateConnectionSchema = z.object({
  projectId: z.string(),
  fromNodeId: z.string(),
  toNodeId: z.string(),
  fromHandle: z.string().optional(),
  toHandle: z.string().optional(),
  type: z.nativeEnum(ConnectionType).optional(),
});

export type CreateConnection = z.infer<typeof CreateConnectionSchema>;
