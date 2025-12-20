const express = require('express');
const {
  getPatientDashboard,
  searchBlood,
  createBloodRequest,
  getRequestTracking,
  updateRequest,
  cancelRequest,
  getEmergencyAlerts
} = require('../controllers/PatientController');
const { auth, roleGuard } = require('../middlewares/auth');

const router = express.Router();

// All routes require PATIENT role
router.use(auth, roleGuard(['PATIENT']));

// Dashboard
router.get('/dashboard', getPatientDashboard);

// Blood search
router.get('/search-blood', searchBlood);

// Request management
router.post('/requests', createBloodRequest);
router.get('/requests', getRequestTracking);
router.put('/requests/:id', updateRequest);
router.put('/requests/:id/cancel', cancelRequest);

// Emergency alerts
router.get('/emergency-alerts', getEmergencyAlerts);

module.exports = router;