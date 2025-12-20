const express = require('express');
const { getInventory, addInventory, updateInventory } = require('../controllers/inventoryController');
const { auth, roleGuard } = require('../middlewares/auth');

const router = express.Router();

// All routes require authentication and BLOODBANK role
router.use(auth);
router.use(roleGuard(['BLOODBANK']));

// GET /api/inventory - Get inventory for the logged-in blood bank
router.get('/', getInventory);

// POST /api/inventory - Add new inventory item
router.post('/', addInventory);

// PUT /api/inventory/:id - Update inventory item
router.put('/:id', updateInventory);

module.exports = router;