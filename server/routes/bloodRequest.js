const express = require('express');
const {
  createRequest,
  getRequests,
  approveRequest,
  rejectRequest,
  completeRequest,
  searchBlood
} = require('../controllers/BloodRequestController');
const { auth, roleGuard } = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, roleGuard(['PATIENT']), createRequest);
router.get('/', auth, getRequests);
router.put('/:id/approve', auth, roleGuard(['BLOODBANK']), approveRequest);
router.put('/:id/reject', auth, roleGuard(['BLOODBANK']), rejectRequest);
router.put('/:id/complete', auth, roleGuard(['BLOODBANK']), completeRequest);
router.get('/search', auth, searchBlood);

module.exports = router;