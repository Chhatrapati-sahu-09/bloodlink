const express = require('express');
const {
  getBloodBankDashboard,
  getBloodRequestManagement,
  updateRequestStatus,
  getDonationRecords,
  addDonation,
  getInventorySummary
} = require('../controllers/BloodBankController');
const { auth, roleGuard } = require('../middlewares/auth');

const router = express.Router();

// All routes require BLOODBANK role
router.use(auth, roleGuard(['BLOODBANK']));

// Dashboard
router.get('/dashboard', getBloodBankDashboard);

// Request management
router.get('/requests', getBloodRequestManagement);
router.put('/requests/:id/status', updateRequestStatus);

// Donation records
router.get('/donations', getDonationRecords);
router.post('/donations', addDonation);

// Inventory
router.get('/inventory', getInventorySummary);

module.exports = router;