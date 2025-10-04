import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes
router.get('/', getOrders); // Can filter by userId in query
router.get('/stats', getOrderStats); // Admin only
router.get('/:id', getOrder);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus); // Admin only
router.patch('/:id/cancel', cancelOrder);

export default router;
