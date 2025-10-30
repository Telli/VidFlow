import { Router } from 'express';
import { z } from 'zod';
import { ApiKey } from '../models';
import { encrypt, decrypt } from '../security/crypto';
import { requireAuth, AuthRequest } from '../auth/middleware';

const router = Router();

const createSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'google', 'stability', 'other']),
  name: z.string().min(1),
  key: z.string().min(10),
});

router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const keys = await ApiKey.find({ userId: req.user!.id }).select('-encryptedKey -iv -authTag');
  res.json(keys);
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const parse = createSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const { provider, name, key } = parse.data;
  const enc = encrypt(key);
  const saved = await ApiKey.create({
    userId: req.user!.id,
    provider,
    name,
    encryptedKey: enc.ciphertext,
    iv: enc.iv,
    authTag: enc.authTag,
  });
  res.status(201).json({ id: saved.id, provider: saved.provider, name: saved.name });
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  await ApiKey.deleteOne({ _id: req.params.id, userId: req.user!.id });
  res.status(204).send();
});

export default router;
