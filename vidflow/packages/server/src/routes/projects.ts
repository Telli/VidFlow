import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../auth/middleware';
import { Project } from '../models';
import { userCanAccessProject, userIsProjectOwner } from '../utils/authz';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1),
  settings: z.record(z.any()).optional(),
});

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const uid = req.user!.id;
  const projects = await Project.find({
    $or: [{ ownerId: uid }, { collaboratorIds: uid }],
  })
    .sort({ updatedAt: -1 })
    .lean();
  res.json(projects.map(toPublicProject));
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const uid = req.user!.id;
  const doc = await Project.create({ name: parse.data.name, ownerId: uid, settings: parse.data.settings ?? {} });
  res.status(201).json(toPublicProject(doc));
});

router.get('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const uid = req.user!.id;
  const can = await userCanAccessProject(uid, id);
  if (!can) return res.status(404).json({ message: 'Project not found' });
  const doc = await Project.findById(id);
  if (!doc) return res.status(404).json({ message: 'Project not found' });
  res.json(toPublicProject(doc));
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  settings: z.record(z.any()).optional(),
});

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const uid = req.user!.id;
  const owner = await userIsProjectOwner(uid, id);
  if (!owner) return res.status(403).json({ message: 'Forbidden' });
  const parse = updateSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const doc = await Project.findByIdAndUpdate(id, parse.data, { new: true });
  if (!doc) return res.status(404).json({ message: 'Project not found' });
  res.json(toPublicProject(doc));
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const uid = req.user!.id;
  const owner = await userIsProjectOwner(uid, id);
  if (!owner) return res.status(403).json({ message: 'Forbidden' });
  await Project.findByIdAndDelete(id);
  res.status(204).send();
});

// Collaborator management
const collabSchema = z.object({ userId: z.string() });
router.post('/:id/collaborators', requireAuth, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const uid = req.user!.id;
  const owner = await userIsProjectOwner(uid, id);
  if (!owner) return res.status(403).json({ message: 'Forbidden' });
  const parse = collabSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const updated = await Project.findByIdAndUpdate(
    id,
    { $addToSet: { collaboratorIds: parse.data.userId } },
    { new: true },
  );
  if (!updated) return res.status(404).json({ message: 'Project not found' });
  res.json(toPublicProject(updated));
});

router.delete('/:id/collaborators/:userId', requireAuth, async (req: AuthRequest, res) => {
  const { id, userId } = req.params;
  const uid = req.user!.id;
  const owner = await userIsProjectOwner(uid, id);
  if (!owner) return res.status(403).json({ message: 'Forbidden' });
  const updated = await Project.findByIdAndUpdate(
    id,
    { $pull: { collaboratorIds: userId } },
    { new: true },
  );
  if (!updated) return res.status(404).json({ message: 'Project not found' });
  res.json(toPublicProject(updated));
});

function toPublicProject(p: any) {
  return {
    id: p._id?.toString?.() ?? p.id,
    name: p.name,
    ownerId: p.ownerId?.toString?.() ?? p.ownerId,
    collaboratorIds: (p.collaboratorIds ?? []).map((c: any) => c.toString?.() ?? c),
    settings: p.settings ?? {},
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export default router;
