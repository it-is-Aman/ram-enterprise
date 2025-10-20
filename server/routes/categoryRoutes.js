import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', authenticateToken, getCategories);
router.get('/:id', authenticateToken, getCategory);

// Admin routes
router.post('/', authenticateToken, isAdmin, createCategory);
router.put('/:id', authenticateToken, isAdmin, updateCategory);
router.delete('/:id', authenticateToken, isAdmin, deleteCategory);

export default router;
