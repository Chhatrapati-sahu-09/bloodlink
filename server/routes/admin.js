const express = require('express');
const {
  getStats,
  approveUser,
  blockUser,
  getAuditLogs
} = require('../controllers/adminController');
const { auth, roleGuard } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication and ADMIN role
router.use(auth);
router.use(roleGuard(['ADMIN']));

// GET /api/admin/stats - View system statistics
router.get('/stats', getStats);

// PUT /api/admin/users/:userId/approve - Approve blood bank or hospital
router.put('/users/:userId/approve', approveUser);

// PUT /api/admin/users/:userId/block - Block user
router.put('/users/:userId/block', blockUser);

// GET /api/admin/audit-logs - View audit logs
router.get('/audit-logs', getAuditLogs);

module.exports = router;