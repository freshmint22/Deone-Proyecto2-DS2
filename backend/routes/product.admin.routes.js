import { Router } from 'express';
import { createProduct, updateProduct, deleteProduct } from '../controllers/productAdminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRole.js';

const router = Router();

router.post('/', authMiddleware, checkRole('comercio','admin'), createProduct);
router.put('/:id', authMiddleware, checkRole('comercio','admin'), updateProduct);
router.delete('/:id', authMiddleware, checkRole('comercio','admin'), deleteProduct);

export default router;
