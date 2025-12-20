const express = require('express');
const {
  getDonorProfile,
  createDonorProfile,
  updateDonorProfile,
  getAllDonors,
  getEligibleDonors
} = require('../controllers/DonorController');
const { auth, roleGuard } = require('../middlewares/auth');

const router = express.Router();

router.get('/profile', auth, roleGuard(['DONOR']), getDonorProfile);
router.post('/profile', auth, roleGuard(['DONOR']), createDonorProfile);
router.put('/profile', auth, roleGuard(['DONOR']), updateDonorProfile);
router.get('/', auth, roleGuard(['BLOODBANK']), getAllDonors);
router.get('/eligible', auth, getEligibleDonors);

module.exports = router;