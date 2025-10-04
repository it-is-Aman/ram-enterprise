import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlistItem
} from '../controllers/wishlistController.js';

const router = express.Router();

// Wishlist routes (require user ID in params)
router.get('/:userId', getWishlist);
router.post('/:userId/items', addToWishlist);
router.delete('/:userId/items/:productId', removeFromWishlist);
router.delete('/:userId', clearWishlist);
router.get('/:userId/check/:productId', checkWishlistItem);

export default router;
