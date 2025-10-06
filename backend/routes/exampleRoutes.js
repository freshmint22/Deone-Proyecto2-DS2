import { Router } from 'express';
import { getExamples } from '../controllers/exampleController.js';

const router = Router();

router.get('/', getExamples);

export default router;
