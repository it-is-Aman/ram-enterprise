import express from 'express';
import {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryStats
} from '../controllers/inquiryController.js';
import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Inquiry routes
router.get('/', authenticateToken, getInquiries); // Can filter by userId in query
router.get('/stats', authenticateToken, isAdmin, getInquiryStats); // Admin only
router.get('/:id', authenticateToken, getInquiry);
router.post('/', authenticateToken, createInquiry);
router.patch('/:id/status', authenticateToken, isAdmin, updateInquiryStatus); // Admin only
router.delete('/:id', authenticateToken, isAdmin, deleteInquiry); // Admin only

export default router;
