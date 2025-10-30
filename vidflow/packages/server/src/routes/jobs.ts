import { Router } from 'express';
import { requireAuth, AuthRequest } from '../auth/middleware';
import { videoQueue, videoQueueEvents } from '../queues/videoQueue';

const router = Router();

router.post('/video', requireAuth, async (req: AuthRequest, res) => {
  const job = await videoQueue.add('generate', { projectId: req.body?.projectId, userId: req.user!.id });
  res.status(202).json({ jobId: job.id });
});

router.get('/video/:id/progress', requireAuth, async (req: AuthRequest, res) => {
  const id = req.params.id;
  try {
    const job = await videoQueue.getJob(id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const state = await job.getState();
    const progress = job.progress as number;
    res.json({ state, progress });
  } catch (e) {
    res.status(400).json({ message: 'Invalid job id' });
  }
});

export default router;
