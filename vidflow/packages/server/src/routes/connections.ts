import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../auth/middleware';
import { Connection, EditorNode } from '../models';
import { userCanAccessProject } from '../utils/authz';

const router = Router();

const createSchema = z.object({
  projectId: z.string(),
  fromNodeId: z.string(),
  toNodeId: z.string(),
  type: z.enum(['default', 'conditional', 'audio', 'video']).default('default'),
});

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const { projectId } = req.query as { projectId?: string };
  if (!projectId) return res.status(400).json({ message: 'projectId required' });
  const can = await userCanAccessProject(req.user!.id, projectId);
  if (!can) return res.status(404).json({ message: 'Project not found' });
  const connections = await Connection.find({ projectId }).lean();
  res.json(connections.map(toPublicConnection));
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const { projectId, fromNodeId, toNodeId, type } = parse.data;
  const can = await userCanAccessProject(req.user!.id, projectId);
  if (!can) return res.status(404).json({ message: 'Project not found' });

  const [fromNode, toNode] = await Promise.all([
    EditorNode.findById(fromNodeId),
    EditorNode.findById(toNodeId),
  ]);
  if (!fromNode || !toNode || fromNode.projectId.toString() !== projectId || toNode.projectId.toString() !== projectId) {
    return res.status(400).json({ message: 'Invalid node references' });
  }

  const created = await Connection.create({ projectId, fromNodeId, toNodeId, type });
  res.status(201).json(toPublicConnection(created));
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const conn = await Connection.findById(id);
  if (!conn) return res.status(404).json({ message: 'Connection not found' });
  const can = await userCanAccessProject(req.user!.id, conn.projectId.toString());
  if (!can) return res.status(404).json({ message: 'Connection not found' });
  await Connection.findByIdAndDelete(id);
  res.status(204).send();
});

function toPublicConnection(c: any) {
  return {
    id: c._id?.toString?.() ?? c.id,
    projectId: c.projectId?.toString?.() ?? c.projectId,
    fromNodeId: c.fromNodeId?.toString?.() ?? c.fromNodeId,
    toNodeId: c.toNodeId?.toString?.() ?? c.toNodeId,
    type: c.type,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export default router;
