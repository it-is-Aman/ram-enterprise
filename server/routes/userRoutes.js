import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admin-only routes
router.get('/', authenticateToken, isAdmin, getUsers);
router.get('/stats', authenticateToken, isAdmin, getUserStats);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

// User routes
router.get('/:id', authenticateToken, getUser);
router.post('/', createUser); // For testing/admin creation
router.put('/:id', authenticateToken, updateUser);

export default router;
