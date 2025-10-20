import express from 'express';
import {
  getProducts,
  getProduct,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock
} from '../controllers/productController.js';

const router = express.Router();

// Public routes
router.get('/',authenticateToken,  getProducts);
router.get('/featured',authenticateToken,  getFeaturedProducts);
router.get('/:id',authenticateToken,  getProduct);

// Admin routes
router.post('/',authenticateToken,  isAdmin, createProduct);
router.put('/:id',authenticateToken,  isAdmin, updateProduct);
router.patch('/:id/stock',authenticateToken,  isAdmin, updateStock);
router.delete('/:id',authenticateToken,  isAdmin, deleteProduct);

export default router;
