import express from 'express';
import {
  getDashboardStats,
  getSalesAnalytics
} from '../controllers/dashboardController.js';

const router = express.Router();

// Dashboard routes (Admin only - will add auth middleware later)
router.get('/stats', getDashboardStats);
router.get('/analytics', getSalesAnalytics);

export default router;
