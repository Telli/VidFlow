import { Router } from 'express';
import { z } from 'zod';
import { providerFactory } from '../services/ai/providers';
import type { AIRequest } from '../services/ai/types';
import { requireAuth, AuthRequest } from '../auth/middleware';

const router = Router();

const schema = z.object({
  provider: z.enum(['openai', 'anthropic', 'google', 'stability']),
  model: z.string(),
  prompt: z.string(),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
});

router.post('/stream', requireAuth, async (req: AuthRequest, res) => {
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ errors: parse.error.flatten() });
  const request = parse.data as AIRequest;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  const provider = providerFactory(request.provider);
  await provider.stream(request, (chunk) => {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  });

  res.end();
});

export default router;
