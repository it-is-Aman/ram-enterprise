import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  verifyToken
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);
router.get('/verify', authenticateToken, verifyToken);

export default router;
