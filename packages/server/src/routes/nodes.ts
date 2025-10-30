import { Router } from 'express';
import {
  createNode,
  getNodesByProject,
  updateNode,
  deleteNode,
} from '@/controllers/nodeController';
import { authenticate } from '@/middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', createNode);
router.get('/project/:projectId', getNodesByProject);
router.put('/:id', updateNode);
router.delete('/:id', deleteNode);

export default router;
