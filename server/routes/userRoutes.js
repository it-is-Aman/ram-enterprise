import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';

const router = express.Router();

// User routes
router.get('/', getUsers); // Admin only
router.get('/stats', getUserStats); // Admin only
router.get('/:id', getUser);
router.post('/', createUser); // For testing - will be replaced with auth
router.put('/:id', updateUser);
router.delete('/:id', deleteUser); // Admin only

export default router;
