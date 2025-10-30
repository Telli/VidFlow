import { z } from 'zod';

export enum NodeType {
  SCENE = 'scene',
  AUDIO = 'audio',
  MANIM = 'manim',
  TRANSITION = 'transition',
  IMAGE = 'image',
  VIDEO = 'video',
  TEXT = 'text',
}

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  STABILITYAI = 'stabilityai',
}

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const NodeSettingsSchema = z.object({
  provider: z.nativeEnum(AIProvider).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().optional(),
  systemPrompt: z.string().optional(),
  useCustomApiKey: z.boolean().optional(),
});

export const NodeContentSchema = z.object({
  prompt: z.string().optional(),
  response: z.string().optional(),
  mediaUrl: z.string().optional(),
  duration: z.number().optional(),
  status: z.enum(['idle', 'processing', 'completed', 'error']).default('idle'),
  error: z.string().optional(),
});

export const NodeSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  type: z.nativeEnum(NodeType),
  position: PositionSchema,
  settings: NodeSettingsSchema.optional(),
  content: NodeContentSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Node = z.infer<typeof NodeSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type NodeSettings = z.infer<typeof NodeSettingsSchema>;
export type NodeContent = z.infer<typeof NodeContentSchema>;

export const CreateNodeSchema = z.object({
  projectId: z.string(),
  type: z.nativeEnum(NodeType),
  position: PositionSchema,
  settings: NodeSettingsSchema.optional(),
  content: NodeContentSchema.optional(),
});

export type CreateNode = z.infer<typeof CreateNodeSchema>;

export const UpdateNodeSchema = z.object({
  position: PositionSchema.optional(),
  settings: NodeSettingsSchema.optional(),
  content: NodeContentSchema.optional(),
});

export type UpdateNode = z.infer<typeof UpdateNodeSchema>;
