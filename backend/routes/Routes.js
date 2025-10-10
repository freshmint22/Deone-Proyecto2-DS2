import { Router } from 'express';
import { getItems } from '../controllers/Controller.js';

const router = Router();

router.get('/', getItems);

export default router;
