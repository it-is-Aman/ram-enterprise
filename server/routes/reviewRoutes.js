import express from 'express';
import {
  getProductReviews,
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewStats
} from '../controllers/reviewController.js';

const router = express.Router();

// Review routes
router.get('/', getAllReviews); // Admin - get all reviews
router.get('/product/:productId', getProductReviews); // Get reviews for a product
router.get('/product/:productId/stats', getReviewStats); // Get review statistics for a product
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
