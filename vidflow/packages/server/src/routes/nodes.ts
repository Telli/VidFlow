import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../auth/middleware';
import { EditorNode, Project } from '../models';
import { userCanAccessProject } from '../utils/authz';

const router = Router();

const createSchema = z.object({
  projectId: z.string(),
  type: z.enum(['scene', 'audio', 'manim', 'transition', 'custom']),
  position: z.object({ x: z.number(), y: z.number() }),
  settings: z.record(z.any()).optional(),
  content: z.any().optional(),
});

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { projectId } = req.query as { projectId?: string };
  if (!projectId) return res.status(400).json({ message: 'projectId required' });
  const can = await userCanAccessProject(req.user!.id, projectId);
  if (!can) return res.status(404).json({ message: 'Project not found' });
  const nodes = await EditorNode.find({ projectId }).lean();
  res.json(nodes.map(toPublicNode));
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const can = await userCanAccessProject(req.user!.id, parse.data.projectId);
  if (!can) return res.status(404).json({ message: 'Project not found' });
  const node = await EditorNode.create({
    projectId: parse.data.projectId,
    type: parse.data.type,
    position: parse.data.position,
    settings: parse.data.settings ?? {},
    content: parse.data.content,
  });
  res.status(201).json(toPublicNode(node));
});

const updateSchema = z.object({
  position: z.object({ x: z.number(), y: z.number() }).optional(),
  settings: z.record(z.any()).optional(),
  content: z.any().optional(),
});

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const node = await EditorNode.findById(id);
  if (!node) return res.status(404).json({ message: 'Node not found' });
  const can = await userCanAccessProject(req.user!.id, node.projectId.toString());
  if (!can) return res.status(404).json({ message: 'Node not found' });
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const updated = await EditorNode.findByIdAndUpdate(id, parse.data, { new: true });
  res.json(toPublicNode(updated!));
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const node = await EditorNode.findById(id);
  if (!node) return res.status(404).json({ message: 'Node not found' });
  const can = await userCanAccessProject(req.user!.id, node.projectId.toString());
  if (!can) return res.status(404).json({ message: 'Node not found' });
  await EditorNode.findByIdAndDelete(id);
  res.status(204).send();
});

function toPublicNode(n: any) {
  return {
    id: n._id?.toString?.() ?? n.id,
    projectId: n.projectId?.toString?.() ?? n.projectId,
    type: n.type,
    position: n.position,
    settings: n.settings ?? {},
    content: n.content,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

export default router;
