import express from 'express';
import {
  getProductReviews,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats,
  getReviewById,
  updateReviewVerification
} from '../controllers/reviewController.js';
import { authenticateToken, isAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Review routes
router.get('/', authenticateToken, isAdmin, getAllReviews); // Admin - get all reviews
router.get('/product/:productId', optionalAuth, getProductReviews); // Get reviews for a product (public)
router.get('/product/:productId/stats', getReviewStats); // Get review statistics for a product (public)
router.get('/:id', optionalAuth, getReviewById); // Get single review by ID (public)
router.post('/', authenticateToken, createReview); // Requires login
router.put('/:id', authenticateToken, updateReview); // Requires login
router.patch('/:id/verification', authenticateToken, isAdmin, updateReviewVerification); // Admin only
router.delete('/:id', authenticateToken, deleteReview); // Requires login

export default router;
