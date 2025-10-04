import express from 'express';
import {
  getInquiries,
  getInquiry,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
  getInquiryStats
} from '../controllers/inquiryController.js';

const router = express.Router();

// Inquiry routes
router.get('/', getInquiries); // Can filter by userId in query
router.get('/stats', getInquiryStats); // Admin only
router.get('/:id', getInquiry);
router.post('/', createInquiry);
router.patch('/:id/status', updateInquiryStatus); // Admin only
router.delete('/:id', deleteInquiry); // Admin only

export default router;
