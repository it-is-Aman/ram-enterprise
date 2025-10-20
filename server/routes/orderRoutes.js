import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} from '../controllers/orderController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Order routes
router.get('/', authenticateToken, getOrders); // Can filter by userId in query
router.get('/stats', authenticateToken, isAdmin, getOrderStats); // Admin only
router.get('/:id', authenticateToken, getOrder);
router.post('/', authenticateToken, createOrder);
router.patch('/:id/status', authenticateToken, isAdmin, updateOrderStatus); // Admin only
router.patch('/:id/cancel', authenticateToken, cancelOrder);

export default router;
