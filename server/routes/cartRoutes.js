import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Cart routes (require authentication)
router.get('/:userId', authenticateToken, getCart);
router.post('/:userId/items', authenticateToken, addToCart);
router.put('/:userId/items/:itemId', authenticateToken, updateCartItem);
router.delete('/:userId/items/:itemId', authenticateToken, removeFromCart);
router.delete('/:userId', authenticateToken, clearCart);

export default router;
