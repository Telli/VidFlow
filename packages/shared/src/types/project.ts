import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  ownerId: z.string(),
  collaborators: z.array(
    z.object({
      userId: z.string(),
      role: z.enum(['viewer', 'editor', 'admin']),
    })
  ),
  settings: z
    .object({
      videoFormat: z.string().default('mp4'),
      resolution: z.string().default('1920x1080'),
      fps: z.number().default(30),
      backgroundColor: z.string().default('#000000'),
    })
    .optional(),
  thumbnail: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  settings: z
    .object({
      videoFormat: z.string().optional(),
      resolution: z.string().optional(),
      fps: z.number().optional(),
      backgroundColor: z.string().optional(),
    })
    .optional(),
});

export type CreateProject = z.infer<typeof CreateProjectSchema>;

export const UpdateProjectSchema = CreateProjectSchema.partial();

export type UpdateProject = z.infer<typeof UpdateProjectSchema>;
