import { Router } from 'express';
import { body } from 'express-validator';
import { register } from '../controllers/registerController.js';
import { login } from '../controllers/loginController.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();

// POST /api/auth/register
router.post('/register',
  [
    body('name').isString().trim().notEmpty().withMessage('name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  validateRequest,
  register
);

// POST /api/auth/login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  login
);

export default router;
