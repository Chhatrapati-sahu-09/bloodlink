const express = require('express');
const {
  createRequest,
  getRequests,
  approveRequest,
  rejectRequest,
  completeRequest
} = require('../controllers/requestController');
const { auth, roleGuard } = require('../middlewares/auth');

const router = express.Router();

// Create request - HOSPITAL role
router.post('/', auth, roleGuard(['HOSPITAL']), createRequest);

// Get requests - BLOODBANK role
router.get('/', auth, roleGuard(['BLOODBANK']), getRequests);

// Approve request - BLOODBANK role
router.put('/:id/approve', auth, roleGuard(['BLOODBANK']), approveRequest);

// Reject request - BLOODBANK role
router.put('/:id/reject', auth, roleGuard(['BLOODBANK']), rejectRequest);

// Complete request - BLOODBANK role
router.put('/:id/complete', auth, roleGuard(['BLOODBANK']), completeRequest);

module.exports = router;