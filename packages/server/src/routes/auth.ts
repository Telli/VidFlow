import { Router } from 'express';
import { register, login, refresh, getCurrentUser } from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.get('/me', authenticate, getCurrentUser);

export default router;
