import express from 'express';
import {
  getDashboardStats,
  getSalesAnalytics
} from '../controllers/dashboardController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Dashboard routes (Admin only)
router.get('/stats', authenticateToken, isAdmin, getDashboardStats);
router.get('/analytics', authenticateToken, isAdmin, getSalesAnalytics);

export default router;
