import { Router } from 'express';
import { register, login } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { getMe, updateMe } from '../controllers/profileController.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Protected profile endpoints
router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);

export default router;
