import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistItem
} from '../controllers/wishlistController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Wishlist routes (require authentication)
router.get('/:userId', authenticateToken, getWishlist);
router.post('/:userId/items', authenticateToken, addToWishlist);
router.delete('/:userId/items/:productId', authenticateToken, removeFromWishlist);
router.delete('/:userId', authenticateToken, clearWishlist);
router.get('/:userId/check/:productId', authenticateToken, checkWishlistItem);

export default router;
